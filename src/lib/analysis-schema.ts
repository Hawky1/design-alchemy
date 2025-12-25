import { z } from 'zod';

const looseString = z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
  .transform(val => {
    if (val === null || val === undefined) return undefined;
    return String(val);
  });

const looseNumber = z.union([z.number(), z.string(), z.null(), z.undefined()])
  .transform(val => {
    if (val === null || val === undefined) return undefined;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  });

const looseStringArr = z.union([z.array(z.string()), z.string(), z.null(), z.undefined()])
  .transform(val => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val;
    return [String(val)];
  });

// ====== NEW SCHEMA: Report Summary ======
const reportSummarySchema = z.object({
  bureau: looseString.optional(),
  reportDate: looseString.optional(),
  score: looseNumber.optional(),
  scoreModel: looseString.optional(),
  derogatoryAccountsCount: looseNumber.optional(),
  totalAccountsCount: looseNumber.optional(),
  // Legacy fields for backwards compatibility
  consumerName: looseString.optional(),
  totalAccountsAnalyzed: looseNumber.optional(),
  fileSource: looseString.optional(),
  consumerState: looseString.optional(),
  bureausAnalyzed: looseStringArr.optional(),
});

// ====== NEW SCHEMA: Personal Info Mismatches ======
const personalInfoMismatchSchema = z.object({
  field: looseString.optional(),
  valuesFound: looseStringArr.optional(),
  note: looseString.optional(),
  // Legacy fields
  type: looseString.optional(),
  equifaxValue: looseString.optional(),
  experianValue: looseString.optional(),
  transunionValue: looseString.optional(),
  concern: looseString.optional(),
});

// ====== NEW SCHEMA: Inquiries ======
const inquirySchema = z.object({
  date: looseString.optional(),
  creditor: looseString.optional(),
  type: looseString.optional(), // "hard"|"soft"
  // Legacy
  requesterName: looseString.optional(),
  bureau: looseString.optional(),
});

// ====== NEW SCHEMA: Public Records ======
const publicRecordSchema = z.object({
  type: looseString.optional(),
  dateFiled: looseString.optional(),
  status: looseString.optional(),
  amount: looseNumber.optional(),
  court: looseString.optional(),
});

// ====== NEW SCHEMA: Master Tradeline Table ======
const masterTradelineSchema = z.object({
  accountId: looseString.optional(),
  creditorName: looseString.optional(),
  accountType: looseString.optional(),
  accountNumberLast4: looseString.optional(),
  bureau: looseString.optional(),
  openDate: looseString.optional(),
  status: looseString.optional(),
  statusLineRaw: looseString.optional(),
  currentBalance: looseNumber.optional(),
  creditLimit: looseNumber.optional(),
  highCredit: looseNumber.optional(),
  pastDue: looseNumber.optional(),
  paymentStatus: looseString.optional(),
  remarks: looseString.optional(),
  isDerogatory: z.boolean().optional(),
  // Legacy fields
  groupId: looseString.optional(),
  furnisherName: looseString.optional(),
  originalAmount: looseString.optional(),
  perBureauData: z.object({
    equifax: z.any().optional(),
    experian: z.any().optional(),
    transunion: z.any().optional(),
  }).optional(),
  discrepanciesNoted: looseStringArr.optional(),
});

// ====== NEW SCHEMA: Credit Metrics ======
const creditUtilizationMetricsSchema = z.object({
  totalRevolvingBalance: looseNumber.optional(),
  totalRevolvingLimit: looseNumber.optional(),
  utilizationPct: looseNumber.optional(),
  utilizationCalc: looseString.optional(),
  notes: looseString.optional(),
  // Legacy fields
  totalUtilization: looseNumber.optional(),
  totalUtilizationPercent: looseString.optional(),
  calculationShown: looseString.optional(),
  perCardUtilization: z.array(z.object({
    accountName: looseString.optional(),
    balance: looseNumber.optional(),
    limit: looseNumber.optional(),
    utilization: looseNumber.optional(),
    utilizationPercent: looseString.optional(),
    flagged: z.boolean().optional(),
    flagReason: looseString.optional(),
    limitMissing: z.boolean().optional(),
  })).optional(),
  accountsMissingLimit: looseStringArr.optional(),
  flaggedThresholds: z.object({
    above30Percent: looseStringArr.optional(),
    above50Percent: looseStringArr.optional(),
    above90Percent: looseStringArr.optional(),
  }).optional(),
  paydownOrder: looseStringArr.optional(),
});

