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

// ====== STEP 1: Per-Bureau Tradeline Schema ======
const perBureauTradelineSchema = z.object({
  furnisher: looseString.optional(),
  accountType: looseString.optional(), // revolving/installment/mortgage/student/collection/other
  status: looseString.optional(), // open/closed/collection/charged-off/paid/settled/in bankruptcy
  openDate: looseString.optional(),
  lastReportedDate: looseString.optional(),
  creditLimit: looseString.optional(),
  highBalance: looseString.optional(),
  currentBalance: looseString.optional(),
  pastDueAmount: looseString.optional(),
  monthlyPayment: looseString.optional(),
  paymentHistory: looseString.optional(),
  remarks: looseString.optional(),
  accountNumberLast4: looseString.optional(),
  originalCreditor: looseString.optional(),
  dateOfFirstDelinquency: looseString.optional(),
});

// ====== STEP 2: Master Grouped Tradeline Schema ======
const masterTradelineSchema = z.object({
  groupId: looseString.optional(),
  furnisherName: looseString.optional(),
  accountType: looseString.optional(),
  openDate: looseString.optional(),
  accountNumberLast4: looseString.optional(),
  originalAmount: looseString.optional(),
  remarks: looseString.optional(),
  perBureauData: z.object({
    equifax: perBureauTradelineSchema.optional(),
    experian: perBureauTradelineSchema.optional(),
    transunion: perBureauTradelineSchema.optional(),
  }).optional(),
  discrepanciesNoted: looseStringArr.optional(),
});

// ====== STEP 3: Credit Utilization Schema ======
const utilizationAccountSchema = z.object({
  accountName: looseString.optional(),
  balance: looseNumber.optional(),
  limit: looseNumber.optional(),
  utilization: looseNumber.optional(),
  utilizationPercent: looseString.optional(),
  flagged: z.boolean().optional(),
  flagReason: looseString.optional(), // >30%, >50%, >90%
  limitMissing: z.boolean().optional(),
});

const creditUtilizationSchema = z.object({
  totalRevolvingBalance: looseNumber.optional(),
  totalRevolvingLimit: looseNumber.optional(),
  totalUtilization: looseNumber.optional(),
  totalUtilizationPercent: looseString.optional(),
  calculationShown: looseString.optional(),
  perCardUtilization: z.array(utilizationAccountSchema).optional(),
  accountsMissingLimit: looseStringArr.optional(),
  flaggedThresholds: z.object({
    above30Percent: looseStringArr.optional(),
    above50Percent: looseStringArr.optional(),
    above90Percent: looseStringArr.optional(),
  }).optional(),
  paydownOrder: looseStringArr.optional(),
});

