import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze report function called');
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      throw new Error('Gemini API key not configured');
    }

    // Parse the form data to get uploaded files
    const formData = await req.formData();
    const experianFile = formData.get('experian') as File | null;
    const equifaxFile = formData.get('equifax') as File | null;
    const transunionFile = formData.get('transunion') as File | null;
    
    // Get lead data
    const leadName = formData.get('leadName') as string | null;
    const leadEmail = formData.get('leadEmail') as string | null;

    console.log('Files received:', {
      experian: experianFile?.name,
      equifax: equifaxFile?.name,
      transunion: transunionFile?.name
    });
    
    console.log('Lead data received:', {
      name: leadName,
      email: leadEmail
    });

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
      console.log(`Experian file converted to base64, size: ${base64Data.length} chars`);
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
      console.log(`Equifax file converted to base64, size: ${base64Data.length} chars`);
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
      console.log(`TransUnion file converted to base64, size: ${base64Data.length} chars`);
    }

    if (fileParts.length === 0) {
      throw new Error('No credit report files provided');
    }

    const systemPrompt = `You are an expert FCRA (Fair Credit Reporting Act) and FDCPA (Fair Debt Collection Practices Act) violation analyst. 

Your task is to analyze the provided Annual Credit Report PDF(s) and identify ALL potential FCRA violations and account errors.

CRITICAL INSTRUCTIONS:
1. These are Annual Credit Reports from AnnualCreditReport.com - they do NOT contain credit scores or income information. Do not try to calculate or estimate these.
2. Focus ENTIRELY on identifying FCRA violations, reporting errors, and account discrepancies.
3. For EVERY violation found, provide a SPECIFIC, ACTIONABLE suggested action (e.g., "Send a certified dispute letter to [Bureau] citing 15 U.S.C. § 1681i demanding removal/correction of [specific item]").
4. Be thorough - look for duplicate accounts, incorrect balances, outdated information, accounts that should have fallen off, identity errors, etc.

Return a JSON object with EXACTLY this structure:
{
  "reportSummary": {
    "reportDate": "string (date found in report or 'Not specified')",
    "consumerName": "string (name from report)",
    "totalAccountsAnalyzed": number,
    "fileSource": "TransUnion/Equifax/Experian or combination"
  },
  "accountAnalysis": [
    {
      "accountName": "string (creditor name)",
      "accountNumber": "string (last 4 digits only, e.g., '****1234')",
      "status": "string (Open/Closed/Derogatory/Collection/etc.)",
      "balance": "string (reported balance or 'Not reported')",
      "comments": "string (any issues or notes about this account)"
    }
  ],
  "fcraViolations": [
    {
      "violationTitle": "string (e.g., 'Double Jeopardy Reporting', 'Outdated Negative Information', 'Inaccurate Balance Reporting')",
      "severity": "High/Medium/Low",
      "accountsInvolved": ["array of account names involved"],
      "legalBasis": "string (specific statute, e.g., '15 U.S.C. § 1681s-2(a)(1)(A) - Duty to provide accurate information')",
      "explanation": "string (Clear, detailed explanation of why this is a violation and how it harms the consumer)",
      "suggestedAction": "string (Step-by-step instruction, e.g., 'Step 1: Draft a certified dispute letter. Step 2: Send to [Bureau] at [address]. Step 3: Include copies of supporting documents. Step 4: Request deletion under 15 U.S.C. § 1681i.')"
    }
  ],
  "legalSummary": {
    "totalViolations": number,
    "attorneyReferralRecommended": boolean,
    "estimatedDamagesPotential": "Low/Moderate/Significant"
  },
  "summary": "string (2-3 sentence overall assessment focusing on violations found and recommended actions)"
}

Common FCRA violations to look for:
- Duplicate/double jeopardy reporting (same debt reported multiple times)
- Outdated negative information (derogatory items older than 7 years, bankruptcies older than 10 years)
- Inaccurate account information (wrong balances, payment history, dates)
- Accounts not belonging to the consumer (identity mix-up)
- Incorrect personal information (name, address, SSN variations)
- Re-aging of accounts (resetting the 7-year clock)
- Failure to report disputes
- Collection accounts with incomplete information
- Unauthorized hard inquiries`;

    console.log('Sending request to Google Gemini API with', bureauNames.length, 'PDF files...');
    
    // Send streaming updates to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial progress
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 10, message: 'Uploading and processing PDF files...' })}\n\n`));

          // Build the parts array: system prompt first, then PDF files with labels
          const parts = [
            { text: systemPrompt },
            { text: `Please analyze the following ${bureauNames.length} Annual Credit Report(s) from: ${bureauNames.join(', ')}. Focus on identifying FCRA violations and account errors.` },
            ...fileParts
          ];

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 30, message: 'Analyzing credit reports for FCRA violations...' })}\n\n`));

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

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            
            if (response.status === 429) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Rate limit exceeded. Please try again later.' })}\n\n`));
            } else if (response.status === 403) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Invalid API key or access denied.' })}\n\n`));
            } else if (response.status === 400) {
              console.error('Bad request - check PDF format or size');
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Error processing PDF files. Please ensure files are valid PDFs.' })}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: `Gemini API error: ${response.status}` })}\n\n`));
            }
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 60, message: 'Processing AI response...' })}\n\n`));

          const data = await response.json();
          console.log('Gemini response received successfully');

          // Extract content from Gemini response format
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!content) {
            console.error('Unexpected Gemini response structure:', JSON.stringify(data));
            throw new Error('No content in Gemini response');
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 80, message: 'Parsing violation analysis...' })}\n\n`));

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
                legalSummary: {
                  totalViolations: 0,
                  attorneyReferralRecommended: false,
                  estimatedDamagesPotential: "Unknown"
                },
                summary: "Analysis completed but response was truncated. Please try again or contact support."
              };
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 95, message: 'Finalizing violation report...' })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: analysisResult })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: error instanceof Error ? error.message : 'Analysis failed' })}\n\n`));
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
