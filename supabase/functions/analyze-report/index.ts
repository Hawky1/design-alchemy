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

RETURN EXACTLY THIS JSON STRUCTURE (keys must exist even if null)

{
  "reportSummary": {...},
  "personalInfoMismatches": [...],
  "inquiries": [...],
  "publicRecords": [...],
  "masterTradelineTable": [...],
  "creditMetrics": {
    "creditUtilization": {...},
    "ageOfCredit": {...},
    "creditMix": {...},
    "creditHealthDiagnosis": {...}
  },
  "consumerLawReview": {
    "potentialIssues": [...],
    "categoriesSummary": {...},
    "actionPlan": [...]
  },
  "finalReport": {
    "accounts": [...],
    "fcraViolations": [...],
    "disputeLetters": [...]
  }
}

DETAILED FIELD SCHEMAS

reportSummary:
{
  "bureau": string|null,
  "reportDate": string|null,
  "score": number|null,
  "scoreModel": string|null,
  "derogatoryAccountsCount": number|null,
  "totalAccountsCount": number|null
}

personalInfoMismatches: array of
{
  "field": string,
  "valuesFound": [string],
  "note": string
}

inquiries: array (max 10) of
{
  "date": string|null,
  "creditor": string|null,
  "type": "hard"|"soft"|null
}

publicRecords: array of
{
  "type": string|null,
  "dateFiled": string|null,
  "status": string|null,
  "amount": number|null,
  "court": string|null
}

masterTradelineTable: array (max 15) of
{
  "accountId": string, 
  "creditorName": string|null,
  "accountType": string|null,
  "accountNumberLast4": string|null,
  "bureau": string|null,
  "openDate": string|null,
  "status": string|null,
  "statusLineRaw": string|null,
  "currentBalance": number|null,
  "creditLimit": number|null,
  "highCredit": number|null,
  "pastDue": number|null,
  "paymentStatus": string|null,
  "remarks": string|null,
  "isDerogatory": boolean|null
}

creditMetrics.creditUtilization:
{
  "totalRevolvingBalance": number|null,
  "totalRevolvingLimit": number|null,
  "utilizationPct": number|null,
  "utilizationCalc": string|null,
  "notes": string|null
}

creditMetrics.ageOfCredit:
{
  "oldestAccountDate": string|null,
  "newestAccountDate": string|null,
  "averageAgeMonths": number|null,
  "ageCalc": string|null,
  "notes": string|null
}

creditMetrics.creditMix:
{
  "revolvingCount": number|null,
  "installmentCount": number|null,
  "mortgageCount": number|null,
  "studentLoanCount": number|null,
  "otherCount": number|null,
  "notes": string|null
}

creditMetrics.creditHealthDiagnosis:
{
  "summary": string|null,
  "topRiskFactors": [string],
  "quickWins": [string]
}

consumerLawReview.potentialIssues: array (max 10) of
{
  "issueId": string,
  "category": "Duplicate Reporting"|"Identity Theft"|"Wrong Balance/Status"|"Post-Bankruptcy"|"Debt Collection Red Flags"|"Legal Date/Obsolescence"| "Other",
  "severity": "low"|"medium"|"high",
  "accountId": string|null,
  "whatWeSee": string,
  "whyItMayBeAProblem": string,
  "evidenceFromReport": [string],
  "evidenceNeeded": [string],
  "recommendedDisputePoints": [string],
  "recommendedNextSteps": [string]
}

consumerLawReview.categoriesSummary:
{
  "Duplicate Reporting": number,
  "Identity Theft": number,
  "Wrong Balance/Status": number,
  "Post-Bankruptcy": number,
  "Debt Collection Red Flags": number,
  "Legal Date/Obsolescence": number,
  "Other": number
}

consumerLawReview.actionPlan: array of
{
  "step": number,
  "action": string,
  "why": string,
  "inputsNeeded": [string]
}

