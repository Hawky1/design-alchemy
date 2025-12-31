import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
// SINGLE COMPREHENSIVE PROMPT
// ============================================
const ANALYSIS_PROMPT = `You are a credit report analyzer for consumer-facing reporting.

GOAL

From the provided credit report content, produce a single VALID JSON output that:

1) Extracts structured credit data needed to populate a report

2) Computes credit metrics with explicit math

3) Flags ONLY clearly-supported potential consumer-law issues (FCRA/FDCPA/other) conservatively

4) Detects potential write-off/charge-off amounts not reflected in balances (status-line checks)

5) Checks balance history arithmetic for potential miscalculations (where data exists)

6) Drafts dispute letters for each negative/derogatory account (one letter per account)

CRITICAL OUTPUT RULES

- Output VALID JSON only. No markdown, no commentary.

- Keep total response under 4000 tokens.

- Mask sensitive data: show ONLY last4 for SSN and account numbers.

- If a field is missing or not clearly stated, use null (do not guess).

- Be conservative: use the phrase "Potential issue" (never "violation").

- Evidence: every flagged item MUST include "evidenceNeeded".

- Limit masterTradelineTable to TOP 15 accounts (prioritize: collections, charge-offs, late pays).

- Limit inquiries to TOP 10 most recent.

- Final accounts[] list: MAX 10 (prioritize derogatory).

- Final potentialIssues[] list: MAX 10.

- Keep non-letter strings short (<= 50 chars) EXCEPT letter bodies.

- Letters: include accountNumberLast4 and creditor/collector name; do not include full account numbers.

- If data conflicts across bureaus/sections, record it as a mismatch instead of choosing one.

MATH RULES

- Show ALL math calculations in a human-readable string inside fields ending with "Calc".

- If calculation is impossible due to missing fields, set metric value to null and explain briefly in the *Calc field.

WRITE-OFF / STATUS-LINE CHECKS

- If status/status line indicates "charged off", "written off", "profit and loss", "CO", "charge-off amount", or similar:

  - Extract any write-off/charge-off amount and compare against current balance.

  - If write-off amount appears separate and not included in balance OR totals don't reconcile, flag as:

    "Potential issue: Write-off not reconciled" with exact text evidence.

  - Never assume how furnishers report; just compare what is present.

BALANCE HISTORY CHECKS

- If monthly balance history is present (or payment history + balances):

  - Create a timeline list (month -> balance) where possible.

  - Identify any internal inconsistencies (e.g., balance increases while marked paid/closed with no explanation, impossible jumps relative to stated payment/limit).

  - Do not infer interest rates. Only flag arithmetic or stated-text inconsistencies.

  - If no history exists, set balanceHistoryCheck to null.

DISPUTE LETTERS

- Create one letter per negative account in accounts[] that is derogatory (collection, charge-off, 30/60/90+, repo, foreclosure, settled for less, etc.).

- Letter must:

  - Address: "To Whom It May Concern" (unless bureau/collector address is explicitly provided)

  - Identify consumer as placeholders ({{ConsumerName}}, {{ConsumerAddress}}, {{CityStateZip}}, {{DOB}}, {{ReportDate}})

  - Identify account: creditor/collector name, accountNumberLast4, and any bureau reference if present.

  - State "I am disputing the accuracy of the information" and request investigation + verification method.

  - Include a short bullet list of dispute points derived ONLY from detected potential issues or inconsistencies.

  - Include "Requested outcome" (delete/correct/update) consistent with conservative framing.

  - Include "Enclosures" placeholder list.

- Do NOT cite laws aggressively. You may mention "my rights under the FCRA/FDCPA" but keep it restrained and conditional.

RETURN EXACTLY THIS JSON STRUCTURE (all top-level keys must exist even if null/empty)

{
  "reportSummary": {...},
  "executiveSummary": [...],
  "creditUtilization": {...},
  "ageOfCredit": {...},
  "creditMix": {...},
  "masterTradelineTable": [...],
  "accounts": [...],
  "sixCategoryIssueFlags": {...},
  "consumerActionPlan": {...},
  "notDetectableFromReport": [...],
  "legalSummary": {...},
  "summary": "..."
}

DETAILED FIELD SCHEMAS

reportSummary:
{
  "bureau": string|null,
  "reportDate": string|null,
  "consumerName": "Redacted",
  "totalAccountsCount": number|null,
  "derogatoryAccountsCount": number|null
}

executiveSummary: array of 4-6 items
[
  { "bullet": "Key finding 1 about the credit report" },
  { "bullet": "Key finding 2..." },
  ...
]

creditUtilization:
{
  "totalRevolvingBalance": number|null,
  "totalRevolvingLimit": number|null,
  "utilizationPct": number|null,
  "totalUtilizationPercent": "X%",
  "utilizationCalc": "human readable calculation string",
  "notes": string|null,
  "perCardUtilization": [
    {
      "accountName": string,
      "balance": number,
      "limit": number,
      "utilization": number,
      "utilizationPercent": "X%",
      "flagged": boolean,
      "flagReason": string|null
    }
  ],
  "flaggedThresholds": {
    "above30Percent": [account names],
    "above50Percent": [account names],
    "above90Percent": [account names]
  },
  "paydownOrder": [account names in recommended order]
}

ageOfCredit:
{
  "oldestAccountAge": "X years Y months",
  "oldestAccountName": string,
  "newestAccountAge": "X years Y months",
  "newestAccountName": string,
  "averageAgeOfAccounts": "X years Y months",
  "averageAgeFormula": "calculation string"
}

creditMix:
{
  "revolvingCount": number,
  "installmentCount": number,
  "mortgageCount": number,
  "collections": { "count": number, "totalBalanceFormatted": "$X" },
  "mixWeaknesses": [strings]
}

masterTradelineTable: array (max 15) of
{
  "creditorName": string,
  "accountType": string,
  "accountNumberLast4": string|null,
  "status": string,
  "currentBalance": number,
  "isDerogatory": boolean
}

accounts: array (max 10, prioritize derogatory/collections) of
{
  "name": string,
  "type": string,
  "accountNumberLast4": string|null,
  "balance": number,
  "status": string,
  "potentialViolation": string|null,
  "discrepanciesNoted": [strings]|null
}

sixCategoryIssueFlags:
{
  "category1_duplicateReporting": [
    {
      "accountsInvolved": "Account names",
      "whyFlagged": "Reason",
      "evidenceNeeded": "What evidence to gather",
      "priority": "High"|"Med"|"Low"
    }
  ],
  "category2_identityTheft": [...same structure...],
  "category3_wrongBalanceStatus": [...same structure...],
  "category4_postBankruptcyMisreporting": [...same structure...],
  "category5_debtCollectionRedFlags": [...same structure...],
  "category6_legalDateObsolescence": [...same structure...]
}

consumerActionPlan:
{
  "next7Days": [
    { "action": "Action to take", "details": "More info", "priority": "High"|"Med"|"Low" }
  ],
  "next30Days": [...same structure...],
  "next90Days": [...same structure...],
  "disputesToFileFirst": ["Account 1", "Account 2"],
  "documentationChecklist": ["Document 1", "Document 2"],
  "questionsToAskConsumer": ["Question 1?", "Question 2?"]
}

notDetectableFromReport: array of
[
  { "item": "Identity theft", "explanation": "Requires police report or FTC affidavit" },
  { "item": "Payment history accuracy", "explanation": "Needs bank statements to verify" }
]

legalSummary:
{
  "totalViolations": number,
  "highSeverityCount": number,
  "mediumSeverityCount": number,
  "lowSeverityCount": number,
  "estimatedDamagesPotential": "Low"|"Moderate"|"Significant",
  "estimatedDamagesRange": "$X - $Y",
  "attorneyReferralRecommended": boolean
}

summary: string (2-3 sentences overall assessment of the credit report)

NOW ANALYZE THE PROVIDED CREDIT REPORT CONTENT AND RETURN ONLY THE JSON.`;

