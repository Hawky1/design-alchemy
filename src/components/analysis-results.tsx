'use client';

import { ArrowLeft, AlertTriangle, CheckCircle, Shield, FileText, Scale, Gavel } from 'lucide-react';
import { AnalysisResult } from '@/lib/analysis-schema';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const getSeverityColor = (severity: string) => {
    if (severity === 'High') return 'border-red-600 bg-red-50';
    if (severity === 'Medium') return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getSeverityBadgeColor = (severity: string) => {
    if (severity === 'High') return 'bg-red-200 text-red-900';
    if (severity === 'Medium') return 'bg-yellow-200 text-yellow-900';
    return 'bg-blue-200 text-blue-900';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'High') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (severity === 'Medium') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-blue-500" />;
  };

  const getDamagesPotentialColor = (potential: string) => {
    if (potential === 'Significant') return 'text-green-400';
    if (potential === 'Moderate') return 'text-yellow-400';
    return 'text-neutral-400';
  };

  const totalViolations = results?.legalSummary?.totalViolations ?? results?.fcraViolations?.length ?? 0;
  const highSeverityCount = results?.fcraViolations?.filter(v => v?.severity === 'High')?.length ?? 0;
  const mediumSeverityCount = results?.fcraViolations?.filter(v => v?.severity === 'Medium')?.length ?? 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(251, 113, 133, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(251, 113, 133, 0.1) 0%, transparent 40%)`
        }}></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onReset}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Analyze New Report</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-100 mb-4">FCRA Violation Analysis</h1>
          <p className="text-lg text-neutral-300">Comprehensive legal exposure assessment</p>
        </div>

        {/* Legal Exposure Summary - Top Card */}
        <div className={`rounded-2xl shadow-2xl p-8 mb-8 text-white border-4 ${
          totalViolations > 0 
            ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-800' 
            : 'bg-gradient-to-r from-green-600 to-green-700 border-green-800'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-10 h-10" />
            <div>
              <h2 className="text-3xl font-bold">Legal Exposure Summary</h2>
              <p className="text-white/80 mt-1">
                {totalViolations > 0 
                  ? 'FCRA/FDCPA Violations Detected - Review Required' 
                  : 'No Violations Detected'}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">Total Violations</p>
              <p className="text-4xl font-bold">{totalViolations}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">High Severity</p>
              <p className="text-4xl font-bold">{highSeverityCount}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">Medium Severity</p>
              <p className="text-4xl font-bold">{mediumSeverityCount}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">Damages Potential</p>
              <p className={`text-2xl font-bold ${getDamagesPotentialColor(results?.legalSummary?.estimatedDamagesPotential ?? 'Low')}`}>
                {results?.legalSummary?.estimatedDamagesPotential ?? 'Low'}
              </p>
            </div>
          </div>
          {results?.legalSummary?.attorneyReferralRecommended && (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-white/30">
              <div className="flex items-center gap-3 mb-2">
                <Gavel className="w-6 h-6" />
                <h3 className="font-bold text-xl">Attorney Referral Recommended</h3>
              </div>
              <p className="text-white/90">Based on the violations found, consulting with a consumer rights attorney is strongly recommended to evaluate potential legal remedies.</p>
            </div>
          )}
        </div>

        {/* Report Summary */}
        {results?.reportSummary && (
          <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-rose-500" />
              <h2 className="text-2xl font-bold text-neutral-100">Report Summary</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Consumer Name</p>
                <p className="text-lg font-semibold text-neutral-100">{results.reportSummary.consumerName ?? 'Not specified'}</p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Report Date</p>
                <p className="text-lg font-semibold text-neutral-100">{results.reportSummary.reportDate ?? 'Not specified'}</p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Accounts Analyzed</p>
                <p className="text-lg font-semibold text-neutral-100">{results.reportSummary.totalAccountsAnalyzed ?? 0}</p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Source Bureau(s)</p>
                <p className="text-lg font-semibold text-neutral-100">{results.reportSummary.fileSource ?? 'Unknown'}</p>
              </div>
            </div>
          </div>
        )}

        {/* FCRA Violations - Detailed Breakdown */}
        {((results?.fcraViolations ?? [])?.length ?? 0) > 0 && (
          <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border-2 border-red-500/50 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-red-400" />
              <h2 className="text-2xl font-bold text-neutral-100">FCRA Violations Detected</h2>
            </div>
            <div className="bg-red-950/50 border-l-4 border-red-600 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-red-200 font-medium">
                <strong>Legal Basis:</strong> Fair Credit Reporting Act (FCRA) 15 USC Section 1681 and Fair Debt Collection Practices Act (FDCPA) 15 USC Section 1692
              </p>
              <p className="text-sm text-red-300 mt-2">
                The violations below may entitle you to statutory damages, actual damages, and attorney fees. Consult with a consumer rights attorney.
              </p>
            </div>
            <div className="space-y-6">
              {(results?.fcraViolations ?? [])?.map?.((violation, idx) => (
                <div key={idx} className={`border-l-4 p-6 rounded-r-xl ${getSeverityColor(violation?.severity ?? 'Low')}`}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(violation?.severity ?? 'Low')}
                    <div className="flex-1">
                      {/* Violation Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(violation?.severity ?? 'Low')}`}>
                          {violation?.severity ?? 'Low'} Severity
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                          {violation?.violationTitle ?? 'Unknown Violation'}
                        </span>
                      </div>

                      {/* Accounts Involved */}
                      {violation?.accountsInvolved && (violation?.accountsInvolved ?? [])?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-800 mb-2">Accounts Involved:</p>
                          <div className="flex flex-wrap gap-2">
                            {(violation?.accountsInvolved ?? [])?.map?.((account, aIdx) => (
                              <span 
                                key={aIdx}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                              >
                                {account}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Legal Basis */}
                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Legal Basis:</p>
                        <p className="text-sm text-gray-700 font-mono">{violation?.legalBasis ?? 'Not specified'}</p>
                      </div>

                      {/* Explanation */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Violation Explanation:</p>
                        <p className="text-sm text-gray-700">{violation?.explanation ?? 'No explanation provided'}</p>
                      </div>

                      {/* Suggested Action - Highlighted */}
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-400">
                        <p className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Suggested Action:
                        </p>
                        <p className="text-sm text-green-800 whitespace-pre-line">{violation?.suggestedAction ?? 'Contact a consumer rights attorney for guidance.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Analysis */}
        {((results?.accountAnalysis ?? [])?.length ?? 0) > 0 && (
          <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-rose-500" />
              <h2 className="text-2xl font-bold text-neutral-100">Account Analysis</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Account Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Account #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Balance</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {(results?.accountAnalysis ?? [])?.slice?.(0, 50)?.map?.((account, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/50">
                      <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{account?.accountName ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-300 font-mono">{account?.accountNumber ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          account?.status === 'Open' || account?.status === 'Current'
                            ? 'bg-green-950/60 text-green-300 border-green-700'
                            : account?.status === 'Closed'
                            ? 'bg-neutral-800 text-neutral-300 border-neutral-600'
                            : account?.status === 'Derogatory' || account?.status === 'Collection'
                            ? 'bg-red-950/60 text-red-300 border-red-700'
                            : 'bg-yellow-950/60 text-yellow-300 border-yellow-700'
                        }`}>
                          {account?.status ?? 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-100">{account?.balance ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-sm max-w-md">
                        {account?.comments ? (
                          <div className="bg-amber-950/60 border-l-4 border-amber-500 px-4 py-3 rounded-r-lg">
                            <p className="text-amber-100 leading-relaxed whitespace-pre-wrap">{account.comments}</p>
                          </div>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Overall Assessment</h2>
          <p className="text-lg leading-relaxed">{results?.summary ?? 'Analysis complete. Review the violations above for detailed findings and recommended actions.'}</p>
        </div>
      </div>
    </div>
  );
}