// ====== STEP 4: Age of Credit Schema ======
const ageOfCreditSchema = z.object({
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

// ====== STEP 5: Credit Mix Schema ======
const creditMixSchema = z.object({
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

// ====== STEP 6: Credit Health Diagnosis Schema ======
const creditHealthDiagnosisSchema = z.object({
  likelyTopSuppressors: looseStringArr.optional(),
  highUtilizationIssues: looseStringArr.optional(),
  derogatoryIssues: looseStringArr.optional(),
  thinFileIndicators: looseStringArr.optional(),
  recentInquiriesIssues: looseStringArr.optional(),
  collectionInconsistencies: looseStringArr.optional(),
});

// ====== STEP 7: 6-Category Issue Flags Schema ======
const issueFlagSchema = z.object({
  category: looseNumber.optional(), // 1-6
  flagTypeName: looseString.optional(),
  accountsInvolved: looseString.optional(), // furnisher + last4
  whyFlagged: looseString.optional(), // ≤25 words from report
  evidenceNeeded: looseString.optional(), // what would confirm/refute
  priority: looseString.optional(), // High/Med/Low
});

const sixCategoryIssueFlagsSchema = z.object({
  category1_duplicateReporting: z.array(issueFlagSchema).optional(),
  category2_identityTheft: z.array(issueFlagSchema).optional(),
  category3_wrongBalanceStatus: z.array(issueFlagSchema).optional(),
  category4_postBankruptcyMisreporting: z.array(issueFlagSchema).optional(),
  category5_debtCollectionRedFlags: z.array(issueFlagSchema).optional(),
  category6_legalDateObsolescence: z.array(issueFlagSchema).optional(),
});

// ====== STEP 8: Consumer Action Plan Schema ======
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

// ====== Personal Info Mismatches ======
const personalInfoMismatchSchema = z.object({
  type: looseString.optional(), // names/addresses/employers
  equifaxValue: looseString.optional(),
  experianValue: looseString.optional(),
  transunionValue: looseString.optional(),
  concern: looseString.optional(),
});

// ====== Inquiry Schema ======
const inquirySchema = z.object({
  date: looseString.optional(),
  requesterName: looseString.optional(),
  type: looseString.optional(), // hard/soft
  bureau: looseString.optional(),
});

// ====== Executive Summary Item ======
const executiveSummaryItemSchema = z.object({
  bullet: looseString.optional(),
});

// ====== Not Detectable From Report ======
const notDetectableSchema = z.object({
  item: looseString.optional(),
  explanation: looseString.optional(),
});

// Legacy schemas for backwards compatibility
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

const debtBuyerIssueSchema = z.object({
  issueTitle: looseString.optional(),
  severity: looseString.optional(),
  accountName: looseString.optional(),
  issueType: looseString.optional(),
  explanation: looseString.optional(),
  requiredDocumentation: looseStringArr.optional(),
  suggestedAction: looseString.optional(),
});

const disputeLetterSchema = z.object({
  targetBureau: looseString.optional(),
  letterType: looseString.optional(),
  accountsToDispute: looseStringArr.optional(),
  legalCitations: looseStringArr.optional(),
  keyPoints: looseStringArr.optional(),
  fullText: looseString.optional(),
});

const stateLawAnalysisSchema = z.object({
  state: looseString.optional(),
  lawName: looseString.optional(),
  statuteCode: looseString.optional(),
  additionalProtections: looseStringArr.optional(),
  applicableViolations: looseStringArr.optional(),
});

// ====== Main Analysis Result Schema ======
export const analysisResultSchema = z.object({
  // Executive Summary (10 bullets)
  executiveSummary: z.array(executiveSummaryItemSchema).optional(),

  // Report Summary (legacy + new)
  reportSummary: z.object({
    reportDate: looseString.optional(),
    consumerName: looseString.optional(),
    totalAccountsAnalyzed: looseNumber.optional(),
    fileSource: looseString.optional(),
    consumerState: looseString.optional(),
    bureausAnalyzed: looseStringArr.optional(),
  }).optional(),

  // Personal Info Mismatches
  personalInfoMismatches: z.array(personalInfoMismatchSchema).optional(),

  // Inquiries
  inquiries: z.array(inquirySchema).optional(),

  // Master Grouped Tradelines Table
  masterTradelineTable: z.array(masterTradelineSchema).optional(),

  // Credit Utilization (Step 3)
  creditUtilization: creditUtilizationSchema.optional(),

  // Age of Credit (Step 4)
  ageOfCredit: ageOfCreditSchema.optional(),

  // Credit Mix (Step 5)
  creditMix: creditMixSchema.optional(),

  // Credit Health Diagnosis (Step 6)
  creditHealthDiagnosis: creditHealthDiagnosisSchema.optional(),

  // 6-Category Issue Flags (Step 7)
  sixCategoryIssueFlags: sixCategoryIssueFlagsSchema.optional(),

  // Consumer Action Plan (Step 8)
  consumerActionPlan: consumerActionPlanSchema.optional(),

  // Not Detectable From Credit Report
  notDetectableFromReport: z.array(notDetectableSchema).optional(),

  // Legacy Account Analysis (backwards compatibility)
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

  // Legacy: FCRA Violations
  fcraViolations: z.array(fcraViolationSchema).optional(),

  // Legacy: FDCPA Violations
  fdcpaViolations: z.array(fdcpaViolationSchema).optional(),

  // Legacy: Debt Buyer Issues
  debtBuyerIssues: z.array(debtBuyerIssueSchema).optional(),

  // Legacy: Priority Violations
  priorityViolations: z.object({
    duplicateAccounts: z.array(z.object({
      originalCreditor: looseString.optional(),
      collectionAgency: looseString.optional(),
      accountNumber: looseString.optional(),
      originalBalance: looseString.optional(),
      collectionBalance: looseString.optional(),
      explanation: looseString.optional(),
    })).optional(),
    identityTheftAccounts: z.array(z.object({
      accountName: looseString.optional(),
      accountNumber: looseString.optional(),
      reason: looseString.optional(),
      dateOpened: looseString.optional(),
    })).optional(),
    wrongBalanceAccounts: z.array(z.object({
      accountName: looseString.optional(),
      reportedBalance: looseString.optional(),
      shouldBe: looseString.optional(),
      status: looseString.optional(),
      explanation: looseString.optional(),
    })).optional(),
    postBankruptcyViolations: z.array(z.object({
      accountName: looseString.optional(),
      reportedBalance: looseString.optional(),
      reportedPayment: looseString.optional(),
      reportedPastDue: looseString.optional(),
      bankruptcyDischargeDate: looseString.optional(),
      explanation: looseString.optional(),
    })).optional(),
    cancelledDebt1099C: z.array(z.object({
      accountName: looseString.optional(),
      reportedBalance: looseString.optional(),
      chargeOffDate: looseString.optional(),
      explanation: looseString.optional(),
    })).optional(),
    tcpaViolations: z.array(z.object({
      collectorName: looseString.optional(),
      violationType: looseString.optional(),
      evidence: looseString.optional(),
      estimatedCalls: looseNumber.optional(),
    })).optional(),
  }).optional(),

  // Legacy: Suggested Dispute Letters
  suggestedDisputeLetters: z.array(disputeLetterSchema).optional(),

  // Legacy: State Law Analysis
  stateLawAnalysis: stateLawAnalysisSchema.optional(),

  // Legacy: Statute of Limitations Analysis
  statuteOfLimitationsAnalysis: z.object({
    state: looseString.optional(),
    creditCardSOL: looseString.optional(),
    writtenContractSOL: looseString.optional(),
    accountsNearingSOL: looseStringArr.optional(),
    accountsPastSOL: looseStringArr.optional(),
    warnings: looseStringArr.optional(),
  }).optional(),

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
