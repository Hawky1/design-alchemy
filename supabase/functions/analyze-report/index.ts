import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins - add your production domain here
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://lovable.dev',
  'https://viotepfhdproajmntrfp.lovableproject.com',
];

// Function to check if origin is allowed (includes *.lovableproject.com and *.lovable.app patterns)
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  if (origin.match(/^https:\/\/id-preview--[a-z0-9-]+\.lovable\.app$/)) return true;
  return false;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting config
const RATE_LIMIT_WINDOW_MINUTES = 60;
const RATE_LIMIT_MAX_REQUESTS = 20;

// Max payload size: 10MB
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024;
// Max file size per upload: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ============================================
// STEP 1 PROMPT: Extract Data from Reports
// ============================================
const STEP1_EXTRACT_PROMPT = `You are a credit report data extractor. Extract structured data from the credit report PDFs.

CRITICAL: Keep your response UNDER 4000 tokens total. Be concise.

RULES:
- Mask sensitive data (only last 4 of SSN/account numbers)  
- If information is missing, use null
- Limit masterTradelineTable to TOP 15 accounts only (prioritize: collections, charge-offs, late payments)
- Limit inquiries to TOP 10 most recent
- Keep all string values SHORT (max 50 chars)

Return JSON with this structure:
{
  "reportSummary": {
    "reportDate": "string",
    "consumerName": "string",
    "totalAccountsAnalyzed": number,
    "consumerState": "string or null",
    "bureausAnalyzed": ["EQ", "EX", "TU"]
  },
  "personalInfoMismatches": [
    { "type": "string", "equifaxValue": "string", "experianValue": "string", "transunionValue": "string", "concern": "string" }
  ],
  "inquiries": [
    { "date": "string", "requesterName": "string", "type": "hard/soft", "bureau": "EQ/EX/TU" }
  ],
  "masterTradelineTable": [
    {
      "furnisherName": "string",
      "accountType": "string",
      "openDate": "string",
      "accountNumberLast4": "string",
      "originalAmount": "string",
      "perBureauData": {
        "equifax": { "status": "string", "currentBalance": "string", "creditLimit": "string" },
        "experian": { "status": "string", "currentBalance": "string", "creditLimit": "string" },
        "transunion": { "status": "string", "currentBalance": "string", "creditLimit": "string" }
      },
      "discrepanciesNoted": ["string"]
    }
  ],
  "publicRecords": {
    "bankruptcyPresent": false,
    "bankruptcyType": "string or null",
    "filingDate": "string or null"
  }
}`;

// ============================================
// STEP 2 PROMPT: Analyze Credit Health
// ============================================
const STEP2_ANALYZE_PROMPT = `You are a credit health analyst. Using the extracted data provided, calculate metrics and diagnose credit health.

RULES:
- Show ALL math calculations
- Use "Potential issue" language, never "violation"
- Be conservative with flags

Return JSON with this EXACT structure (keep response under 6000 tokens):
{
  "creditUtilization": {
    "totalRevolvingBalance": number,
    "totalRevolvingLimit": number,
    "totalUtilization": number,
    "totalUtilizationPercent": "string",
    "calculationShown": "string (e.g., '$4,520 / $10,000 = 45.2%')",
    "perCardUtilization": [
      { "accountName": "string", "balance": number, "limit": number, "utilization": number, "utilizationPercent": "string", "flagged": boolean, "flagReason": "string", "limitMissing": boolean }
    ],
    "accountsMissingLimit": ["string"],
    "flaggedThresholds": { "above30Percent": ["string"], "above50Percent": ["string"], "above90Percent": ["string"] },
    "paydownOrder": ["string"]
  },
  "ageOfCredit": {
    "oldestAccountAge": "string",
    "oldestAccountName": "string",
    "newestAccountAge": "string",
    "newestAccountName": "string",
    "averageAgeOfAccounts": "string",
    "averageAgeFormula": "string",
    "averageAgeRevolvingOnly": "string",
    "accountsMissingOpenDate": ["string"],
    "accountsWithOpenDates": number
  },
  "creditMix": {
    "revolving": { "openCount": number, "closedCount": number, "derogatoryCount": number },
    "installment": { "autoCount": number, "personalCount": number, "studentCount": number, "otherCount": number, "statuses": ["string"] },
    "mortgage": { "count": number, "statuses": ["string"] },
    "collections": { "count": number, "totalBalance": number, "totalBalanceFormatted": "string" },
    "publicRecords": { "bankruptcyPresent": false, "bankruptcyType": "string", "filingDate": "string", "dischargeDate": "string" },
    "mixWeaknesses": ["string"]
  },
  "creditHealthDiagnosis": {
    "likelyTopSuppressors": ["string"],
    "highUtilizationIssues": ["string"],
    "derogatoryIssues": ["string"],
    "thinFileIndicators": ["string"],
    "recentInquiriesIssues": ["string"],
    "collectionInconsistencies": ["string"]
  }
}`;