const ageOfCreditMetricsSchema = z.object({
  oldestAccountDate: looseString.optional(),
  newestAccountDate: looseString.optional(),
  averageAgeMonths: looseNumber.optional(),
  ageCalc: looseString.optional(),
  notes: looseString.optional(),
  // Legacy fields
  oldestAccountAge: looseString.optional(),
  oldestAccountName: looseString.optional(),
  newestAccountAge: looseString.optional(),
  newestAccountName: looseString.optional(),
  averageAgeOfAccounts: looseString.optional(),
  averageAgeFormula: looseString.optional(),
  averageAgeRevolvingOnly: looseString.optional(),
  accountsMissingOpenDate: looseStringArr.optional(),
  accountsWithOpenDates: looseNumber.optional(),
});

const creditMixMetricsSchema = z.object({
  revolvingCount: looseNumber.optional(),
  installmentCount: looseNumber.optional(),
  mortgageCount: looseNumber.optional(),
  studentLoanCount: looseNumber.optional(),
  otherCount: looseNumber.optional(),
  notes: looseString.optional(),
  // Legacy fields
  revolving: z.object({
    openCount: looseNumber.optional(),
    closedCount: looseNumber.optional(),
    derogatoryCount: looseNumber.optional(),
  }).optional(),
  installment: z.object({
    autoCount: looseNumber.optional(),
    personalCount: looseNumber.optional(),
    studentCount: looseNumber.optional(),
    otherCount: looseNumber.optional(),
    statuses: looseStringArr.optional(),
  }).optional(),
  mortgage: z.object({
    count: looseNumber.optional(),
    statuses: looseStringArr.optional(),
  }).optional(),
  collections: z.object({
    count: looseNumber.optional(),
    totalBalance: looseNumber.optional(),
    totalBalanceFormatted: looseString.optional(),
  }).optional(),
  publicRecords: z.object({
    bankruptcyPresent: z.boolean().optional(),
    bankruptcyType: looseString.optional(),
    filingDate: looseString.optional(),
    dischargeDate: looseString.optional(),
  }).optional(),
  mixWeaknesses: looseStringArr.optional(),
});

const creditHealthDiagnosisSchema = z.object({
  summary: looseString.optional(),
  topRiskFactors: looseStringArr.optional(),
  quickWins: looseStringArr.optional(),
  // Legacy fields
  likelyTopSuppressors: looseStringArr.optional(),
  highUtilizationIssues: looseStringArr.optional(),
  derogatoryIssues: looseStringArr.optional(),
  thinFileIndicators: looseStringArr.optional(),
  recentInquiriesIssues: looseStringArr.optional(),
  collectionInconsistencies: looseStringArr.optional(),
});

const creditMetricsSchema = z.object({
  creditUtilization: creditUtilizationMetricsSchema.optional(),
  ageOfCredit: ageOfCreditMetricsSchema.optional(),
  creditMix: creditMixMetricsSchema.optional(),
  creditHealthDiagnosis: creditHealthDiagnosisSchema.optional(),
});

// ====== NEW SCHEMA: Consumer Law Review ======
const potentialIssueSchema = z.object({
  issueId: looseString.optional(),
  category: looseString.optional(),
  severity: looseString.optional(), // "low"|"medium"|"high"
  accountId: looseString.optional(),
  whatWeSee: looseString.optional(),
  whyItMayBeAProblem: looseString.optional(),
  evidenceFromReport: looseStringArr.optional(),
  evidenceNeeded: looseStringArr.optional(),
  recommendedDisputePoints: looseStringArr.optional(),
  recommendedNextSteps: looseStringArr.optional(),
});

const categoriesSummarySchema = z.object({
  "Duplicate Reporting": looseNumber.optional(),
  "Identity Theft": looseNumber.optional(),
  "Wrong Balance/Status": looseNumber.optional(),
  "Post-Bankruptcy": looseNumber.optional(),
  "Debt Collection Red Flags": looseNumber.optional(),
  "Legal Date/Obsolescence": looseNumber.optional(),
  "Other": looseNumber.optional(),
});

const actionPlanStepSchema = z.object({
  step: looseNumber.optional(),
  action: looseString.optional(),
  why: looseString.optional(),
  inputsNeeded: looseStringArr.optional(),
});

