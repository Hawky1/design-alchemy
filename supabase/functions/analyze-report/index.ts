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

    console.log('Files received:', {
      experian: experianFile?.name,
      equifax: equifaxFile?.name,
      transunion: transunionFile?.name
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

    const systemPrompt = `You are an expert credit report analyst specializing in FCRA (Fair Credit Reporting Act) violations and consumer credit rights. Analyze the provided credit report PDF(s) and identify:

1. Credit Score information
2. Payment history analysis
3. Credit utilization
4. Account details with potential issues
5. FCRA violations (inaccurate info, outdated items, duplicate entries, missing disclosures, etc.)
6. Cross-bureau discrepancies if multiple reports provided
7. Legal case summary with compensation potential
8. Actionable recommendations

Be thorough and identify ALL potential violations. For each violation, explain the legal basis and potential remedies.

IMPORTANT: Return your analysis as a JSON object with this exact structure:
{
  "creditScore": {
    "current": number or null,
    "range": "string",
    "factors": ["string"]
  },
  "paymentHistory": {
    "onTimePayments": number,
    "latePayments": number,
    "missedPayments": number,
    "totalAccounts": number,
    "percentageOnTime": number
  },
  "creditUtilization": {
    "totalCredit": number,
    "usedCredit": number,
    "utilizationPercentage": number,
    "recommendation": "string"
  },
  "accounts": [{
    "name": "string",
    "type": "string",
    "balance": number,
    "creditLimit": number,
    "status": "string",
    "paymentStatus": "string",
    "remarks": "string",
    "potentialViolation": "string or null",
    "bureaus": ["string"],
    "crossBureauDiscrepancy": "string or null"
  }],
  "fcraViolations": [{
    "violationType": "string",
    "severity": "High/Medium/Low",
    "accountName": "string",
    "issue": "string",
    "legalBasis": "string",
    "bureausAffected": ["string"],
    "crossBureauDetails": "string or null",
    "description": "string",
    "actionableSteps": "string",
    "legalCompensationPotential": "string"
  }],
  "recommendations": [{
    "priority": "High/Medium/Low",
    "title": "string",
    "description": "string",
    "potentialImpact": "string"
  }],
  "legalCaseSummary": {
    "totalViolationsFound": number,
    "highPriorityViolations": number,
    "estimatedCompensationPotential": "string",
    "attorneyReferralRecommended": boolean,
    "nextSteps": "string"
  },
  "summary": "string"
}`;

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
            { text: `Please analyze the following ${bureauNames.length} credit report(s) from: ${bureauNames.join(', ')}.` },
            ...fileParts
          ];

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 30, message: 'Analyzing credit reports with AI...' })}\n\n`));

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
                maxOutputTokens: 8192
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

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 80, message: 'Parsing analysis results...' })}\n\n`));

          // Parse the JSON response
          let analysisResult;
          try {
            analysisResult = JSON.parse(content);
          } catch (parseError) {
            console.error('Failed to parse Gemini response as JSON:', parseError);
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              analysisResult = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('Could not parse AI analysis results');
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 95, message: 'Finalizing report...' })}\n\n`));
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