// Helper function to upload PDF to Gemini Files API
async function uploadPdfToGemini(
  apiKey: string,
  file: File,
  bureauName: string
): Promise<{ success: boolean; fileUri?: string; error?: string }> {
  try {
    console.log(`Uploading ${bureauName} PDF to Gemini Files API...`);
    
    // Step 1: Start resumable upload
    const startUploadResponse = await fetch(
      `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(file.size),
          'X-Goog-Upload-Header-Content-Type': 'application/pdf',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            display_name: `${bureauName}_credit_report_${Date.now()}.pdf`
          }
        })
      }
    );
    
    if (!startUploadResponse.ok) {
      const errorText = await startUploadResponse.text();
      console.error(`Failed to start upload for ${bureauName}:`, startUploadResponse.status, errorText);
      return { success: false, error: `Upload start failed: ${startUploadResponse.status}` };
    }
    
    const uploadUrl = startUploadResponse.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) {
      console.error(`No upload URL returned for ${bureauName}`);
      return { success: false, error: 'No upload URL returned' };
    }
    
    // Step 2: Upload the file bytes
    const fileBytes = await file.arrayBuffer();
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': String(file.size),
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize',
      },
      body: fileBytes
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`Failed to upload ${bureauName} PDF:`, uploadResponse.status, errorText);
      return { success: false, error: `Upload failed: ${uploadResponse.status}` };
    }
    
    const uploadResult = await uploadResponse.json();
    const fileUri = uploadResult.file?.uri;
    
    if (!fileUri) {
      console.error(`No file URI returned for ${bureauName}:`, uploadResult);
      return { success: false, error: 'No file URI returned' };
    }
    
    console.log(`${bureauName} PDF uploaded successfully, URI: ${fileUri}`);
    return { success: true, fileUri };
  } catch (error) {
    console.error(`Error uploading ${bureauName} PDF:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to delete file from Gemini
async function deleteGeminiFile(apiKey: string, fileUri: string): Promise<void> {
  try {
    // Extract file name from URI (format: https://generativelanguage.googleapis.com/v1beta/files/FILE_NAME)
    const fileName = fileUri.split('/').pop();
    if (!fileName) return;
    
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${apiKey}`,
      { method: 'DELETE' }
    );
    console.log(`Deleted Gemini file: ${fileName}`);
  } catch (error) {
    console.error(`Failed to delete Gemini file:`, error);
  }
}

// Helper function to call Gemini API with PDF file
async function callGeminiWithPdf(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  fileUri: string,
  bureauName: string
): Promise<{ success: boolean; data?: unknown; error?: string; rawResponse?: string }> {
  try {
    console.log(`Calling Gemini API for ${bureauName}...`);
    
    // Create abort controller with 300 second timeout (Gemini Pro can take longer for complex analysis)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error(`Gemini API call timed out for ${bureauName} after 300 seconds`);
      controller.abort();
    }, 300000);
    
    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    fileData: {
                      mimeType: 'application/pdf',
                      fileUri: fileUri
                    }
                  },
                  {
                    text: `${systemPrompt}\n\n${userPrompt}`
                  }
                ]
              }
            ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 65536,
            responseMimeType: 'application/json'
          }
          }),
          signal: controller.signal
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return { success: false, error: `Request timed out after 300 seconds for ${bureauName}` };
      }
      throw fetchError;
    }
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error for ${bureauName}:`, response.status, errorText);
      return { success: false, error: `API error: ${response.status} - ${errorText}` };
    }
    
    const data = await response.json();
    console.log(`Gemini API response received for ${bureauName}`);
    
    // Extract text content from response
    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!outputText) {
      console.error(`No text output in response for ${bureauName}:`, JSON.stringify(data).substring(0, 500));
      
      // Check for blocked content
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        return { success: false, error: 'Content blocked by safety filters' };
      }
      
      return { success: false, error: 'Empty response from AI' };
    }
    
    console.log(`Response text length for ${bureauName}: ${outputText.length} chars`);
    
    // Parse JSON
    try {
      const parsed = JSON.parse(outputText);
      return { success: true, data: parsed };
    } catch (parseError) {
      console.log(`JSON parse failed for ${bureauName}, attempting repair...`);
      const repaired = repairJson(outputText);
      if (repaired) {
        console.log(`JSON repair successful for ${bureauName}`);
        return { success: true, data: repaired };
      }
      return { success: false, error: 'Failed to parse response', rawResponse: outputText.substring(0, 1000) };
    }
  } catch (error) {
    console.error(`Gemini API call error for ${bureauName}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to merge multiple bureau results into one
function mergeAnalysisResults(results: { bureau: string; data: Record<string, unknown> }[]): Record<string, unknown> {
  if (results.length === 0) return {};
  if (results.length === 1) return results[0].data;
  
  // Start with the first result as base
  const merged: Record<string, unknown> = JSON.parse(JSON.stringify(results[0].data));
  const allBureaus = results.map(r => r.bureau).join(', ');
  
  // Update reportSummary with all bureaus
  if (merged.reportSummary && typeof merged.reportSummary === 'object') {
    (merged.reportSummary as Record<string, unknown>).bureau = allBureaus;
  }
  
  // Merge arrays from other results
  for (let i = 1; i < results.length; i++) {
    const other = results[i].data;
    
    // Merge masterTradelineTable
    if (Array.isArray(other.masterTradelineTable)) {
      const existing = (merged.masterTradelineTable as unknown[]) || [];
      merged.masterTradelineTable = [...existing, ...other.masterTradelineTable].slice(0, 15);
    }
    
    // Merge inquiries
    if (Array.isArray(other.inquiries)) {
      const existing = (merged.inquiries as unknown[]) || [];
      merged.inquiries = [...existing, ...other.inquiries].slice(0, 10);
    }
    
    // Merge publicRecords
    if (Array.isArray(other.publicRecords)) {
      const existing = (merged.publicRecords as unknown[]) || [];
      merged.publicRecords = [...existing, ...other.publicRecords];
    }
    
    // Merge personalInfoMismatches
    if (Array.isArray(other.personalInfoMismatches)) {
      const existing = (merged.personalInfoMismatches as unknown[]) || [];
      merged.personalInfoMismatches = [...existing, ...other.personalInfoMismatches];
    }
    
    // Merge consumerLawReview.potentialIssues
    if (other.consumerLawReview && typeof other.consumerLawReview === 'object') {
      const otherReview = other.consumerLawReview as Record<string, unknown>;
      if (!merged.consumerLawReview) merged.consumerLawReview = {};
      const mergedReview = merged.consumerLawReview as Record<string, unknown>;
      
      if (Array.isArray(otherReview.potentialIssues)) {
        const existing = (mergedReview.potentialIssues as unknown[]) || [];
        mergedReview.potentialIssues = [...existing, ...otherReview.potentialIssues].slice(0, 10);
      }
      
      if (Array.isArray(otherReview.actionPlan)) {
        const existing = (mergedReview.actionPlan as unknown[]) || [];
        mergedReview.actionPlan = [...existing, ...otherReview.actionPlan];
      }
    }
    
    // Merge finalReport arrays
    if (other.finalReport && typeof other.finalReport === 'object') {
      const otherFinal = other.finalReport as Record<string, unknown>;
      if (!merged.finalReport) merged.finalReport = {};
      const mergedFinal = merged.finalReport as Record<string, unknown>;
      
      if (Array.isArray(otherFinal.accounts)) {
        const existing = (mergedFinal.accounts as unknown[]) || [];
        mergedFinal.accounts = [...existing, ...otherFinal.accounts].slice(0, 10);
      }
      
      if (Array.isArray(otherFinal.fcraViolations)) {
        const existing = (mergedFinal.fcraViolations as unknown[]) || [];
        mergedFinal.fcraViolations = [...existing, ...otherFinal.fcraViolations].slice(0, 10);
      }
      
      if (Array.isArray(otherFinal.disputeLetters)) {
        const existing = (mergedFinal.disputeLetters as unknown[]) || [];
        mergedFinal.disputeLetters = [...existing, ...otherFinal.disputeLetters];
      }
    }
    
    // Sum up totalAccountsCount
    if (merged.reportSummary && other.reportSummary) {
      const mergedSummary = merged.reportSummary as Record<string, unknown>;
      const otherSummary = other.reportSummary as Record<string, unknown>;
      if (typeof otherSummary.totalAccountsCount === 'number') {
        mergedSummary.totalAccountsCount = ((mergedSummary.totalAccountsCount as number) || 0) + otherSummary.totalAccountsCount;
      }
      if (typeof otherSummary.derogatoryAccountsCount === 'number') {
        mergedSummary.derogatoryAccountsCount = ((mergedSummary.derogatoryAccountsCount as number) || 0) + otherSummary.derogatoryAccountsCount;
      }
    }
  }
  
  return merged;
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
    console.log('Analyze report function called - Using Gemini API with native PDF support');
    
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

    // Upload PDFs to Gemini Files API
    const uploadedFiles: { bureau: string; fileUri: string }[] = [];
    const bureauNames: string[] = [];
    
    if (experianFile) {
      const result = await uploadPdfToGemini(GEMINI_API_KEY, experianFile, 'Experian');
      if (result.success && result.fileUri) {
        uploadedFiles.push({ bureau: 'Experian', fileUri: result.fileUri });
        bureauNames.push('Experian');
      } else {
        console.error('Failed to upload Experian file:', result.error);
      }
    }
    
    if (equifaxFile) {
      const result = await uploadPdfToGemini(GEMINI_API_KEY, equifaxFile, 'Equifax');
      if (result.success && result.fileUri) {
        uploadedFiles.push({ bureau: 'Equifax', fileUri: result.fileUri });
        bureauNames.push('Equifax');
      } else {
        console.error('Failed to upload Equifax file:', result.error);
      }
    }
    
    if (transunionFile) {
      const result = await uploadPdfToGemini(GEMINI_API_KEY, transunionFile, 'TransUnion');
      if (result.success && result.fileUri) {
        uploadedFiles.push({ bureau: 'TransUnion', fileUri: result.fileUri });
        bureauNames.push('TransUnion');
      } else {
        console.error('Failed to upload TransUnion file:', result.error);
      }
    }

    if (uploadedFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload credit report files. Please try again.', code: 400 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting analysis with Gemini,', bureauNames.length, 'PDF files uploaded');
    
    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Progress updates
          const sendProgress = (progress: number, message: string) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress, message })}\n\n`));
          };

          sendProgress(10, 'PDF files uploaded...');
          sendProgress(20, `Analyzing ${bureauNames.join(', ')} credit reports with Gemini...`);

          // ========== SEQUENTIAL ANALYSIS OF EACH PDF ==========
          const bureauResults: { bureau: string; data: Record<string, unknown> }[] = [];
          const totalFiles = uploadedFiles.length;
          
          for (let i = 0; i < uploadedFiles.length; i++) {
            const { bureau, fileUri } = uploadedFiles[i];
            const progressBase = 20 + (i * 50 / totalFiles);
            
            sendProgress(progressBase, `Analyzing ${bureau} credit report (${i + 1}/${totalFiles})...`);
            
            const userPrompt = `Analyze this ${bureau} credit report. Extract all data, compute metrics, flag issues, check write-offs and balance history, and draft dispute letters as specified.`;
            
            const result = await callGeminiWithPdf(
              GEMINI_API_KEY,
              ANALYSIS_PROMPT,
              userPrompt,
              fileUri,
              bureau
            );
            
            // Delete the file after processing
            await deleteGeminiFile(GEMINI_API_KEY, fileUri);
            
            if (result.success && result.data) {
              bureauResults.push({ bureau, data: result.data as Record<string, unknown> });
              console.log(`Successfully analyzed ${bureau}`);
            } else {
              console.error(`Failed to analyze ${bureau}:`, result.error);
              sendProgress(progressBase + 10, `Warning: ${bureau} analysis failed - ${result.error?.includes('timed out') ? 'timed out' : 'error occurred'}`);
            }
            
            // Small delay between API calls
            if (i < uploadedFiles.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          if (bureauResults.length === 0) {
            console.error('All analyses failed');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to analyze credit reports. Please try again.' })}\n\n`));
            controller.close();
            return;
          }

          sendProgress(85, 'Merging results from all bureaus...');

          // Merge all bureau results
          const analysisResult = mergeAnalysisResults(bureauResults);
          
          // Transform the result to match expected frontend schema
          const finalResult = {
            ...analysisResult,
            accounts: (analysisResult.finalReport as Record<string, unknown>)?.accounts ?? [],
            masterTradelineTable: analysisResult.masterTradelineTable ?? [],
            fcraViolations: (analysisResult.finalReport as Record<string, unknown>)?.fcraViolations ?? [],
            disputeLetters: (analysisResult.finalReport as Record<string, unknown>)?.disputeLetters ?? []
          };

          console.log('Analysis completed successfully with Gemini');
          sendProgress(98, 'Report ready!');
          
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