finalReport.accounts: array (max 10) of
{
  "accountId": string,
  "name": string|null,
  "type": string|null,
  "balance": number|null,
  "status": string|null,
  "accountNumberLast4": string|null,
  "potentialViolation": string|null,
  "writeOffCheck": {
    "writeOffAmountFound": number|null,
    "writeOffEvidenceText": string|null,
    "balanceVsWriteOffFinding": string|null
  },
  "balanceHistoryCheck": {
    "history": [{"month": string, "balance": number|null}],
    "finding": string|null,
    "calc": string|null
  }
}

finalReport.fcraViolations: array (max 10) of
{
  "issueId": string,
  "accountId": string|null,
  "category": string,
  "summary": string,
  "evidenceNeeded": [string]
}

finalReport.disputeLetters: array of
{
  "accountId": string,
  "creditorOrCollector": string|null,
  "accountNumberLast4": string|null,
  "letterType": "CRA"|"Furnisher/Collector",
  "subject": string,
  "body": string
}

NOW ANALYZE THE PROVIDED CREDIT REPORT CONTENT AND RETURN ONLY THE JSON.`;

// Helper function to upload PDF to OpenAI Files API
async function uploadPdfToOpenAI(
  apiKey: string,
  file: File,
  bureauName: string
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    console.log(`Uploading ${bureauName} PDF to OpenAI Files API...`);
    
    const formData = new FormData();
    formData.append('purpose', 'user_data');
    formData.append('file', file, file.name);
    
    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to upload ${bureauName} PDF:`, response.status, errorText);
      return { success: false, error: `Upload failed: ${response.status} - ${errorText}` };
    }
    
    const data = await response.json();
    console.log(`${bureauName} PDF uploaded successfully, file_id: ${data.id}`);
    return { success: true, fileId: data.id };
  } catch (error) {
    console.error(`Error uploading ${bureauName} PDF:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to delete file from OpenAI
async function deleteOpenAIFile(apiKey: string, fileId: string): Promise<void> {
  try {
    await fetch(`https://api.openai.com/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log(`Deleted OpenAI file: ${fileId}`);
  } catch (error) {
    console.error(`Failed to delete file ${fileId}:`, error);
  }
}

