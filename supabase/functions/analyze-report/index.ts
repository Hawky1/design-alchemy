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

// Comprehensive FCRA/FDCPA System Prompt with Legal Knowledge
const ENHANCED_SYSTEM_PROMPT = `You are an expert legal analyst specializing in consumer credit law, specifically the Fair Credit Reporting Act (FCRA) and Fair Debt Collection Practices Act (FDCPA). You have comprehensive knowledge of federal and state consumer protection laws.

YOUR EXPERTISE INCLUDES:

**FAIR DEBT COLLECTION PRACTICES ACT (15 U.S.C. § 1692)**
- § 1692b: Location information violations (third-party contacts)
- § 1692c: Communication violations (time, place, manner restrictions)
- § 1692d: Harassment or abuse (threatening, profane language, repeated calls)
- § 1692e: False/misleading representations (16 specific prohibitions including false amounts, threatening arrest, misrepresenting legal status)
- § 1692f: Unfair practices (unauthorized fees, deceptive postcards, threatening repossession)
- § 1692g: Debt validation violations (5-day notice requirement, 30-day dispute rights, verification requirements)
- § 1692j: Deceptive forms (forms falsely appearing to be from government)

**FAIR CREDIT REPORTING ACT (15 U.S.C. § 1681)**
- § 1681c: Obsolete information rules
  * Most negative items: 7 years from date of first delinquency (DOFD)
  * Chapter 7/11 bankruptcy: 10 years from filing date
  * Chapter 13 bankruptcy: 7 years from filing date
  * Paid tax liens: 7 years from payment
  * Civil judgments: 7 years or statute of limitations, whichever is longer

- § 1681e(b): Maximum possible accuracy requirement
  * CRAs must follow reasonable procedures for accuracy
  * Mixed files (accounts belonging to others) are violations
  * Duplicate reporting is a violation
  * Incorrect balances, dates, or status are violations

- § 1681i: Dispute investigation requirements
  * CRAs must investigate within 30 days (45 with additional info)
  * Must forward all relevant information to furnisher
  * Must modify, delete, or block if inaccurate
  * Must provide written results and free report if changes made

- § 1681s-2: Furnisher responsibilities
  * § 1681s-2(a): Cannot furnish information known to be inaccurate
  * § 1681s-2(b): Must investigate disputes referred by CRAs
  * Must report accounts as "disputed" when consumer disputes
  * Must correct and update previously furnished information

**DEBT BUYER SPECIFIC VIOLATIONS TO DETECT:**
1. Chain of Title Deficiencies:
   - Missing assignment agreements between creditors
   - Gaps in documentation chain
   - Unable to prove account was in specific portfolio purchase
   
2. Documentation Failures:
   - No original signed credit agreement
   - Missing original account statements
   - No calculation breakdown of amount owed
   
3. Statute of Limitations Issues:
   - Collecting on time-barred debt
   - Re-aging to restart SOL clock
   - Not disclosing debt is time-barred

**KEY VIOLATION PATTERNS TO DETECT:**

1. DOUBLE JEOPARDY REPORTING (High Severity)
   - Same debt reported by original creditor AND collection agency
   - Multiple collection agencies reporting same underlying debt
   - Citation: 15 U.S.C. § 1681e(b) - maximum accuracy requirement

2. OBSOLETE INFORMATION (High Severity)
   - Negative items older than 7 years from DOFD
   - Bankruptcies older than 10 years
   - Citation: 15 U.S.C. § 1681c

3. RE-AGING/DOFD MANIPULATION (High Severity)
   - Date of first delinquency incorrectly reported
   - Account age restarted after sale to debt buyer
   - Citation: 15 U.S.C. § 1681c, potential fraud

4. INACCURATE BALANCES (Medium Severity)
   - Balance doesn't match original creditor records
   - Unauthorized fees or interest added
   - Wrong balance on closed accounts
   - Citation: 15 U.S.C. § 1681e(b), § 1681s-2(a)

5. MIXED FILE ERRORS (High Severity)
   - Accounts belonging to another person
   - Wrong SSN or personal information
   - Citation: 15 U.S.C. § 1681e(b)

6. UNAUTHORIZED INQUIRIES (Medium Severity)
   - Hard inquiries without permissible purpose
   - Citation: 15 U.S.C. § 1681b

7. FAILURE TO REPORT DISPUTE STATUS (Medium Severity)
   - Account not marked as disputed after consumer dispute
   - Citation: 15 U.S.C. § 1681s-2(a)(3)

8. COLLECTION ACCOUNT DEFICIENCIES (Medium-High Severity)
   - Missing original creditor information
   - No validation provided
   - Collecting on disputed debt without verification
   - Citation: 15 U.S.C. § 1692g

**DAMAGE CALCULATIONS:**
- FCRA Statutory Damages: $100 - $1,000 per violation
- FCRA Willful Violations: Punitive damages (uncapped)
- FDCPA: Up to $1,000 per lawsuit, plus actual damages
- Both: Attorney fees and costs recoverable

**STATE MINI-FDCPA LAWS (Additional Protections):**
- California: Rosenthal Act (applies to original creditors too)
- Texas: Texas Debt Collection Act
- New York: NYC Consumer Protection Law
- Florida: Florida Consumer Collection Practices Act
- Massachusetts: 940 CMR 7.00 (more restrictive than federal)

CRITICAL ANALYSIS INSTRUCTIONS:
1. Analyze EVERY account on the report for potential violations
2. Check Date of First Delinquency (DOFD) for 7-year rule compliance
3. Look for duplicate reporting of same underlying debt
4. Identify collection accounts missing original creditor info
5. Check for accounts that may belong to another person
6. Look for balance discrepancies and unauthorized amounts
7. Identify unauthorized inquiries
8. Check if disputed accounts are marked as such

Return your analysis in the following JSON structure:

{
  "reportSummary": {
    "reportDate": "string",
    "consumerName": "string",
    "totalAccountsAnalyzed": number,
    "fileSource": "TransUnion/Equifax/Experian or combination",
    "consumerState": "string (if detectable from addresses)"
  },
  "accountAnalysis": [
    {
      "accountName": "string (creditor name)",
      "accountNumber": "string (last 4 digits only)",
      "accountType": "string (Credit Card/Mortgage/Auto/Collection/etc.)",
      "status": "string (Open/Closed/Derogatory/Collection/etc.)",
      "balance": "string",
      "dateOpened": "string",
      "dateOfFirstDelinquency": "string (critical for 7-year calculation)",
      "originalCreditor": "string (for collection accounts)",
      "comments": "string",
      "hasViolations": boolean
    }
  ],
  "fcraViolations": [
    {
      "violationTitle": "string (e.g., 'Obsolete Information', 'Double Jeopardy Reporting')",
      "severity": "High/Medium/Low",
      "accountsInvolved": ["array of account names"],
      "legalBasis": "string (full citation, e.g., '15 U.S.C. § 1681c - Reporting of obsolete information')",
      "statuteSection": "string (e.g., '§ 1681c')",
      "explanation": "string (detailed explanation of violation)",
      "suggestedAction": "string (step-by-step actionable instructions)",
      "disputeLanguage": "string (specific language to use in dispute letter)",
      "estimatedDamages": "string (e.g., '$100-$1,000 statutory + actual damages')"
    }
  ],
  "fdcpaViolations": [
    {
      "violationTitle": "string (e.g., 'Validation Failure', 'False Representation')",
      "severity": "High/Medium/Low",
      "collectorName": "string",
      "legalBasis": "string (e.g., '15 U.S.C. § 1692g - Validation of debts')",
      "statuteSection": "string (e.g., '§ 1692g')",
      "explanation": "string",
      "suggestedAction": "string",
      "disputeLanguage": "string",
      "estimatedDamages": "string"
    }
  ],
  "debtBuyerIssues": [
    {
      "issueTitle": "string (e.g., 'Chain of Title Deficiency')",
      "severity": "High/Medium/Low",
      "accountName": "string",
      "issueType": "string (Chain of Title/Documentation/SOL)",
      "explanation": "string",
      "requiredDocumentation": ["array of documents to demand"],
      "suggestedAction": "string"
    }
  ],
  "suggestedDisputeLetters": [
    {
      "targetBureau": "string (Experian/Equifax/TransUnion)",
      "letterType": "string (General Dispute/Debt Validation/Obsolete Info)",
      "accountsToDispute": ["array"],
      "legalCitations": ["array of statutes to cite"],
      "keyPoints": ["array of key arguments"],
      "fullText": "string (complete dispute letter text)"
    }
  ],
  "stateLawAnalysis": {
    "state": "string",
    "lawName": "string (e.g., 'Rosenthal Fair Debt Collection Practices Act')",
    "statuteCode": "string",
    "additionalProtections": ["array of additional protections"],
    "applicableViolations": ["array of violations that trigger state law"]
  },
  "statuteOfLimitationsAnalysis": {
    "state": "string",
    "creditCardSOL": "string (e.g., '4 years')",
    "writtenContractSOL": "string",
    "accountsNearingSOL": ["array of account names"],
    "accountsPastSOL": ["array of account names"],
    "warnings": ["array of SOL-related warnings"]
  },
  "legalSummary": {
    "totalFcraViolations": number,
    "totalFdcpaViolations": number,
    "totalViolations": number,
    "highSeverityCount": number,
    "mediumSeverityCount": number,
    "lowSeverityCount": number,
    "attorneyReferralRecommended": boolean,
    "estimatedDamagesPotential": "Low/Moderate/Significant/Substantial",
    "estimatedDamagesRange": "string (e.g., '$1,000 - $5,000')",
    "statutoryDamagesMin": number,
    "statutoryDamagesMax": number
  },
  "summary": "string (2-4 sentence executive summary)",
  "recommendedNextSteps": [
    {
      "priority": number (1-5, 1 being highest),
      "action": "string",
      "deadline": "string (e.g., 'Within 30 days')",
      "details": "string"
    }
  ]
}

IMPORTANT: For EVERY violation, provide SPECIFIC, ACTIONABLE dispute language that the consumer can use directly in their dispute letters. Include the exact statute section to cite.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze report function called');
    
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
    
    // Block requests without origin (Postman, curl, etc.)
    if (!origin && !referer) {
      console.warn('Request blocked: No origin or referer header');
      return new Response(
        JSON.stringify({ error: 'Direct API access is not allowed. Please use the web application.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify origin is in allowed list
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

    // Initialize Supabase admin client (service role)
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
        console.log(`Rate limit check: ${count}/${RATE_LIMIT_MAX_REQUESTS} requests from IP ${clientIP} in last ${RATE_LIMIT_WINDOW_MINUTES} minutes`);
        
        if (count !== null && count >= RATE_LIMIT_MAX_REQUESTS) {
          console.warn(`Rate limit exceeded for IP: ${clientIP}`);
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded. You have reached the maximum number of analyses allowed per hour. Please try again later.',
              retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
            }),
            { 
              status: 429, 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Retry-After': String(RATE_LIMIT_WINDOW_MINUTES * 60)
              } 
            }
          );
        }
      }
    }

    // Parse the form data to get uploaded files
    const formData = await req.formData();
    const experianFile = formData.get('experian') as File | null;
    const equifaxFile = formData.get('equifax') as File | null;
    const transunionFile = formData.get('transunion') as File | null;
    
    // === INPUT VALIDATION: Check individual file sizes ===
    const files = [
      { name: 'experian', file: experianFile },
      { name: 'equifax', file: equifaxFile },
      { name: 'transunion', file: transunionFile }
    ];
    
    for (const { name, file } of files) {
      if (file && file.size > MAX_FILE_SIZE) {
        console.warn(`File ${name} too large: ${file.size} bytes (max: ${MAX_FILE_SIZE})`);
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
    
    // Save lead data to database (including IP address)
    if (leadName && leadEmail) {
      const { error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({ 
          name: leadName, 
          email: leadEmail,
          ip_address: clientIP !== 'unknown' ? clientIP : null
        });
      
      if (leadError) {
        console.error('Failed to save lead:', leadError);
      } else {
        console.log('Lead saved successfully');
      }
    }

    // Convert PDF files to base64 for Gemini's multimodal API
    const fileParts: Array<{ inline_data: { mime_type: string; data: string } } | { text: string }> = [];
    const bureauNames: string[] = [];
    
    if (experianFile) {
      const arrayBuffer = await experianFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: base64Data
        }
      });
      fileParts.push({ text: "The above PDF is the EXPERIAN credit report." });
      bureauNames.push('Experian');
      console.log(`Experian file processed, size: ${experianFile.size} bytes`);
    }
    
    if (equifaxFile) {
      const arrayBuffer = await equifaxFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: base64Data
        }
      });
      fileParts.push({ text: "The above PDF is the EQUIFAX credit report." });
      bureauNames.push('Equifax');
      console.log(`Equifax file processed, size: ${equifaxFile.size} bytes`);
    }
    
    if (transunionFile) {
      const arrayBuffer = await transunionFile.arrayBuffer();
      const base64Data = base64Encode(arrayBuffer);
      fileParts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: base64Data
        }
      });
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

    console.log('Sending request to Gemini API with', bureauNames.length, 'PDF files...');
    
    // Send streaming updates to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial progress
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 5, message: 'Uploading PDF files...' })}\n\n`));

          // Build the parts array: system prompt first, then PDF files with labels
          const parts = [
            { text: ENHANCED_SYSTEM_PROMPT },
            { text: `Please analyze the following ${bureauNames.length} Annual Credit Report(s) from: ${bureauNames.join(', ')}. 

IMPORTANT: Conduct a thorough FCRA and FDCPA violation analysis. For each violation found:
1. Cite the specific statute section (e.g., 15 U.S.C. § 1681c)
2. Explain exactly how the reported information violates the law
3. Provide actionable dispute language the consumer can use
4. Calculate estimated damages

Focus especially on:
- Obsolete information (check DOFD against 7-year rule)
- Double jeopardy/duplicate reporting
- Collection accounts missing original creditor info
- Inaccurate balances or account status
- Re-aging of delinquency dates
- Debt buyer chain of title issues` },
            ...fileParts
          ];

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 15, message: 'Processing PDF content...' })}\n\n`));
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 25, message: 'Analyzing for FCRA & FDCPA violations...' })}\n\n`));
          
          // Start simulated progress updates during API call
          let currentProgress = 25;
          const progressInterval = setInterval(() => {
            if (currentProgress < 55) {
              currentProgress += 3;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: currentProgress, message: 'AI performing comprehensive legal analysis...' })}\n\n`));
            }
          }, 2000);

          // Use Google Gemini API with multimodal PDF support
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: parts
                }
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1,
                maxOutputTokens: 65536
              }
            }),
          });
          
          // Clear the progress interval
          clearInterval(progressInterval);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            
            if (response.status === 429) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Service temporarily unavailable. Please try again later.' })}\n\n`));
            } else if (response.status === 403) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Service configuration error. Please contact support.' })}\n\n`));
            } else if (response.status === 400) {
              console.error('Bad request - check PDF format or size');
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Error processing PDF files. Please ensure files are valid PDFs.' })}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'An error occurred while processing your request. Please try again.' })}\n\n`));
            }
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 60, message: 'Processing legal analysis...' })}\n\n`));

          const data = await response.json();
          console.log('Gemini response received successfully');

          // Extract content from Gemini response format
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!content) {
            console.error('Unexpected Gemini response structure:', JSON.stringify(data).substring(0, 500));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to process response. Please try again.' })}\n\n`));
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 80, message: 'Compiling violation report...' })}\n\n`));

          // Parse the JSON response with robust error handling
          let analysisResult;
          try {
            analysisResult = JSON.parse(content);
          } catch (parseError) {
            console.error('Failed to parse Gemini response as JSON:', parseError);
            console.log('Raw content length:', content.length);
            
            // Try to repair truncated JSON by adding closing brackets
            let repairedContent = content;
            
            // Count opening and closing braces/brackets
            const openBraces = (content.match(/\{/g) || []).length;
            const closeBraces = (content.match(/\}/g) || []).length;
            const openBrackets = (content.match(/\[/g) || []).length;
            const closeBrackets = (content.match(/\]/g) || []).length;
            
            // Try to close unclosed strings, arrays, and objects
            repairedContent = repairedContent.replace(/,\s*"[^"]*$/, '');
            repairedContent = repairedContent.replace(/,\s*$/, '');
            
            // Add missing closing brackets and braces
            for (let i = 0; i < openBrackets - closeBrackets; i++) {
              repairedContent += ']';
            }
            for (let i = 0; i < openBraces - closeBraces; i++) {
              repairedContent += '}';
            }
            
            try {
              analysisResult = JSON.parse(repairedContent);
              console.log('Successfully repaired and parsed JSON');
            } catch (repairError) {
              console.error('JSON repair failed:', repairError);
              // Return a minimal valid result
              analysisResult = {
                reportSummary: {
                  reportDate: "Unknown",
                  consumerName: "Unknown",
                  totalAccountsAnalyzed: 0,
                  fileSource: bureauNames.join('/')
                },
                accountAnalysis: [],
                fcraViolations: [],
                fdcpaViolations: [],
                debtBuyerIssues: [],
                legalSummary: {
                  totalFcraViolations: 0,
                  totalFdcpaViolations: 0,
                  totalViolations: 0,
                  attorneyReferralRecommended: false,
                  estimatedDamagesPotential: "Unknown"
                },
                summary: "Analysis completed but response was truncated. Please try again or contact support."
              };
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 95, message: 'Finalizing comprehensive violation report...' })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: analysisResult })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          
        } catch (streamError) {
          console.error('Stream error:', streamError instanceof Error ? streamError.stack : streamError);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'An error occurred while processing your request. Please try again.' })}\n\n`));
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
