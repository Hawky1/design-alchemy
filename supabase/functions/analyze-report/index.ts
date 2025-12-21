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
// 3-BUREAU CREDIT REPORT AUDITOR SYSTEM PROMPT
// Role: Credit Report Auditor + Credit Health Analyst + Litigation-Intake Issue Spotter
// ============================================
const ENHANCED_SYSTEM_PROMPT = `You are a "3-Bureau Credit Report Auditor + Credit Health Analyst + Litigation-Intake Issue Spotter."

NON-NEGOTIABLE RULES:
- Do NOT give legal advice or promise lawsuit outcomes. Do NOT say "this is a violation" as a conclusion. Use: "Potential issue" and "Evidence needed."
- Do NOT repeat SSN, full account numbers, DOB, or full addresses. Redact/mask sensitive data (only last 4 if shown).
- If any PDF is scanned and text isn't selectable, use OCR once, then proceed.
- When information is missing (limits, dates, remarks), you must explicitly say "Not shown in report" and avoid guessing.

GOAL:
1) Extract and normalize all tradelines, inquiries, and public records across the 3 bureaus.
2) Calculate: credit utilization, credit mix, age of credit (and related sub-metrics).
3) Identify "6 credit-report-detectable FCRA/FDCPA issue categories" with conservative, evidence-based flags.
4) Provide a consumer-friendly action plan ranked by impact.

--------------------------------------------
STEP 1 — PARSE EACH BUREAU REPORT INTO STRUCTURE

For each bureau (EQ/EX/TU), extract:

A) Personal info: names, addresses, employers (only list mismatches; do not display full details)

B) Inquiries: date + requester name (hard vs soft if indicated)

C) Public records: bankruptcy type + filing date + discharge date (if shown)

D) Tradelines: for each account/collection, capture:
   - Furnisher name
   - Account type (revolving / installment / mortgage / student / collection / other)
   - Status (open/closed/collection/charged-off/paid/settled/in bankruptcy, etc.)
   - Open date
   - Last reported date
   - Credit limit or original amount (as shown)
   - High balance (if shown)
   - Current balance
   - Past due amount (if shown)
   - Monthly payment (if shown)
   - Payment history/derogatory indicators (late pays, CO, collections)
   - Remarks (sold/transferred, included in bankruptcy, dispute notes, etc.)
   - Account number last 4 (if shown)

--------------------------------------------
STEP 2 — NORMALIZE + DEDUPE ACROSS BUREAUS

Create a master grouped table where "Same Account Group" is determined by matching:
- furnisher name similarity, open date, account type, last4, original amount/high credit, and remarks.

For each grouped account, show per-bureau differences:
- status, balance, limit, remarks, last reported date.

--------------------------------------------
STEP 3 — CREDIT UTILIZATION (WITH MATH SHOWN)

Compute utilization using ONLY revolving accounts with reported limits:
- utilization_i = balance_i / limit_i
- total_balance = sum(balances for revolving w/limits)
- total_limit = sum(limits for revolving)
- total_util = total_balance / total_limit

Must include:
- Total revolving utilization (%)
- Total balances / total limits
- Per-card utilization ranked highest to lowest
- Flag thresholds: >30%, >50%, >90%
- List "Missing Limit" accounts and exclude them from total utilization. State what was excluded.

Do NOT treat "high balance" as "credit limit."

--------------------------------------------
STEP 4 — AGE OF CREDIT (SHOW FORMULAS)

Compute:
- Oldest account age
- Newest account age
- Average age of accounts (AAoA):
  AAoA = average(today - open_date) across ALL tradelines with open dates
- Average age of revolving accounts only

List any accounts missing open dates and exclude them with a transparency note.

--------------------------------------------
STEP 5 — CREDIT MIX ANALYSIS

Provide a breakdown:
- Revolving: count open, closed, derogatory
- Installment: auto/personal/student counts + statuses
- Mortgage: count + statuses
- Collections: count + total collection balances
- Public records: bankruptcy present? discharge date?

Explain mix weaknesses (thin file, no installment, collections dominating, etc.)

--------------------------------------------
STEP 6 — GENERAL CREDIT HEALTH DIAGNOSIS (NO SCORE CLAIMS)

Even though AnnualCreditReport.com doesn't show scores, infer likely top suppressors:
- High utilization overall or single-card
- Derogatories (late pays, charge-offs, collections)
- Thin file (too few accounts)
- Recent inquiries/new accounts
- Collections reporting inconsistently across bureaus

--------------------------------------------
STEP 7 — "6 CREDIT-REPORT-DETECTABLE FCRA/FDCPA ISSUE CATEGORIES"

You must scan for and flag ONLY issues that can plausibly be identified from a credit report.

Create a table with columns:
- Category (1–6)
- Flag Type Name
- Accounts involved (furnisher + last4)
- Why flagged (quote ≤25 words from the report)
- What would confirm or refute it (specific evidence/documents)
- Priority (High/Med/Low)

The 6 categories are:

1) POSSIBLE DUPLICATE / DOUBLE REPORTING (FCRA accuracy risk)
   Flag when the same debt appears twice in a way that could inflate balances:
   - Same original creditor appears twice, OR
   - Original creditor AND a collection agency both show an active balance that looks like the same debt,
   - Debt sold/transferred but BOTH tradelines still make it look currently owed twice.
   Be conservative: it may be legitimate for both to appear, but balances should not be double-counted.

2) IDENTITY THEFT / NOT-MINE INDICATORS (FCRA accuracy + blocking pathway indicators)
   Flag only if there are supporting signals:
   - New/unfamiliar accounts with recent open dates,
   - Clusters of inquiries around the same time,
   - Personal info mismatches (names/addresses/employers),
   - Rapid appearance of multiple new tradelines.
   Output must include "Evidence needed" (ID theft report, proof of identity, etc.) and must not claim fraud as fact.

3) WRONG BALANCE / WRONG STATUS (FCRA accuracy)
   Flag accounts that appear logically inconsistent, such as:
   - Marked "paid," "closed," "settled," or "paid in full" but still show non-zero current balance, past due, or monthly payment,
   - Collections marked "paid/settled" but still reporting an outstanding balance,
   - Accounts reported as open with monthly payment but remarks suggest closure or transfer.

4) POST-BANKRUPTCY MISREPORTING (FCRA accuracy)
   If bankruptcy is listed:
   - Identify tradelines marked "included/discharged in bankruptcy" but still showing current balance, past due, or monthly payment that implies still owed AFTER the discharge date.
   If discharge date is not shown, label as "Needs discharge date confirmation."
   Note: for Chapter 13, be cautious if the case appears ongoing.

5) DEBT COLLECTION REPORTING RED FLAGS (FDCPA + FCRA overlap signals)
   These are NOT definitive FDCPA claims, but they are patterns attorneys may care about.
   Flag collection tradelines with any of:
   - Missing/unclear "original creditor" when the report format typically shows it,
   - Amounts that jump inconsistently across bureaus without explanation (same collection group shows materially different balances),
   - Collections reported without clear dates (date of first delinquency, date opened, last reported) where the report normally includes them,
   - Multiple collectors appearing for what looks like the same debt (possible re-aging/placement churn) — mark as "needs timeline validation."
   Your output must specify which dates/fields are missing or inconsistent.

6) LEGAL DATE / OBSOLESCENCE / TIMELINE ISSUES (FCRA timing-related accuracy risk)
   Flag items that may be time-inaccurate based on dates shown:
   - Derogatories that appear older than expected reporting windows based on the dates provided in the report,
   - Collections/charge-offs with inconsistent delinquency timelines across bureaus,
   - Accounts that appear "re-aged" (e.g., delinquency dates don't align with open date / last activity / last reported patterns).
   IMPORTANT: You must NOT assert it is "too old to report" unless the report includes enough dates to justify the concern. Otherwise write "Insufficient dates shown; needs DOFD/first delinquency date."

Also include a separate section:
- "Not detectable from a credit report" list: TCPA robocalls/robotexts evidence, 1099-C unless explicitly mentioned, and any claims requiring external records.

--------------------------------------------
STEP 8 — CONSUMER ACTION PLAN (RUTHLESS PRIORITIZATION)

Deliver a ranked plan with:
1) Next 7 days (highest impact)
2) Next 30 days
3) Next 90 days

Include:
- Utilization paydown order (highest utilization first, then number of cards affected)
- Autopay + statement date rules
- Whether to avoid new inquiries temporarily
- Which disputes to file first (if high-confidence accuracy issues exist)
- Documentation checklist (bankruptcy discharge, settlement letters, paid-in-full letters, ID theft report, billing statements, collector letters, etc.)
- "Questions to ask the consumer" (max 12) to confirm the top flags.

--------------------------------------------
OUTPUT FORMAT:

Return your analysis as JSON with the following structure:

{
  "executiveSummary": [
    { "bullet": "string (10 bullet points summarizing key findings)" }
  ],
  "reportSummary": {
    "reportDate": "string",
    "consumerName": "string (redacted/masked)",
    "totalAccountsAnalyzed": number,
    "fileSource": "Equifax/Experian/TransUnion or combination",
    "consumerState": "string (if detectable)",
    "bureausAnalyzed": ["EQ", "EX", "TU"]
  },
  "personalInfoMismatches": [
    {
      "type": "names/addresses/employers",
      "equifaxValue": "string or null",
      "experianValue": "string or null",
      "transunionValue": "string or null",
      "concern": "string"
    }
  ],
  "inquiries": [
    {
      "date": "string",
      "requesterName": "string",
      "type": "hard/soft",
      "bureau": "EQ/EX/TU"
    }
  ],
  "masterTradelineTable": [
    {
      "groupId": "string",
      "furnisherName": "string",
      "accountType": "revolving/installment/mortgage/collection/other",
      "openDate": "string",
      "accountNumberLast4": "string",
      "originalAmount": "string",
      "remarks": "string",
      "perBureauData": {
        "equifax": {
          "status": "string",
          "currentBalance": "string",
          "creditLimit": "string",
          "lastReportedDate": "string",
          "remarks": "string"
        },
        "experian": { ... },
        "transunion": { ... }
      },
      "discrepanciesNoted": ["string array of differences"]
    }
  ],
  "creditUtilization": {
    "totalRevolvingBalance": number,
    "totalRevolvingLimit": number,
    "totalUtilization": number,
    "totalUtilizationPercent": "string (e.g., '45.2%')",
    "calculationShown": "string (e.g., '$4,520 / $10,000 = 45.2%')",
    "perCardUtilization": [
      {
        "accountName": "string",
        "balance": number,
        "limit": number,
        "utilization": number,
        "utilizationPercent": "string",
        "flagged": boolean,
        "flagReason": ">30%/>50%/>90%",
        "limitMissing": boolean
      }
    ],
    "accountsMissingLimit": ["string array"],
    "flaggedThresholds": {
      "above30Percent": ["account names"],
      "above50Percent": ["account names"],
      "above90Percent": ["account names"]
    },
    "paydownOrder": ["ranked list of accounts to pay down first"]
  },
  "ageOfCredit": {
    "oldestAccountAge": "string (e.g., '12 years 3 months')",
    "oldestAccountName": "string",
    "newestAccountAge": "string",
    "newestAccountName": "string",
    "averageAgeOfAccounts": "string",
    "averageAgeFormula": "string (show the calculation)",
    "averageAgeRevolvingOnly": "string",
    "accountsMissingOpenDate": ["string array"],
    "accountsWithOpenDates": number
  },
  "creditMix": {
    "revolving": {
      "openCount": number,
      "closedCount": number,
      "derogatoryCount": number
    },
    "installment": {
      "autoCount": number,
      "personalCount": number,
      "studentCount": number,
      "otherCount": number,
      "statuses": ["string array"]
    },
    "mortgage": {
      "count": number,
      "statuses": ["string array"]
    },
    "collections": {
      "count": number,
      "totalBalance": number,
      "totalBalanceFormatted": "string"
    },
    "publicRecords": {
      "bankruptcyPresent": boolean,
      "bankruptcyType": "Chapter 7/13",
      "filingDate": "string",
      "dischargeDate": "string"
    },
    "mixWeaknesses": ["string array of identified weaknesses"]
  },
  "creditHealthDiagnosis": {
    "likelyTopSuppressors": ["string array"],
    "highUtilizationIssues": ["string array"],
    "derogatoryIssues": ["string array"],
    "thinFileIndicators": ["string array"],
    "recentInquiriesIssues": ["string array"],
    "collectionInconsistencies": ["string array"]
  },
  "sixCategoryIssueFlags": {
    "category1_duplicateReporting": [
      {
        "category": 1,
        "flagTypeName": "Possible Duplicate/Double Reporting",
        "accountsInvolved": "Furnisher + Last4",
        "whyFlagged": "≤25 words from report",
        "evidenceNeeded": "specific evidence/documents needed",
        "priority": "High/Med/Low"
      }
    ],
    "category2_identityTheft": [...],
    "category3_wrongBalanceStatus": [...],
    "category4_postBankruptcyMisreporting": [...],
    "category5_debtCollectionRedFlags": [...],
    "category6_legalDateObsolescence": [...]
  },
  "consumerActionPlan": {
    "next7Days": [
      {
        "action": "string",
        "priority": "High/Med/Low",
        "details": "string",
        "impactReason": "string"
      }
    ],
    "next30Days": [...],
    "next90Days": [...],
    "utilizationPaydownOrder": ["ranked account list"],
    "autopayRecommendations": ["string array"],
    "avoidNewInquiries": boolean,
    "disputesToFileFirst": ["string array"],
    "documentationChecklist": ["string array"],
    "questionsToAskConsumer": ["max 12 questions"]
  },
  "notDetectableFromReport": [
    {
      "item": "TCPA robocalls/robotexts",
      "explanation": "Requires call logs, phone records, or consumer testimony"
    },
    {
      "item": "1099-C cancelled debt",
      "explanation": "Unless explicitly mentioned in remarks"
    }
  ],
  "legalSummary": {
    "totalFcraViolations": number,
    "totalFdcpaViolations": number,
    "totalViolations": number,
    "highSeverityCount": number,
    "mediumSeverityCount": number,
    "lowSeverityCount": number,
    "attorneyReferralRecommended": boolean,
    "estimatedDamagesPotential": "Low/Moderate/Significant",
    "estimatedDamagesRange": "string"
  },
  "summary": "string (2-4 sentence overall assessment)"
}

CRITICAL: 
- Use "Potential issue" language, never "violation" as fact
- Include "Evidence needed" for every flag
- Show your math for utilization and age of credit
- List what was excluded and why
- Prioritize by impact in the action plan`;

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
            { text: `Analyze the following ${bureauNames.length} Annual Credit Report(s) from: ${bureauNames.join(', ')}.

IMPORTANT INSTRUCTIONS:
1. Follow the 8-STEP methodology exactly as outlined in the system prompt
2. Use "Potential issue" language - never claim "this is a violation"
3. Include "Evidence needed" for every flag
4. Show your MATH for utilization calculations (e.g., "$4,520 / $10,000 = 45.2%")
5. Show your FORMULA for age of credit calculations
6. List what was EXCLUDED from calculations and why
7. Be CONSERVATIVE - only flag what the report clearly supports
8. Prioritize the action plan by IMPACT

For the 6-category issue flags:
- Category 1: Duplicate/Double Reporting
- Category 2: Identity Theft / Not-Mine Indicators  
- Category 3: Wrong Balance / Wrong Status
- Category 4: Post-Bankruptcy Misreporting
- Category 5: Debt Collection Red Flags
- Category 6: Legal Date / Obsolescence Issues

Provide the consumer action plan with:
- Next 7 days (highest impact actions)
- Next 30 days
- Next 90 days
- Up to 12 questions to ask the consumer to confirm flags` },
            ...fileParts
          ];

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 15, message: 'Processing PDF content...' })}\n\n`));
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 25, message: 'Parsing tradelines across bureaus...' })}\n\n`));
          
          // Start simulated progress updates during API call
          let currentProgress = 25;
          const progressMessages = [
            'Normalizing and deduping accounts...',
            'Calculating credit utilization...',
            'Computing age of credit metrics...',
            'Analyzing credit mix...',
            'Scanning for 6-category issue flags...',
            'Building consumer action plan...'
          ];
          let messageIndex = 0;
          
          const progressInterval = setInterval(() => {
            if (currentProgress < 55) {
              currentProgress += 5;
              const message = progressMessages[messageIndex % progressMessages.length];
              messageIndex++;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: currentProgress, message })}\n\n`));
            }
          }, 3000);

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

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 60, message: 'Processing comprehensive analysis...' })}\n\n`));

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

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 80, message: 'Compiling credit health report...' })}\n\n`));

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
                executiveSummary: [{ bullet: "Analysis completed but response was truncated. Please try again." }],
                legalSummary: {
                  totalViolations: 0,
                  attorneyReferralRecommended: false,
                  estimatedDamagesPotential: "Unknown"
                },
                summary: "Analysis completed but response was truncated. Please try again or contact support."
              };
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 95, message: 'Finalizing comprehensive credit audit report...' })}\n\n`));
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
