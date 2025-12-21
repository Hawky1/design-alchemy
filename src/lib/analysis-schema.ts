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

// FCRA Violation Schema
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

// FDCPA Violation Schema
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

// Debt Buyer Issue Schema
const debtBuyerIssueSchema = z.object({
  issueTitle: looseString.optional(),
  severity: looseString.optional(),
  accountName: looseString.optional(),
  issueType: looseString.optional(),
  explanation: looseString.optional(),
  requiredDocumentation: looseStringArr.optional(),
  suggestedAction: looseString.optional(),
});

// Dispute Letter Schema
const disputeLetterSchema = z.object({
  targetBureau: looseString.optional(),
  letterType: looseString.optional(),
  accountsToDispute: looseStringArr.optional(),
  legalCitations: looseStringArr.optional(),
  keyPoints: looseStringArr.optional(),
  fullText: looseString.optional(),
});

// State Law Analysis Schema
const stateLawAnalysisSchema = z.object({
  state: looseString.optional(),
  lawName: looseString.optional(),
  statuteCode: looseString.optional(),
  additionalProtections: looseStringArr.optional(),
  applicableViolations: looseStringArr.optional(),
});

export const analysisResultSchema = z.object({
  reportSummary: z.object({
    reportDate: looseString.optional(),
    consumerName: looseString.optional(),
    totalAccountsAnalyzed: looseNumber.optional(),
    fileSource: looseString.optional(),
    consumerState: looseString.optional(),
  }).optional(),

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

  // FCRA Violations (credit reporting issues)
  fcraViolations: z.array(fcraViolationSchema).optional(),

  // FDCPA Violations (debt collection issues)
  fdcpaViolations: z.array(fdcpaViolationSchema).optional(),

  // Debt Buyer Specific Issues
  debtBuyerIssues: z.array(debtBuyerIssueSchema).optional(),

  // Generated Dispute Letters
  suggestedDisputeLetters: z.array(disputeLetterSchema).optional(),

  // State Law Analysis
  stateLawAnalysis: stateLawAnalysisSchema.optional(),

  // Statute of Limitations Analysis
  statuteOfLimitationsAnalysis: z.object({
    state: looseString.optional(),
    creditCardSOL: looseString.optional(),
    writtenContractSOL: looseString.optional(),
    accountsNearingSOL: looseStringArr.optional(),
    accountsPastSOL: looseStringArr.optional(),
    warnings: looseStringArr.optional(),
  }).optional(),

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

  summary: looseString.optional(),
  
  // Recommended Next Steps
  recommendedNextSteps: z.array(z.object({
    priority: looseNumber.optional(),
    action: looseString.optional(),
    deadline: looseString.optional(),
    details: looseString.optional(),
  })).optional(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