// ============================================
// STEP 3 PROMPT: Flag Issues & Action Plan
// ============================================
const STEP3_FLAGS_PROMPT = `You are a consumer protection issue spotter. Review the data and analysis to flag potential FCRA/FDCPA issues and create an action plan.

CRITICAL RULES:
- Use "Potential issue" language - NEVER say "this is a violation"
- Include "Evidence needed" for every flag
- Be CONSERVATIVE - only flag what the report clearly supports

Return JSON with this EXACT structure (keep response under 8000 tokens):
{
  "executiveSummary": [
    { "bullet": "string" }
  ],
  "sixCategoryIssueFlags": {
    "category1_duplicateReporting": [
      { "category": 1, "flagTypeName": "Possible Duplicate/Double Reporting", "accountsInvolved": "string", "whyFlagged": "string (≤25 words)", "evidenceNeeded": "string", "priority": "High/Med/Low" }
    ],
    "category2_identityTheft": [],
    "category3_wrongBalanceStatus": [],
    "category4_postBankruptcyMisreporting": [],
    "category5_debtCollectionRedFlags": [],
    "category6_legalDateObsolescence": []
  },
  "consumerActionPlan": {
    "next7Days": [{ "action": "string", "priority": "High/Med/Low", "details": "string", "impactReason": "string" }],
    "next30Days": [{ "action": "string", "priority": "High/Med/Low", "details": "string", "impactReason": "string" }],
    "next90Days": [{ "action": "string", "priority": "High/Med/Low", "details": "string", "impactReason": "string" }],
    "utilizationPaydownOrder": ["string"],
    "autopayRecommendations": ["string"],
    "avoidNewInquiries": true,
    "disputesToFileFirst": ["string"],
    "documentationChecklist": ["string"],
    "questionsToAskConsumer": ["string (max 12)"]
  },
  "notDetectableFromReport": [
    { "item": "string", "explanation": "string" }
  ],
  "legalSummary": {
    "totalFcraViolations": number,
    "totalFdcpaViolations": number,
    "totalViolations": number,
    "highSeverityCount": number,
    "mediumSeverityCount": number,
    "lowSeverityCount": number,
    "attorneyReferralRecommended": true,
    "estimatedDamagesPotential": "Low/Moderate/Significant",
    "estimatedDamagesRange": "string"
  },
  "summary": "string (2-4 sentences)"
}

The 6 categories to scan for:
1) DUPLICATE/DOUBLE REPORTING - Same debt reported twice
2) IDENTITY THEFT INDICATORS - Unfamiliar accounts, address mismatches
3) WRONG BALANCE/STATUS - Paid accounts showing balances
4) POST-BANKRUPTCY MISREPORTING - Discharged debts showing owed
5) DEBT COLLECTION RED FLAGS - Missing original creditor, inconsistent amounts
6) LEGAL DATE/OBSOLESCENCE - Old debts, possible re-aging`;

