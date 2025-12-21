import {
  ArrowLeft, AlertTriangle, CheckCircle, Shield, FileText, Scale, Gavel, 
  BookOpen, FileWarning, Clock, Copy, UserX, DollarSign, Building, Phone, 
  AlertOctagon, TrendingUp, Calendar, PieChart, Target, ClipboardList,
  HelpCircle, AlertCircle, Ban, ChevronDown, ChevronUp, Printer, Download
} from 'lucide-react';
import { AnalysisResult } from '@/lib/analysis-schema';
import { BookCallCTA } from '@/components/book-call-cta';
import { useLead } from '@/lib/lead-context';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import carcLogo from '@/assets/carc-header-logo.png';
import acrLogo from '@/assets/annualcreditreport-logo-color.png';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const { lead, updateLead } = useLead();
  const { toast } = useToast();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executive: true,
    utilization: true,
    ageOfCredit: false,
    creditMix: false,
    issueFlags: true,
    actionPlan: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your report.",
    });

    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { 
          results: {
            executive_summary: {
              summary: results?.executiveSummary?.map(s => s.bullet).join(' ') || '',
              key_findings: results?.executiveSummary?.map(s => s.bullet) || [],
              overall_score: results?.reportSummary?.totalAccountsAnalyzed || 'N/A',
              estimated_damages: results?.legalSummary?.estimatedDamagesPotential || '$0',
              bureaus_analyzed: results?.reportSummary?.bureausAnalyzed || [],
            },
            violations: results?.sixCategoryIssueFlags ? [
              ...(results.sixCategoryIssueFlags.category1_duplicateReporting || []).map((v: any) => ({
                type: 'Duplicate Reporting',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
              ...(results.sixCategoryIssueFlags.category2_identityTheft || []).map((v: any) => ({
                type: 'Identity Theft Red Flag',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
              ...(results.sixCategoryIssueFlags.category3_wrongBalanceStatus || []).map((v: any) => ({
                type: 'Wrong Balance/Status',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
              ...(results.sixCategoryIssueFlags.category4_postBankruptcyMisreporting || []).map((v: any) => ({
                type: 'Post-Bankruptcy Misreporting',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
              ...(results.sixCategoryIssueFlags.category5_debtCollectionRedFlags || []).map((v: any) => ({
                type: 'Debt Collection Red Flag',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
              ...(results.sixCategoryIssueFlags.category6_legalDateObsolescence || []).map((v: any) => ({
                type: 'Legal/Date Obsolescence',
                bureau: v.bureau,
                priority: v.priority,
                description: v.description,
                legal_basis: v.legalBasis,
              })),
            ] : [],
            recommendations: [
              ...(results?.consumerActionPlan?.next7Days || []).map((item: any) => ({
                title: item.action,
                description: item.details || item.impactReason,
              })),
              ...(results?.consumerActionPlan?.next30Days || []).map((item: any) => ({
                title: item.action,
                description: item.details || item.impactReason,
              })),
              ...(results?.recommendedNextSteps || []).map((item: any) => ({
                title: item.action,
                description: item.details,
              })),
            ],
          },
          leadName: lead?.name || 'Consumer',
        },
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Credit-Report-Analysis-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Downloaded!",
        description: "Open the file and use 'Print > Save as PDF' for best results.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try the Print option instead.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [results, lead, isGeneratingPdf, toast]);

  const getPriorityColor = (priority: string | undefined) => {
    if (priority === 'High') return 'bg-red-50 text-red-800 border-red-200';
    if (priority === 'Med' || priority === 'Medium') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getPriorityBadge = (priority: string | undefined) => {
    if (priority === 'High') return 'bg-red-600 text-white';
    if (priority === 'Med' || priority === 'Medium') return 'bg-yellow-500 text-white';
    return 'bg-blue-500 text-white';
  };

  // Count all issue flags
  const countIssueFlags = () => {
    const flags = results?.sixCategoryIssueFlags;
    if (!flags) return 0;
    return (
      (flags.category1_duplicateReporting?.length ?? 0) +
      (flags.category2_identityTheft?.length ?? 0) +
      (flags.category3_wrongBalanceStatus?.length ?? 0) +
      (flags.category4_postBankruptcyMisreporting?.length ?? 0) +
      (flags.category5_debtCollectionRedFlags?.length ?? 0) +
      (flags.category6_legalDateObsolescence?.length ?? 0)
    );
  };

  const totalIssueFlags = countIssueFlags();
  const totalViolations = results?.legalSummary?.totalViolations ?? totalIssueFlags;

  useEffect(() => {
    if (lead && totalViolations >= 0) {
      updateLead({ analysisCompleted: true, violationsFound: totalViolations });
    }
  }, [totalViolations]);

  // Section Header Component
  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    section, 
    count,
    iconColor = "text-rose-600"
  }: { 
    icon: any; 
    title: string; 
    subtitle?: string; 
    section: string;
    count?: number;
    iconColor?: string;
  }) => (
    <button 
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between gap-3 mb-4 hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-7 h-7 ${iconColor}`} />
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {title}
            {count !== undefined && count > 0 && (
              <span className="px-2 py-0.5 text-sm bg-rose-600 text-white rounded-full">{count}</span>
            )}
          </h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden print-container">
      {/* Branded Header with Print/Download */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm print-header no-print">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo and Branding */}
            <div className="flex items-center gap-4">
              <img 
                src={carcLogo} 
                alt="Consumer Advocate Resolution Center" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onReset} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Analyze New Report</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button 
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Print-only Header (shows when printing) */}
      <div className="hidden print:block p-6 border-b-2 border-gray-300 mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={carcLogo} 
            alt="Consumer Advocate Resolution Center" 
            className="h-16 w-auto"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">Credit Report Analysis • Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Report Header with Name and Date */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Credit Report Analysis For</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {lead?.name || results?.reportSummary?.consumerName || 'Consumer'}
              </h1>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={acrLogo} 
                alt="AnnualCreditReport.com" 
                className="h-10 md:h-12 w-auto"
              />
            </div>
            <div className="flex-1 text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Credit Report Analysis For</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {lead?.name || results?.reportSummary?.consumerName || 'Consumer'}
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Scan Completed</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">3-Bureau Credit Report Audit</h2>
          <p className="text-gray-600">Comprehensive credit health analysis with issue flagging</p>
        </div>

        {/* Executive Summary */}
        {results?.executiveSummary && results.executiveSummary.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <SectionHeader 
              icon={FileText} 
              title="Executive Summary" 
              subtitle="Key findings at a glance"
              section="executive"
            />
            {expandedSections.executive && (
              <div className="space-y-2">
                {results.executiveSummary.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-rose-600 font-bold">{idx + 1}.</span>
                    <p className="text-gray-700">{item.bullet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Summary */}
        {results?.reportSummary && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-7 h-7 text-rose-600" />
              <h2 className="text-xl font-bold text-gray-900">Report Summary</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Consumer</p>
                <p className="text-lg font-semibold text-gray-900">{results.reportSummary.consumerName ?? 'Redacted'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Report Date</p>
                <p className="text-lg font-semibold text-gray-900">{results.reportSummary.reportDate ?? 'Not shown'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Accounts Analyzed</p>
                <p className="text-lg font-semibold text-gray-900">{results.reportSummary.totalAccountsAnalyzed ?? 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Bureaus</p>
                <p className="text-lg font-semibold text-gray-900">
                  {results.reportSummary.bureausAnalyzed?.join(', ') ?? results.reportSummary.fileSource ?? 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Credit Utilization */}
        {results?.creditUtilization && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <SectionHeader 
              icon={TrendingUp} 
              title="Credit Utilization" 
              subtitle="Revolving account usage with math shown"
              section="utilization"
              iconColor="text-emerald-600"
            />
            {expandedSections.utilization && (
              <>
                {/* Total Utilization Card */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 mb-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-1">Total Revolving Utilization</p>
                      <p className={`text-4xl font-bold ${
                        (results.creditUtilization.totalUtilization ?? 0) > 50 ? 'text-red-600' :
                        (results.creditUtilization.totalUtilization ?? 0) > 30 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {results.creditUtilization.totalUtilizationPercent ?? `${results.creditUtilization.totalUtilization ?? 0}%`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-1">Total Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(results.creditUtilization.totalRevolvingBalance ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-emerald-700 mb-1">Total Limit</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(results.creditUtilization.totalRevolvingLimit ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {results.creditUtilization.calculationShown && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-emerald-800 font-mono bg-white/70 inline-block px-4 py-2 rounded border border-emerald-200">
                        Calculation: {results.creditUtilization.calculationShown}
                      </p>
                    </div>
                  )}
                </div>

                {/* Per-Card Utilization */}
                {results.creditUtilization.perCardUtilization && results.creditUtilization.perCardUtilization.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Per-Card Utilization (Ranked Highest to Lowest)</h3>
                    <div className="space-y-2">
                      {results.creditUtilization.perCardUtilization.map((card, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                          card.flagged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                            <span className="text-gray-900 font-medium">{card.accountName}</span>
                            {card.flagged && (
                              <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded">{card.flagReason}</span>
                            )}
                            {card.limitMissing && (
                              <span className="px-2 py-0.5 text-xs bg-gray-500 text-white rounded">Limit Missing</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500 text-sm">
                              ${card.balance?.toLocaleString() ?? 0} / ${card.limit?.toLocaleString() ?? '?'}
                            </span>
                            <span className={`text-lg font-bold ${
                              (card.utilization ?? 0) > 90 ? 'text-red-600' :
                              (card.utilization ?? 0) > 50 ? 'text-orange-600' :
                              (card.utilization ?? 0) > 30 ? 'text-yellow-600' : 'text-emerald-600'
                            }`}>
                              {card.utilizationPercent ?? `${card.utilization ?? 0}%`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Thresholds */}
                {results.creditUtilization.flaggedThresholds && (
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {(results.creditUtilization.flaggedThresholds.above90Percent?.length ?? 0) > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-semibold text-red-700 mb-2">Above 90%</p>
                        <p className="text-sm text-red-600">
                          {results.creditUtilization.flaggedThresholds.above90Percent?.join(', ')}
                        </p>
                      </div>
                    )}
                    {(results.creditUtilization.flaggedThresholds.above50Percent?.length ?? 0) > 0 && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-semibold text-orange-700 mb-2">Above 50%</p>
                        <p className="text-sm text-orange-600">
                          {results.creditUtilization.flaggedThresholds.above50Percent?.join(', ')}
                        </p>
                      </div>
                    )}
                    {(results.creditUtilization.flaggedThresholds.above30Percent?.length ?? 0) > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-semibold text-yellow-700 mb-2">Above 30%</p>
                        <p className="text-sm text-yellow-600">
                          {results.creditUtilization.flaggedThresholds.above30Percent?.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Missing Limits */}
                {results.creditUtilization.accountsMissingLimit && results.creditUtilization.accountsMissingLimit.length > 0 && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Accounts excluded from calculation (missing credit limit):
                    </p>
                    <p className="text-sm text-gray-700">{results.creditUtilization.accountsMissingLimit.join(', ')}</p>
                  </div>
                )}

                {/* Paydown Order */}
                {results.creditUtilization.paydownOrder && results.creditUtilization.paydownOrder.length > 0 && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm font-semibold text-emerald-700 mb-2">Recommended Paydown Order:</p>
                    <ol className="list-decimal list-inside text-sm text-emerald-600 space-y-1">
                      {results.creditUtilization.paydownOrder.map((account, idx) => (
                        <li key={idx}>{account}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Age of Credit */}
        {results?.ageOfCredit && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <SectionHeader 
              icon={Calendar} 
              title="Age of Credit" 
              subtitle="Account age metrics with formulas"
              section="ageOfCredit"
              iconColor="text-blue-600"
            />
            {expandedSections.ageOfCredit && (
              <>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Oldest Account</p>
                    <p className="text-xl font-bold text-blue-600">{results.ageOfCredit.oldestAccountAge ?? 'N/A'}</p>
                    <p className="text-xs text-blue-500 mt-1">{results.ageOfCredit.oldestAccountName ?? ''}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Newest Account</p>
                    <p className="text-xl font-bold text-blue-600">{results.ageOfCredit.newestAccountAge ?? 'N/A'}</p>
                    <p className="text-xs text-blue-500 mt-1">{results.ageOfCredit.newestAccountName ?? ''}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Average Age (AAoA)</p>
                    <p className="text-xl font-bold text-blue-600">{results.ageOfCredit.averageAgeOfAccounts ?? 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">AAoA (Revolving Only)</p>
                    <p className="text-xl font-bold text-blue-600">{results.ageOfCredit.averageAgeRevolvingOnly ?? 'N/A'}</p>
                  </div>
                </div>

                {results.ageOfCredit.averageAgeFormula && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Formula: </p>
                    <p className="text-sm text-gray-700 font-mono">{results.ageOfCredit.averageAgeFormula}</p>
                  </div>
                )}

                {results.ageOfCredit.accountsMissingOpenDate && results.ageOfCredit.accountsMissingOpenDate.length > 0 && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Accounts excluded (missing open date): {results.ageOfCredit.accountsMissingOpenDate.join(', ')}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Credit Mix */}
        {results?.creditMix && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <SectionHeader 
              icon={PieChart} 
              title="Credit Mix Analysis" 
              subtitle="Account type breakdown"
              section="creditMix"
              iconColor="text-purple-600"
            />
            {expandedSections.creditMix && (
              <>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {/* Revolving */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-700 mb-2">Revolving</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">Open: <span className="text-green-600">{results.creditMix.revolving?.openCount ?? 0}</span></p>
                      <p className="text-gray-700">Closed: <span className="text-gray-500">{results.creditMix.revolving?.closedCount ?? 0}</span></p>
                      <p className="text-gray-700">Derogatory: <span className="text-red-600">{results.creditMix.revolving?.derogatoryCount ?? 0}</span></p>
                    </div>
                  </div>

                  {/* Installment */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-700 mb-2">Installment</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">Auto: <span className="text-gray-600">{results.creditMix.installment?.autoCount ?? 0}</span></p>
                      <p className="text-gray-700">Personal: <span className="text-gray-600">{results.creditMix.installment?.personalCount ?? 0}</span></p>
                      <p className="text-gray-700">Student: <span className="text-gray-600">{results.creditMix.installment?.studentCount ?? 0}</span></p>
                    </div>
                  </div>

                  {/* Mortgage */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-700 mb-2">Mortgage</p>
                    <p className="text-2xl font-bold text-gray-900">{results.creditMix.mortgage?.count ?? 0}</p>
                    {results.creditMix.mortgage?.statuses && (
                      <p className="text-xs text-gray-500 mt-1">{results.creditMix.mortgage.statuses.join(', ')}</p>
                    )}
                  </div>

                  {/* Collections */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-semibold text-red-700 mb-2">Collections</p>
                    <p className="text-2xl font-bold text-red-600">{results.creditMix.collections?.count ?? 0}</p>
                    <p className="text-sm text-red-500">
                      {results.creditMix.collections?.totalBalanceFormatted ?? `$${(results.creditMix.collections?.totalBalance ?? 0).toLocaleString()}`}
                    </p>
                  </div>
                </div>

                {/* Bankruptcy */}
                {results.creditMix.publicRecords?.bankruptcyPresent && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-orange-700 mb-2">Public Record: Bankruptcy</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <p className="text-gray-700">Type: <span className="text-orange-600">{results.creditMix.publicRecords.bankruptcyType ?? 'Unknown'}</span></p>
                      <p className="text-gray-700">Filing Date: <span className="text-orange-600">{results.creditMix.publicRecords.filingDate ?? 'Not shown'}</span></p>
                      <p className="text-gray-700">Discharge Date: <span className="text-orange-600">{results.creditMix.publicRecords.dischargeDate ?? 'Not shown'}</span></p>
                    </div>
                  </div>
                )}

                {/* Mix Weaknesses */}
                {results.creditMix.mixWeaknesses && results.creditMix.mixWeaknesses.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-700 mb-2">Identified Weaknesses:</p>
                    <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                      {results.creditMix.mixWeaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 6-Category Issue Flags */}
        {results?.sixCategoryIssueFlags && totalIssueFlags > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border-2 border-rose-300 p-6 mb-6">
            <SectionHeader 
              icon={AlertOctagon} 
              title="6-Category Issue Flags" 
              subtitle="Potential FCRA/FDCPA issues detected from credit report"
              section="issueFlags"
              count={totalIssueFlags}
              iconColor="text-rose-600"
            />
            {expandedSections.issueFlags && (
              <div className="space-y-6">
                {/* Category 1: Duplicate Reporting */}
                {results.sixCategoryIssueFlags.category1_duplicateReporting && results.sixCategoryIssueFlags.category1_duplicateReporting.length > 0 && (
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                      <Copy className="w-5 h-5" />
                      Category 1: Possible Duplicate/Double Reporting
                      <span className="text-sm font-normal text-red-500">({results.sixCategoryIssueFlags.category1_duplicateReporting.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category1_duplicateReporting.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 2: Identity Theft */}
                {results.sixCategoryIssueFlags.category2_identityTheft && results.sixCategoryIssueFlags.category2_identityTheft.length > 0 && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                      <UserX className="w-5 h-5" />
                      Category 2: Identity Theft / Not-Mine Indicators
                      <span className="text-sm font-normal text-purple-500">({results.sixCategoryIssueFlags.category2_identityTheft.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category2_identityTheft.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 3: Wrong Balance/Status */}
                {results.sixCategoryIssueFlags.category3_wrongBalanceStatus && results.sixCategoryIssueFlags.category3_wrongBalanceStatus.length > 0 && (
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Category 3: Wrong Balance / Wrong Status
                      <span className="text-sm font-normal text-yellow-600">({results.sixCategoryIssueFlags.category3_wrongBalanceStatus.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category3_wrongBalanceStatus.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 4: Post-Bankruptcy */}
                {results.sixCategoryIssueFlags.category4_postBankruptcyMisreporting && results.sixCategoryIssueFlags.category4_postBankruptcyMisreporting.length > 0 && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Category 4: Post-Bankruptcy Misreporting
                      <span className="text-sm font-normal text-blue-500">({results.sixCategoryIssueFlags.category4_postBankruptcyMisreporting.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category4_postBankruptcyMisreporting.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 5: Debt Collection Red Flags */}
                {results.sixCategoryIssueFlags.category5_debtCollectionRedFlags && results.sixCategoryIssueFlags.category5_debtCollectionRedFlags.length > 0 && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                      <FileWarning className="w-5 h-5" />
                      Category 5: Debt Collection Red Flags
                      <span className="text-sm font-normal text-orange-500">({results.sixCategoryIssueFlags.category5_debtCollectionRedFlags.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category5_debtCollectionRedFlags.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category 6: Legal Date/Obsolescence */}
                {results.sixCategoryIssueFlags.category6_legalDateObsolescence && results.sixCategoryIssueFlags.category6_legalDateObsolescence.length > 0 && (
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h3 className="text-lg font-bold text-teal-700 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Category 6: Legal Date / Obsolescence Issues
                      <span className="text-sm font-normal text-teal-500">({results.sixCategoryIssueFlags.category6_legalDateObsolescence.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {results.sixCategoryIssueFlags.category6_legalDateObsolescence.map((flag, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${getPriorityColor(flag.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{flag.accountsInvolved}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityBadge(flag.priority)}`}>{flag.priority}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2"><strong>Why Flagged:</strong> {flag.whyFlagged}</p>
                          <p className="text-sm text-blue-800 bg-blue-50 p-2 rounded border border-blue-200"><strong>Evidence Needed:</strong> {flag.evidenceNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Consumer Action Plan */}
        {results?.consumerActionPlan && (
          <div className="rounded-2xl bg-white shadow-sm border-2 border-emerald-300 p-6 mb-6">
            <SectionHeader 
              icon={Target} 
              title="Consumer Action Plan" 
              subtitle="Ruthlessly prioritized by impact"
              section="actionPlan"
              iconColor="text-emerald-600"
            />
            {expandedSections.actionPlan && (
              <>
                {/* Timeline Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {/* Next 7 Days */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Next 7 Days
                    </h3>
                    {results.consumerActionPlan.next7Days && results.consumerActionPlan.next7Days.length > 0 ? (
                      <ul className="space-y-2">
                        {results.consumerActionPlan.next7Days.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-900 font-medium">{item.action}</p>
                                {item.details && <p className="text-gray-500 text-xs mt-1">{item.details}</p>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No urgent actions</p>
                    )}
                  </div>

                  {/* Next 30 Days */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Next 30 Days
                    </h3>
                    {results.consumerActionPlan.next30Days && results.consumerActionPlan.next30Days.length > 0 ? (
                      <ul className="space-y-2">
                        {results.consumerActionPlan.next30Days.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-900 font-medium">{item.action}</p>
                                {item.details && <p className="text-gray-500 text-xs mt-1">{item.details}</p>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No actions for this period</p>
                    )}
                  </div>

                  {/* Next 90 Days */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Next 90 Days
                    </h3>
                    {results.consumerActionPlan.next90Days && results.consumerActionPlan.next90Days.length > 0 ? (
                      <ul className="space-y-2">
                        {results.consumerActionPlan.next90Days.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-900 font-medium">{item.action}</p>
                                {item.details && <p className="text-gray-500 text-xs mt-1">{item.details}</p>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No actions for this period</p>
                    )}
                  </div>
                </div>

                {/* Additional Recommendations */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Disputes to File First */}
                  {results.consumerActionPlan.disputesToFileFirst && results.consumerActionPlan.disputesToFileFirst.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Disputes to File First:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        {results.consumerActionPlan.disputesToFileFirst.map((dispute, idx) => (
                          <li key={idx}>{dispute}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Documentation Checklist */}
                  {results.consumerActionPlan.documentationChecklist && results.consumerActionPlan.documentationChecklist.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Documentation Checklist:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.consumerActionPlan.documentationChecklist.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Questions to Ask Consumer */}
                {results.consumerActionPlan.questionsToAskConsumer && results.consumerActionPlan.questionsToAskConsumer.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Questions to Confirm Flags (ask the consumer):
                    </h4>
                    <ol className="list-decimal list-inside text-sm text-blue-600 space-y-2">
                      {results.consumerActionPlan.questionsToAskConsumer.map((question, idx) => (
                        <li key={idx}>{question}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Not Detectable From Report */}
        {results?.notDetectableFromReport && results.notDetectableFromReport.length > 0 && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-7 h-7 text-gray-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Not Detectable From Credit Report</h2>
                <p className="text-sm text-gray-500">These issues require external evidence</p>
              </div>
            </div>
            <div className="space-y-2">
              {results.notDetectableFromReport.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-800 font-medium">{item.item}</p>
                    <p className="text-sm text-gray-500">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Summary */}
        {results?.legalSummary && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 text-white border-2 ${
            totalIssueFlags > 0 
              ? 'bg-red-600 border-red-800' 
              : 'bg-green-600 border-green-800'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Legal Summary</h2>
                <p className="text-white/80 text-sm">
                  {totalIssueFlags > 0 ? 'Potential issues detected - review recommended' : 'No significant issues detected'}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-white/80 text-sm mb-1">Total Issues Flagged</p>
                <p className="text-3xl font-bold">{totalIssueFlags}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-white/80 text-sm mb-1">High Priority</p>
                <p className="text-3xl font-bold">{results.legalSummary.highSeverityCount ?? 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-white/80 text-sm mb-1">Damages Potential</p>
                <p className="text-xl font-bold">{results.legalSummary.estimatedDamagesPotential ?? 'Low'}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-white/80 text-sm mb-1">Est. Range</p>
                <p className="text-xl font-bold">{results.legalSummary.estimatedDamagesRange ?? 'N/A'}</p>
              </div>
            </div>
            {results.legalSummary.attorneyReferralRecommended && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  <p className="font-semibold">Attorney consultation recommended based on issues detected.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overall Summary */}
        {results?.summary && (
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-7 h-7 text-rose-600" />
              <h2 className="text-xl font-bold text-gray-900">Overall Assessment</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{results.summary}</p>
          </div>
        )}

        {/* Book a Call CTA */}
        {totalIssueFlags > 0 && (
          <div className="mb-8">
            <BookCallCTA violationsCount={totalIssueFlags} />
          </div>
        )}
      </div>
    </div>
  );
}