const consumerLawReviewSchema = z.object({
  potentialIssues: z.array(potentialIssueSchema).optional(),
  categoriesSummary: categoriesSummarySchema.optional(),
  actionPlan: z.array(actionPlanStepSchema).optional(),
});

// ====== NEW SCHEMA: Final Report ======
const writeOffCheckSchema = z.object({
  writeOffAmountFound: looseNumber.optional(),
  writeOffEvidenceText: looseString.optional(),
  balanceVsWriteOffFinding: looseString.optional(),
});

const balanceHistoryItemSchema = z.object({
  month: looseString.optional(),
  balance: looseNumber.optional(),
});

const balanceHistoryCheckSchema = z.object({
  history: z.array(balanceHistoryItemSchema).optional(),
  finding: looseString.optional(),
  calc: looseString.optional(),
});

const finalReportAccountSchema = z.object({
  accountId: looseString.optional(),
  name: looseString.optional(),
  type: looseString.optional(),
  balance: looseNumber.optional(),
  status: looseString.optional(),
  accountNumberLast4: looseString.optional(),
  potentialViolation: looseString.optional(),
  writeOffCheck: writeOffCheckSchema.optional(),
  balanceHistoryCheck: balanceHistoryCheckSchema.optional(),
});

const finalReportFcraViolationSchema = z.object({
  issueId: looseString.optional(),
  accountId: looseString.optional(),
  category: looseString.optional(),
  summary: looseString.optional(),
  evidenceNeeded: looseStringArr.optional(),
});

const disputeLetterSchema = z.object({
  accountId: looseString.optional(),
  creditorOrCollector: looseString.optional(),
  accountNumberLast4: looseString.optional(),
  letterType: looseString.optional(), // "CRA"|"Furnisher/Collector"
  subject: looseString.optional(),
  body: looseString.optional(),
  // Legacy fields
  targetBureau: looseString.optional(),
  accountsToDispute: looseStringArr.optional(),
  legalCitations: looseStringArr.optional(),
  keyPoints: looseStringArr.optional(),
  fullText: looseString.optional(),
});

const finalReportSchema = z.object({
  accounts: z.array(finalReportAccountSchema).optional(),
  fcraViolations: z.array(finalReportFcraViolationSchema).optional(),
  disputeLetters: z.array(disputeLetterSchema).optional(),
});

// ====== Legacy Schemas for backwards compatibility ======
const issueFlagSchema = z.object({
  category: looseNumber.optional(),
  flagTypeName: looseString.optional(),
  accountsInvolved: looseString.optional(),
  whyFlagged: looseString.optional(),
  evidenceNeeded: looseString.optional(),
  priority: looseString.optional(),
});

const sixCategoryIssueFlagsSchema = z.object({
  category1_duplicateReporting: z.array(issueFlagSchema).optional(),
  category2_identityTheft: z.array(issueFlagSchema).optional(),
  category3_wrongBalanceStatus: z.array(issueFlagSchema).optional(),
  category4_postBankruptcyMisreporting: z.array(issueFlagSchema).optional(),
  category5_debtCollectionRedFlags: z.array(issueFlagSchema).optional(),
  category6_legalDateObsolescence: z.array(issueFlagSchema).optional(),
});

const actionItemSchema = z.object({
  action: looseString.optional(),
  priority: looseString.optional(),
  details: looseString.optional(),
  impactReason: looseString.optional(),
});

const consumerActionPlanSchema = z.object({
  next7Days: z.array(actionItemSchema).optional(),
  next30Days: z.array(actionItemSchema).optional(),
  next90Days: z.array(actionItemSchema).optional(),
  utilizationPaydownOrder: looseStringArr.optional(),
  autopayRecommendations: looseStringArr.optional(),
  avoidNewInquiries: z.boolean().optional(),
  disputesToFileFirst: looseStringArr.optional(),
  documentationChecklist: looseStringArr.optional(),
  questionsToAskConsumer: looseStringArr.optional(),
});

const executiveSummaryItemSchema = z.object({
  bullet: looseString.optional(),
});

const notDetectableSchema = z.object({
  item: looseString.optional(),
  explanation: looseString.optional(),
});

const fcraViolationSchema = z.object({
  violationTitle: looseString.optional(),
  severity: looseString.optional(),
  accountsInvolved: looseStringArr.optional(),
  legalBasis: looseString.optional(),
  statuteSection: looseString.optional(),
  explanation: looseString.optional(),
  suggestedAction: looseString.optional(),
  disputeLanguage: looseString.optional(),
  estimatedDamages: looseString.optional(),
});

