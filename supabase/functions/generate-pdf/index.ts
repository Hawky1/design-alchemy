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
    const { results, leadName } = await req.json();
    console.log('Generating PDF for:', leadName || 'Unknown');

    if (!results) {
      throw new Error('No results provided');
    }

    // Generate PDF content as HTML that will be converted
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const violationsCount = results.violations?.length || 0;
    const damagesPotential = results.executive_summary?.estimated_damages || '$0';
    const bureaus = results.executive_summary?.bureaus_analyzed || [];
    const overallScore = results.executive_summary?.overall_score || 'N/A';

    // Build HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica', 'Arial', sans-serif; 
      color: #1a1a1a; 
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #dc2626; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .logo-text { 
      font-size: 24px; 
      font-weight: bold; 
      color: #1a1a1a; 
    }
    .logo-subtitle { 
      font-size: 12px; 
      color: #666; 
      margin-top: 5px; 
    }
    .report-title { 
      font-size: 28px; 
      font-weight: bold; 
      margin: 20px 0 10px; 
      color: #1a1a1a; 
    }
    .report-date { 
      color: #666; 
      font-size: 14px; 
    }
    .summary-box { 
      background: #f8f9fa; 
      border: 1px solid #e5e7eb; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 20px 0; 
    }
    .summary-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 15px; 
    }
    .stat-item { 
      padding: 15px; 
      background: white; 
      border-radius: 6px; 
      border: 1px solid #e5e7eb; 
    }
    .stat-label { 
      font-size: 12px; 
      color: #666; 
      text-transform: uppercase; 
      letter-spacing: 0.5px; 
    }
    .stat-value { 
      font-size: 24px; 
      font-weight: bold; 
      color: #dc2626; 
      margin-top: 5px; 
    }
    .section { 
      margin: 30px 0; 
      page-break-inside: avoid; 
    }
    .section-title { 
      font-size: 18px; 
      font-weight: bold; 
      color: #1a1a1a; 
      border-bottom: 2px solid #dc2626; 
      padding-bottom: 10px; 
      margin-bottom: 15px; 
    }
    .violation-item { 
      background: #fff5f5; 
      border: 1px solid #fecaca; 
      border-radius: 6px; 
      padding: 15px; 
      margin: 10px 0; 
    }
    .violation-title { 
      font-weight: bold; 
      color: #dc2626; 
    }
    .violation-detail { 
      font-size: 14px; 
      color: #666; 
      margin-top: 5px; 
    }
    .recommendation-item { 
      background: #f0fdf4; 
      border: 1px solid #bbf7d0; 
      border-radius: 6px; 
      padding: 15px; 
      margin: 10px 0; 
    }
    .recommendation-title { 
      font-weight: bold; 
      color: #166534; 
    }
    .footer { 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #e5e7eb; 
      text-align: center; 
      font-size: 12px; 
      color: #666; 
    }
    .priority-high { color: #dc2626; }
    .priority-medium { color: #d97706; }
    .priority-low { color: #16a34a; }
    ul { margin-left: 20px; margin-top: 10px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-text">Consumer Advocate Resolution Center</div>
    <div class="logo-subtitle">Credit Report Analysis</div>
    <div class="report-title">Credit Report Violation Analysis</div>
    <div class="report-date">Generated: ${date}</div>
  </div>

  <div class="summary-box">
    <div class="summary-grid">
      <div class="stat-item">
        <div class="stat-label">Violations Found</div>
        <div class="stat-value">${violationsCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Potential Damages</div>
        <div class="stat-value">${damagesPotential}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Bureaus Analyzed</div>
        <div class="stat-value">${bureaus.join(', ') || 'N/A'}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Overall Score</div>
        <div class="stat-value">${overallScore}</div>
      </div>
    </div>
  </div>

  ${results.executive_summary ? `
  <div class="section">
    <div class="section-title">Executive Summary</div>
    <p>${results.executive_summary.summary || 'No summary available.'}</p>
    ${results.executive_summary.key_findings ? `
    <h4 style="margin-top: 15px; margin-bottom: 10px;">Key Findings:</h4>
    <ul>
      ${results.executive_summary.key_findings.map((finding: string) => `<li>${finding}</li>`).join('')}
    </ul>
    ` : ''}
  </div>
  ` : ''}

  ${results.violations && results.violations.length > 0 ? `
  <div class="section">
    <div class="section-title">Violations Identified (${results.violations.length})</div>
    ${results.violations.slice(0, 10).map((violation: any) => `
    <div class="violation-item">
      <div class="violation-title">${violation.type || violation.title || 'Violation'}</div>
      <div class="violation-detail">
        <strong>Bureau:</strong> ${violation.bureau || 'N/A'} | 
        <strong>Priority:</strong> <span class="priority-${(violation.priority || '').toLowerCase()}">${violation.priority || 'N/A'}</span>
      </div>
      <div class="violation-detail">${violation.description || violation.details || ''}</div>
      ${violation.legal_basis ? `<div class="violation-detail"><strong>Legal Basis:</strong> ${violation.legal_basis}</div>` : ''}
    </div>
    `).join('')}
    ${results.violations.length > 10 ? `<p style="color: #666; font-style: italic;">... and ${results.violations.length - 10} more violations</p>` : ''}
  </div>
  ` : ''}

  ${results.recommendations && results.recommendations.length > 0 ? `
  <div class="section">
    <div class="section-title">Recommendations</div>
    ${results.recommendations.slice(0, 5).map((rec: any) => `
    <div class="recommendation-item">
      <div class="recommendation-title">${rec.title || rec.action || 'Recommendation'}</div>
      <div class="violation-detail">${rec.description || rec.details || ''}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Next Steps</div>
    <p>Based on our analysis, we recommend scheduling a consultation with one of our credit resolution specialists to discuss your options for pursuing damages and correcting these violations.</p>
    <p style="margin-top: 15px;"><strong>Contact us:</strong> Book a free consultation call to discuss your case.</p>
  </div>

  <div class="footer">
    <p><strong>Consumer Advocate Resolution Center</strong></p>
    <p>This analysis is provided for informational purposes and does not constitute legal advice.</p>
    <p>© ${new Date().getFullYear()} Consumer Advocate Resolution Center. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    // Return the HTML as a downloadable PDF-like document
    // For a true PDF, we'd need a headless browser or PDF library
    // This returns HTML that browsers can print to PDF
    const response = new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="Credit-Report-Analysis-${new Date().toISOString().split('T')[0]}.html"`,
      },
    });

    console.log('PDF HTML generated successfully');
    return response;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating PDF:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
