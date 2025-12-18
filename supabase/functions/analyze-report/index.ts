import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
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

    // Read file contents (as text for now - PDF parsing would need additional processing)
    const fileContents: string[] = [];
    const bureauNames: string[] = [];
    
    if (experianFile) {
      const text = await experianFile.text();
      fileContents.push(`EXPERIAN REPORT:\n${text.substring(0, 50000)}`);
      bureauNames.push('Experian');
    }
    if (equifaxFile) {
      const text = await equifaxFile.text();
      fileContents.push(`EQUIFAX REPORT:\n${text.substring(0, 50000)}`);
      bureauNames.push('Equifax');
    }
    if (transunionFile) {
      const text = await transunionFile.text();
      fileContents.push(`TRANSUNION REPORT:\n${text.substring(0, 50000)}`);
      bureauNames.push('TransUnion');
    }

    if (fileContents.length === 0) {
      throw new Error('No credit report files provided');
    }

    const combinedContent = fileContents.join('\n\n---\n\n');
    
    const systemPrompt = `You are an expert credit report analyst specializing in FCRA (Fair Credit Reporting Act) violations and consumer credit rights. Analyze the provided credit report(s) and identify:

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

    console.log('Sending request to Lovable AI Gateway...');
    
    // Send streaming updates to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial progress
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 10, message: 'Analyzing credit reports...' })}\n\n`));

          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Please analyze the following credit report(s) from ${bureauNames.join(', ')}:\n\n${combinedContent}` }
              ],
              response_format: { type: 'json_object' }
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('AI Gateway error:', response.status, errorText);
            
            if (response.status === 429) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'Rate limit exceeded. Please try again later.' })}\n\n`));
            } else if (response.status === 402) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'AI credits exhausted. Please add credits to continue.' })}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'AI analysis failed. Please try again.' })}\n\n`));
            }
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 50, message: 'Processing AI response...' })}\n\n`));

          const data = await response.json();
          console.log('AI response received');

          const content = data.choices?.[0]?.message?.content;
          if (!content) {
            throw new Error('No content in AI response');
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', progress: 80, message: 'Parsing results...' })}\n\n`));

          // Parse the JSON response
          let analysisResult;
          try {
            analysisResult = JSON.parse(content);
          } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              analysisResult = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('Could not parse AI analysis results');
            }
          }

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