const fdcpaViolationSchema = z.object({
  violationTitle: looseString.optional(),
  severity: looseString.optional(),
  collectorName: looseString.optional(),
  legalBasis: looseString.optional(),
  statuteSection: looseString.optional(),
  explanation: looseString.optional(),
  suggestedAction: looseString.optional(),
  disputeLanguage: looseString.optional(),
  estimatedDamages: looseString.optional(),
});

// ====== Main Analysis Result Schema ======
export const analysisResultSchema = z.object({
  // NEW SCHEMA: Report Summary
  reportSummary: reportSummarySchema.optional(),

  // NEW SCHEMA: Personal Info Mismatches
  personalInfoMismatches: z.array(personalInfoMismatchSchema).optional(),

  // NEW SCHEMA: Inquiries
  inquiries: z.array(inquirySchema).optional(),

  // NEW SCHEMA: Public Records
  publicRecords: z.array(publicRecordSchema).optional(),

  // NEW SCHEMA: Master Tradeline Table
  masterTradelineTable: z.array(masterTradelineSchema).optional(),

  // NEW SCHEMA: Credit Metrics (nested structure)
  creditMetrics: creditMetricsSchema.optional(),

  // NEW SCHEMA: Consumer Law Review
  consumerLawReview: consumerLawReviewSchema.optional(),

  // NEW SCHEMA: Final Report
  finalReport: finalReportSchema.optional(),

  // Top-level accounts array (for easy access)
  accounts: z.array(finalReportAccountSchema).optional(),

  // Top-level fcraViolations (for easy access)
  fcraViolations: z.array(finalReportFcraViolationSchema).or(z.array(fcraViolationSchema)).optional(),

  // Top-level disputeLetters (for easy access)
  disputeLetters: z.array(disputeLetterSchema).optional(),

  // Legacy: Credit Utilization (flat)
  creditUtilization: creditUtilizationMetricsSchema.optional(),

  // Legacy: Age of Credit (flat)
  ageOfCredit: ageOfCreditMetricsSchema.optional(),

  // Legacy: Credit Mix (flat)
  creditMix: creditMixMetricsSchema.optional(),

  // Legacy: Credit Health Diagnosis (flat)
  creditHealthDiagnosis: creditHealthDiagnosisSchema.optional(),

  // Legacy: Executive Summary
  executiveSummary: z.array(executiveSummaryItemSchema).optional(),

  // Legacy: 6-Category Issue Flags
  sixCategoryIssueFlags: sixCategoryIssueFlagsSchema.optional(),

  // Legacy: Consumer Action Plan
  consumerActionPlan: consumerActionPlanSchema.optional(),

  // Legacy: Not Detectable From Report
  notDetectableFromReport: z.array(notDetectableSchema).optional(),

  // Legacy: Account Analysis
  accountAnalysis: z.array(z.object({
    accountName: looseString.optional(),
    accountNumber: looseString.optional(),
    accountType: looseString.optional(),
    status: looseString.optional(),
    balance: looseString.optional(),
    dateOpened: looseString.optional(),
    dateOfFirstDelinquency: looseString.optional(),
    originalCreditor: looseString.optional(),
    comments: looseString.optional(),
    hasViolations: z.boolean().optional(),
  })).optional(),

  // Legacy: FDCPA Violations
  fdcpaViolations: z.array(fdcpaViolationSchema).optional(),

  // Legal Summary
  legalSummary: z.object({
    totalFcraViolations: looseNumber.optional(),
    totalFdcpaViolations: looseNumber.optional(),
    totalViolations: looseNumber.optional(),
    highSeverityCount: looseNumber.optional(),
    mediumSeverityCount: looseNumber.optional(),
    lowSeverityCount: looseNumber.optional(),
    attorneyReferralRecommended: z.boolean().or(z.string().transform(s => s === 'true')).optional(),
    estimatedDamagesPotential: looseString.optional(),
    estimatedDamagesRange: looseString.optional(),
    statutoryDamagesMin: looseNumber.optional(),
    statutoryDamagesMax: looseNumber.optional(),
  }).optional(),

  // Summary
  summary: looseString.optional(),

  // Legacy: Recommended Next Steps
  recommendedNextSteps: z.array(z.object({
    priority: looseNumber.optional(),
    action: looseString.optional(),
    deadline: looseString.optional(),
    details: looseString.optional(),
  })).optional(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