// Helper function to call Gemini API
async function callGemini(
  apiKey: string, 
  systemPrompt: string, 
  userContent: string, 
  fileParts: Array<{ inline_data: { mime_type: string; data: string } } | { text: string }> = []
): Promise<{ success: boolean; data?: unknown; error?: string; rawResponse?: string }> {
  try {
    const parts = [
      { text: systemPrompt },
      { text: userContent },
      ...fileParts
    ];

    console.log(`Calling Gemini with prompt length: ${systemPrompt.length + userContent.length} chars`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 32768
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    
    // Check for finish reason
    const finishReason = data.candidates?.[0]?.finishReason;
    console.log(`Gemini finish reason: ${finishReason}`);
    
    if (finishReason === 'MAX_TOKENS') {
      console.error('Response was truncated due to MAX_TOKENS');
    }
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('No content in Gemini response:', JSON.stringify(data).substring(0, 500));
      return { success: false, error: 'Empty response from AI' };
    }

    console.log(`Response length: ${content.length} chars`);

    // Parse JSON with repair logic
    try {
      const parsed = JSON.parse(content);
      return { success: true, data: parsed };
    } catch (parseError) {
      console.log('JSON parse failed, attempting repair...');
      console.log('First 500 chars:', content.substring(0, 500));
      console.log('Last 500 chars:', content.substring(content.length - 500));
      
      const repaired = repairJson(content);
      if (repaired) {
        console.log('JSON repair successful');
        return { success: true, data: repaired };
      }
      return { success: false, error: 'Failed to parse response', rawResponse: content.substring(0, 1000) };
    }
  } catch (error) {
    console.error('Gemini call error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// JSON repair function
function repairJson(content: string): unknown | null {
  try {
    // Step 1: Remove trailing incomplete content
    let repaired = content
      .replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/g, '')
      .replace(/,\s*"[^"]*"\s*:\s*$/g, '')
      .replace(/,\s*"[^"]*$/g, '')
      .replace(/,\s*$/g, '');

    // Step 2: Fix unclosed strings
    const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      repaired += '"';
    }

    // Step 3: Balance brackets and braces
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;

    // Clean trailing commas
    repaired = repaired.replace(/,(\s*)([\]}])/g, '$1$2');
    repaired = repaired.replace(/,(\s*)$/, '$1');

    // Add missing closures
    for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
    for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';

    return JSON.parse(repaired);
  } catch (e) {
    // Last resort: find complete JSON object
    try {
      let braceDepth = 0;
      let lastValidEnd = -1;
      let inString = false;
      let escapeNext = false;

      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (escapeNext) { escapeNext = false; continue; }
        if (char === '\\' && inString) { escapeNext = true; continue; }
        if (char === '"') { inString = !inString; continue; }
        if (!inString) {
          if (char === '{') braceDepth++;
          else if (char === '}') {
            braceDepth--;
            if (braceDepth === 0) lastValidEnd = i + 1;
          }
        }
      }

      if (lastValidEnd > 0) {
        return JSON.parse(content.substring(0, lastValidEnd));
      }
    } catch {
      console.error('All JSON repair attempts failed');
    }
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze report function called - Multi-step analysis');
    
    // === INPUT VALIDATION: Check Content-Length header ===
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const payloadSize = parseInt(contentLength, 10);
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        console.warn(`Payload too large: ${payloadSize} bytes (max: ${MAX_PAYLOAD_SIZE})`);
        return new Response(
          JSON.stringify({ error: 'Payload Too Large', code: 413 }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // === ORIGIN CHECK ===
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    
    if (!origin && !referer) {
      console.warn('Request blocked: No origin or referer header');
      return new Response(
        JSON.stringify({ error: 'Direct API access is not allowed. Please use the web application.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);
    if (!isOriginAllowed(requestOrigin)) {
      console.warn(`Request blocked: Origin not allowed - ${requestOrigin}`);
      return new Response(
        JSON.stringify({ error: 'Access denied. This API is only accessible from authorized applications.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Origin verified: ${requestOrigin}`);
    
    // === EXTRACT CLIENT IP ===
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || req.headers.get('cf-connecting-ip')
      || 'unknown';
    
    console.log(`Client IP: ${clientIP}`);
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', code: 500 }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', code: 500 }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // === RATE LIMITING CHECK ===
    if (clientIP !== 'unknown') {
      const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
      
      const { count, error: countError } = await supabaseAdmin
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', clientIP)
        .gte('created_at', oneHourAgo);
      
      if (countError) {
        console.error('Rate limit check failed:', countError);
      } else {
        console.log(`Rate limit check: ${count}/${RATE_LIMIT_MAX_REQUESTS} requests from IP ${clientIP}`);
        
        if (count !== null && count >= RATE_LIMIT_MAX_REQUESTS) {
          console.warn(`Rate limit exceeded for IP: ${clientIP}`);
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded. Please try again later.',
              retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(RATE_LIMIT_WINDOW_MINUTES * 60) } }
          );
        }
      }
    }

    // Parse form data
    const formData = await req.formData();
    const experianFile = formData.get('experian') as File | null;
    const equifaxFile = formData.get('equifax') as File | null;
    const transunionFile = formData.get('transunion') as File | null;
    
    // Validate file sizes
    const files = [
      { name: 'experian', file: experianFile },
      { name: 'equifax', file: equifaxFile },
      { name: 'transunion', file: transunionFile }
    ];
    
    for (const { name, file } of files) {
      if (file && file.size > MAX_FILE_SIZE) {
        console.warn(`File ${name} too large: ${file.size} bytes`);
        return new Response(
          JSON.stringify({ error: `File ${name} exceeds maximum size of 5MB`, code: 413 }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Get lead data
    const leadName = formData.get('leadName') as string | null;
    const leadEmail = formData.get('leadEmail') as string | null;

    console.log('Files received:', {
      experian: experianFile?.name,
      equifax: equifaxFile?.name,
      transunion: transunionFile?.name
    });
    
    // Save lead data
    if (leadName && leadEmail) {
      const { error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({ name: leadName, email: leadEmail, ip_address: clientIP !== 'unknown' ? clientIP : null });
      
      if (leadError) {
        console.error('Failed to save lead:', leadError);
      } else {
        console.log('Lead saved successfully');
      }
    }

    // Convert PDF files to base64
    const fileParts: Array<{ inline_data: { mime_type: string; data: string } } | { text: string }> = [];
    const bureauNames: string[] = [];
    
    if (experianFile) {
      const arrayBuffer = await experianFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({ inline_data: { mime_type: "application/pdf", data: base64Data } });
      fileParts.push({ text: "The above PDF is the EXPERIAN credit report." });
      bureauNames.push('Experian');
      console.log(`Experian file processed, size: ${experianFile.size} bytes`);
    }
    
    if (equifaxFile) {
      const arrayBuffer = await equifaxFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({ inline_data: { mime_type: "application/pdf", data: base64Data } });
      fileParts.push({ text: "The above PDF is the EQUIFAX credit report." });
      bureauNames.push('Equifax');
      console.log(`Equifax file processed, size: ${equifaxFile.size} bytes`);
    }
    
    if (transunionFile) {
      const arrayBuffer = await transunionFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({ inline_data: { mime_type: "application/pdf", data: base64Data } });
      fileParts.push({ text: "The above PDF is the TRANSUNION credit report." });
      bureauNames.push('TransUnion');
      console.log(`TransUnion file processed, size: ${transunionFile.size} bytes`);
    }

    if (fileParts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No credit report files provided', code: 400 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting multi-step analysis with', bureauNames.length, 'PDF files...');
    
    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Progress updates
          const sendProgress = (progress: number, message: string) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress, message })}\n\n`));
          };

          sendProgress(5, 'Uploading PDF files...');

          // ========== STEP 1: Extract Data ==========
          sendProgress(10, 'Step 1/3: Extracting data from credit reports...');
          
          const step1Result = await callGemini(
            GEMINI_API_KEY,
            STEP1_EXTRACT_PROMPT,
            `Analyze the following ${bureauNames.length} credit report(s) from: ${bureauNames.join(', ')}. Extract all tradelines, inquiries, and personal info mismatches.`,
            fileParts
          );

          if (!step1Result.success) {
            console.error('Step 1 failed:', step1Result.error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to extract data from reports. Please try again.' })}\n\n`));
            controller.close();
            return;
          }

          console.log('Step 1 completed: Data extracted');
          const extractedData = step1Result.data as Record<string, unknown>;
          sendProgress(35, 'Step 2/3: Analyzing credit health metrics...');

          // ========== STEP 2: Analyze Credit Health ==========
          const step2Result = await callGemini(
            GEMINI_API_KEY,
            STEP2_ANALYZE_PROMPT,
            `Analyze the following extracted credit report data and calculate all metrics:\n\n${JSON.stringify(extractedData, null, 2)}`,
            []
          );

          if (!step2Result.success) {
            console.error('Step 2 failed:', step2Result.error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to analyze credit health. Please try again.' })}\n\n`));
            controller.close();
            return;
          }

          console.log('Step 2 completed: Credit health analyzed');
          const analysisData = step2Result.data as Record<string, unknown>;
          sendProgress(65, 'Step 3/3: Identifying issues and building action plan...');

          // ========== STEP 3: Flag Issues & Action Plan ==========
          const combinedData = { ...extractedData, ...analysisData };
          
          const step3Result = await callGemini(
            GEMINI_API_KEY,
            STEP3_FLAGS_PROMPT,
            `Review this credit report data and analysis to identify FCRA/FDCPA issues and create a consumer action plan:\n\n${JSON.stringify(combinedData, null, 2)}`,
            []
          );

          if (!step3Result.success) {
            console.error('Step 3 failed:', step3Result.error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to generate action plan. Please try again.' })}\n\n`));
            controller.close();
            return;
          }

          console.log('Step 3 completed: Issues flagged and action plan created');
          const flagsData = step3Result.data as Record<string, unknown>;
          sendProgress(90, 'Finalizing comprehensive credit audit report...');

          // ========== Merge Results ==========
          const finalResult = {
            ...extractedData,
            ...analysisData,
            ...flagsData
          };

          console.log('All 3 steps completed successfully');
          sendProgress(95, 'Report ready!');
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: finalResult })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          
        } catch (streamError) {
          console.error('Stream error:', streamError instanceof Error ? streamError.stack : streamError);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'An error occurred. Please try again.' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error: unknown) {
    console.error('Unhandled error:', error instanceof Error ? error.stack : error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', code: 500 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
