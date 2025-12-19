
'use client';

import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, XCircle, DollarSign, CreditCard, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { AnalysisResult } from '@/lib/analysis-schema';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const paymentData = [
    { name: 'On-Time', value: results?.paymentHistory?.onTimePayments ?? 0, color: '#10b981' },
    { name: 'Late', value: results?.paymentHistory?.latePayments ?? 0, color: '#f59e0b' },
    { name: 'Missed', value: results?.paymentHistory?.missedPayments ?? 0, color: '#ef4444' }
  ];

  const utilizationData = [
    { name: 'Used', value: results?.creditUtilization?.utilizationPercentage ?? 0, color: '#3b82f6' },
    { name: 'Available', value: 100 - (results?.creditUtilization?.utilizationPercentage ?? 0), color: '#e5e7eb' }
  ];

  const getScoreColor = (score: any) => {
    if (typeof score === 'number') {
      if (score >= 740) return 'text-green-400';
      if (score >= 670) return 'text-rose-500';
      if (score >= 580) return 'text-yellow-400';
      return 'text-red-400';
    }
    return 'text-neutral-300';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'bg-red-100 text-red-700 border-red-300';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'High') return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (severity === 'Medium') return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <AlertTriangle className="w-5 h-5 text-rose-500" />;
  };

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
          <h1 className="text-4xl font-bold text-neutral-100 mb-4">Credit Report Analysis</h1>
          <p className="text-lg text-neutral-300">Comprehensive insights and recommendations</p>
        </div>

        {/* Credit Score Section */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-rose-500" />
            <h2 className="text-2xl font-bold text-neutral-100">Credit Score Overview</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-center mb-6">
                <p className="text-neutral-300 mb-2">Current Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(results?.creditScore?.current)}`}>
                  {results?.creditScore?.current ?? 'N/A'}
                </p>
                <p className="text-xl text-neutral-300 mt-2">{results?.creditScore?.range ?? 'Not Available'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 mb-4">Key Factors Affecting Score</h3>
              <ul className="space-y-2">
                {(results?.creditScore?.factors ?? [])?.map?.((factor: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-200">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-neutral-100">Payment History</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentData?.map?.((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border border-green-300">
                  <span className="font-medium text-green-800">On-Time Payments</span>
                  <span className="text-2xl font-bold text-green-700">
                    {results?.paymentHistory?.onTimePayments ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                  <span className="font-medium text-yellow-800">Late Payments</span>
                  <span className="text-2xl font-bold text-yellow-700">
                    {results?.paymentHistory?.latePayments ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border border-red-300">
                  <span className="font-medium text-red-800">Missed Payments</span>
                  <span className="text-2xl font-bold text-red-700">
                    {results?.paymentHistory?.missedPayments ?? 0}
                  </span>
                </div>
                <div className="p-4 bg-blue-100 rounded-lg border border-blue-300">
                  <p className="text-sm text-blue-700">Payment Success Rate</p>
                  <p className="text-3xl font-bold text-blue-800">
                    {results?.paymentHistory?.percentageOnTime?.toFixed?.(1) ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Utilization */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-neutral-100">Credit Utilization</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => `${value.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizationData?.map?.((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-1">Total Credit Available</p>
                <p className="text-2xl font-bold text-neutral-100">
                  ${results?.creditUtilization?.totalCredit?.toLocaleString?.() ?? '0'}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-700 mb-1">Credit Used</p>
                <p className="text-2xl font-bold text-blue-800">
                  ${results?.creditUtilization?.usedCredit?.toLocaleString?.() ?? '0'}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-sm text-purple-700 mb-1">Utilization Rate</p>
                <p className="text-2xl font-bold text-purple-800">
                  {results?.creditUtilization?.utilizationPercentage?.toFixed?.(1) ?? 0}%
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-1">Recommendation</p>
                <p className="text-sm text-green-700">{results?.creditUtilization?.recommendation ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Overview */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-rose-500" />
            <h2 className="text-2xl font-bold text-neutral-100">Active Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Account</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Bureaus</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">Violation Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(results?.accounts ?? [])?.slice?.(0, 20)?.map?.((account: any, idx: number) => (
                  <tr key={idx} className={`hover:bg-neutral-800/50 ${
                    (account?.potentialViolation && account?.potentialViolation !== 'None') || 
                    (account?.crossBureauDiscrepancy && account?.crossBureauDiscrepancy !== 'None')
                      ? 'bg-red-900/30'
                      : ''
                  }`}>
                    <td className="px-4 py-3 text-sm text-neutral-100">
                      <div>
                        {account?.name ?? 'N/A'}
                        {account?.crossBureauDiscrepancy && account?.crossBureauDiscrepancy !== 'None' && (
                          <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Cross-bureau issue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-300">{account?.type ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-100">
                      ${account?.balance?.toLocaleString?.() ?? '0'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {account?.bureaus && (account?.bureaus ?? [])?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {(account?.bureaus ?? [])?.map?.((bureau: string, bIdx: number) => (
                            <span 
                              key={bIdx} 
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                bureau?.includes('Experian') 
                                  ? 'bg-red-100 text-red-700'
                                  : bureau?.includes('Equifax')
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {bureau?.replace('TransUnion', 'TU')?.replace('Experian', 'EXP')?.replace('Equifax', 'EQF')}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        account?.status === 'Current' || account?.status === 'Open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {account?.status ?? 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {account?.potentialViolation && account?.potentialViolation !== 'None' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-200 text-red-900 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          {account?.potentialViolation}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Clean
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-neutral-100">Personalized Recommendations</h2>
          </div>
          <div className="space-y-4">
            {(results?.recommendations ?? [])?.map?.((rec: any, idx: number) => (
              <div key={idx} className="border border-white/10 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(rec?.priority ?? 'Low')}`}>
                    {rec?.priority ?? 'Low'} Priority
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-100 mb-2">{rec?.title ?? 'N/A'}</h3>
                    <p className="text-neutral-300 mb-3">{rec?.description ?? 'N/A'}</p>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">{rec?.potentialImpact ?? 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debt-to-Income */}
        <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-neutral-100">Debt-to-Income Ratio</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-indigo-100 rounded-xl border border-indigo-300">
              <p className="text-sm text-indigo-700 mb-2">Estimated Monthly Debt</p>
              <p className="text-3xl font-bold text-indigo-800">
                ${results?.debtToIncome?.estimatedMonthlyDebt?.toLocaleString?.() ?? '0'}
              </p>
            </div>
            <div className="p-6 bg-purple-100 rounded-xl border border-purple-300">
              <p className="text-sm text-purple-700 mb-2">DTI Ratio</p>
              <p className="text-3xl font-bold text-purple-800">{results?.debtToIncome?.ratio ?? 'N/A'}</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-xl border border-blue-300">
              <p className="text-sm text-blue-700 mb-2">Assessment</p>
              <p className="text-lg font-semibold text-blue-800">{results?.debtToIncome?.assessment ?? 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Legal Case Summary - Show first if violations exist */}
        {results?.legalCaseSummary && (results?.legalCaseSummary?.totalViolationsFound ?? 0) > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-8 mb-8 text-white border-4 border-red-800">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-10 h-10" />
              <div>
                <h2 className="text-3xl font-bold">Legal Case Potential Identified</h2>
                <p className="text-red-100 mt-1">FCRA/FDCPA Violations Detected - Attorney Referral Recommended</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-red-100 text-sm mb-1">Total Violations</p>
                <p className="text-4xl font-bold">{results?.legalCaseSummary?.totalViolationsFound ?? 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-red-100 text-sm mb-1">High Priority</p>
                <p className="text-4xl font-bold">{results?.legalCaseSummary?.highPriorityViolations ?? 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-red-100 text-sm mb-1">Compensation Potential</p>
                <p className="text-2xl font-bold">{results?.legalCaseSummary?.estimatedCompensationPotential ?? 'N/A'}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-red-100 text-sm mb-1">Attorney Referral</p>
                <p className="text-2xl font-bold">
                  {results?.legalCaseSummary?.attorneyReferralRecommended ? 'RECOMMENDED' : 'Not Needed'}
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-white/30">
              <h3 className="font-bold text-xl mb-3">Next Steps:</h3>
              <p className="text-lg leading-relaxed">{results?.legalCaseSummary?.nextSteps ?? 'N/A'}</p>
            </div>
          </div>
        )}

        {/* FCRA/FDCPA Violations - Detailed Breakdown */}
        {((results?.fcraViolations ?? [])?.length ?? 0) > 0 && (
          <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 p-8 mb-8 border-2 border-red-300">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-red-400" />
              <h2 className="text-2xl font-bold text-neutral-100">FCRA/FDCPA Violations Detected</h2>
            </div>
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
              <p className="text-sm text-red-800 font-medium">
                <strong>Legal Basis:</strong> Fair Credit Reporting Act (FCRA) 15 USC Section 1681 and Fair Debt Collection Practices Act (FDCPA) 15 USC Section 1692
              </p>
              <p className="text-sm text-red-700 mt-2">
                The violations below may entitle you to statutory damages, actual damages, and attorney fees. Consult with a consumer rights attorney.
              </p>
            </div>
            <div className="space-y-6">
              {(results?.fcraViolations ?? [])?.map?.((violation: any, idx: number) => (
                <div key={idx} className={`border-l-4 p-6 rounded-r-xl ${
                  violation?.severity === 'High'
                    ? 'border-red-600 bg-red-50'
                    : violation?.severity === 'Medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(violation?.severity ?? 'Low')}
                    <div className="flex-1">
                      {/* Violation Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          violation?.severity === 'High'
                            ? 'bg-red-200 text-red-900'
                            : violation?.severity === 'Medium'
                            ? 'bg-yellow-200 text-yellow-900'
                            : 'bg-blue-200 text-blue-900'
                        }`}>
                          {violation?.severity ?? 'Low'} Severity
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                          {violation?.violationType ?? 'Unknown'}
                        </span>
                        {violation?.legalCompensationPotential === 'High' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-200 text-green-900">
                            High Compensation Potential
                          </span>
                        )}
                      </div>

                      {/* Account Information */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{violation?.issue ?? 'N/A'}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
                          <span><strong className="text-gray-900">Account:</strong> {violation?.accountName ?? 'N/A'}</span>
                          <span><strong className="text-gray-900">Account #:</strong> ****{violation?.accountNumber ?? 'N/A'}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
                          <span><strong className="text-gray-900">Current Balance:</strong> ${violation?.currentBalance?.toLocaleString?.() ?? '0'}</span>
                          <span><strong className="text-gray-900">Expected Balance:</strong> ${violation?.expectedBalance?.toLocaleString?.() ?? '0'}</span>
                        </div>
                        {violation?.bureausAffected && (violation?.bureausAffected ?? [])?.length > 0 && (
                          <div className="flex gap-2 items-center mt-2">
                            <strong className="text-sm text-gray-800">Bureaus Affected:</strong>
                            <div className="flex flex-wrap gap-1">
                              {(violation?.bureausAffected ?? [])?.map?.((bureau: string, bIdx: number) => (
                                <span 
                                  key={bIdx}
                                  className={`px-2 py-1 rounded text-xs font-bold ${
                                    bureau?.includes('Experian')
                                      ? 'bg-red-200 text-red-900'
                                      : bureau?.includes('Equifax')
                                      ? 'bg-blue-200 text-blue-900'
                                      : 'bg-green-200 text-green-900'
                                  }`}
                                >
                                  {bureau}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cross-Bureau Details */}
                      {violation?.crossBureauDetails && violation?.crossBureauDetails !== 'None' && (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border-2 border-orange-300 mb-4">
                          <p className="text-sm font-semibold text-orange-900 mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Cross-Bureau Discrepancy Detected:
                          </p>
                          <p className="text-sm text-orange-800 font-medium">{violation?.crossBureauDetails}</p>
                          <p className="text-xs text-orange-700 mt-2 italic">
                            Cross-bureau discrepancies are strong indicators of FCRA violations and may significantly strengthen your legal case.
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Violation Details:</p>
                        <p className="text-sm text-gray-700">{violation?.description ?? 'N/A'}</p>
                      </div>

                      {/* Legal Basis */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Legal Basis:</p>
                        <p className="text-sm text-gray-700 font-mono">{violation?.legalBasis ?? 'N/A'}</p>
                      </div>

                      {/* Documentation Needed */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 mb-4">
                        <p className="text-sm font-semibold text-yellow-900 mb-1">Documentation Needed:</p>
                        <p className="text-sm text-yellow-800">{violation?.documentationNeeded ?? 'N/A'}</p>
                      </div>

                      {/* Actionable Steps */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 mb-4">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Actionable Steps:</p>
                        <p className="text-sm text-blue-800">{violation?.actionableSteps ?? 'N/A'}</p>
                      </div>

                      {/* Recommendation */}
                      <div className={`p-4 rounded-lg border-2 ${
                        violation?.legalCompensationPotential === 'High'
                          ? 'bg-green-100 border-green-400'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <p className="text-sm font-semibold text-gray-800 mb-1">Recommendation:</p>
                        <p className="text-sm text-gray-700 font-medium">{violation?.recommendation ?? 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Overall Assessment</h2>
          <p className="text-lg leading-relaxed">{results?.summary ?? 'Analysis complete'}</p>
        </div>
      </div>
    </div>
  );
}