// Helper function to call OpenAI Responses API with a single PDF file (with timeout)
async function callOpenAIWithSinglePdf(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  fileId: string,
  bureauName: string
): Promise<{ success: boolean; data?: unknown; error?: string; rawResponse?: string }> {
  try {
    const content = [
      {
        type: 'input_file',
        file_id: fileId
      },
      {
        type: 'input_text',
        text: `${systemPrompt}\n\n${userPrompt}`
      }
    ];
    
    console.log(`Calling OpenAI Responses API for ${bureauName}...`);
    
    // Create abort controller with 90 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error(`OpenAI API call timed out for ${bureauName} after 90 seconds`);
      controller.abort();
    }, 90000);
    
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          input: [
            {
              role: 'user',
              content: content
            }
          ],
          text: {
            format: {
              type: 'json_object'
            }
          }
        }),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return { success: false, error: `Request timed out after 90 seconds for ${bureauName}` };
      }
      throw fetchError;
    }
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI Responses API error for ${bureauName}:`, response.status, errorText);
      return { success: false, error: `API error: ${response.status} - ${errorText}` };
    }
    
    const data = await response.json();
    console.log(`OpenAI Responses API response received for ${bureauName}`);
    
    // Extract text content from response
    const outputText = data.output?.find((o: { type: string }) => o.type === 'message')?.content?.find((c: { type: string }) => c.type === 'output_text')?.text;
    
    if (!outputText) {
      console.error(`No text output in response for ${bureauName}:`, JSON.stringify(data).substring(0, 500));
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
    console.error(`OpenAI Responses API call error for ${bureauName}:`, error);
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
    console.log('Analyze report function called - Single-pass comprehensive analysis with OpenAI');
    
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
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
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

    // Upload PDFs to OpenAI Files API
    const uploadedFiles: { bureau: string; fileId: string }[] = [];
    const bureauNames: string[] = [];
    
    if (experianFile) {
      const result = await uploadPdfToOpenAI(OPENAI_API_KEY, experianFile, 'Experian');
      if (result.success && result.fileId) {
        uploadedFiles.push({ bureau: 'Experian', fileId: result.fileId });
        bureauNames.push('Experian');
      } else {
        console.error('Failed to upload Experian file:', result.error);
      }
    }
    
    if (equifaxFile) {
      const result = await uploadPdfToOpenAI(OPENAI_API_KEY, equifaxFile, 'Equifax');
      if (result.success && result.fileId) {
        uploadedFiles.push({ bureau: 'Equifax', fileId: result.fileId });
        bureauNames.push('Equifax');
      } else {
        console.error('Failed to upload Equifax file:', result.error);
      }
    }
    
    if (transunionFile) {
      const result = await uploadPdfToOpenAI(OPENAI_API_KEY, transunionFile, 'TransUnion');
      if (result.success && result.fileId) {
        uploadedFiles.push({ bureau: 'TransUnion', fileId: result.fileId });
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

    console.log('Starting single-pass comprehensive analysis with OpenAI,', bureauNames.length, 'PDF files uploaded');
    
    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Progress updates
          const sendProgress = (progress: number, message: string) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress, message })}\n\n`));
          };

          sendProgress(10, 'PDF files uploaded to OpenAI...');
          sendProgress(20, `Analyzing ${bureauNames.join(', ')} credit reports...`);

          // ========== SEQUENTIAL ANALYSIS OF EACH PDF ==========
          const bureauResults: { bureau: string; data: Record<string, unknown> }[] = [];
          const totalFiles = uploadedFiles.length;
          
          for (let i = 0; i < uploadedFiles.length; i++) {
            const { bureau, fileId } = uploadedFiles[i];
            const progressBase = 20 + (i * 50 / totalFiles);
            
            sendProgress(progressBase, `Analyzing ${bureau} credit report (${i + 1}/${totalFiles})...`);
            
            const userPrompt = `Analyze this ${bureau} credit report. Extract all data, compute metrics, flag issues, check write-offs and balance history, and draft dispute letters as specified.`;
            
            const result = await callOpenAIWithSinglePdf(
              OPENAI_API_KEY,
              ANALYSIS_PROMPT,
              userPrompt,
              fileId,
              bureau
            );
            
            // Delete the file after processing
            await deleteOpenAIFile(OPENAI_API_KEY, fileId);
            
            if (result.success && result.data) {
              bureauResults.push({ bureau, data: result.data as Record<string, unknown> });
              console.log(`Successfully analyzed ${bureau}`);
            } else {
              console.error(`Failed to analyze ${bureau}:`, result.error);
              // Send error progress but continue with other bureaus
              sendProgress(progressBase + 10, `Warning: ${bureau} analysis failed - ${result.error?.includes('timed out') ? 'timed out' : 'error occurred'}`);
            }
            
            // Small delay between API calls to avoid rate limits
            if (i < uploadedFiles.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (bureauResults.length === 0) {
            console.error('All analyses failed');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Failed to analyze credit reports. The analysis timed out or encountered an error. Please try again with smaller files or fewer reports.' })}\n\n`));
            controller.close();
            return;
          }

          sendProgress(85, 'Merging results from all bureaus...');

          // Merge all bureau results
          const analysisResult = mergeAnalysisResults(bureauResults);
          
          // Transform the result to match expected frontend schema
          // The new schema has accounts under finalReport.accounts
          const finalResult = {
            ...analysisResult,
            // Ensure accounts array is accessible at top level for frontend compatibility
            accounts: (analysisResult.finalReport as Record<string, unknown>)?.accounts ?? [],
            masterTradelineTable: analysisResult.masterTradelineTable ?? [],
            fcraViolations: (analysisResult.finalReport as Record<string, unknown>)?.fcraViolations ?? [],
            disputeLetters: (analysisResult.finalReport as Record<string, unknown>)?.disputeLetters ?? []
          };

          console.log('Comprehensive analysis completed successfully');
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
