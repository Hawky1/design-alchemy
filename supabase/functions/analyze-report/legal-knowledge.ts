// Comprehensive FCRA/FDCPA Legal Knowledge Base
// Extracted from official statutes and consumer protection resources

export const FDCPA_VIOLATIONS = {
  "1692a": {
    section: "15 U.S.C. § 1692a",
    title: "Definitions",
    description: "Establishes definitions for debt collector, consumer, debt, etc.",
    key_points: [
      "Debt collector includes any person who regularly collects debts owed to another",
      "Consumer means any natural person obligated to pay any debt",
      "Debt means any obligation to pay money arising from consumer transactions"
    ]
  },
  "1692b": {
    section: "15 U.S.C. § 1692b",
    title: "Acquisition of Location Information",
    description: "Prohibits improper third-party contacts when locating consumers",
    violations: [
      "Contacting third parties more than once about a consumer's location",
      "Communicating that consumer owes a debt to third parties",
      "Using language or symbols on envelopes indicating debt collection",
      "Contacting third parties by postcard",
      "Failing to identify themselves as confirming location information",
      "Contacting third party after being told consumer has an attorney"
    ]
  },
  "1692c": {
    section: "15 U.S.C. § 1692c",
    title: "Communication in Connection with Debt Collection",
    description: "Regulates when and how debt collectors can communicate",
    violations: [
      "Contacting consumer at inconvenient times (before 8am or after 9pm)",
      "Contacting consumer at work when told it's not allowed",
      "Contacting consumer directly when represented by attorney",
      "Communicating with third parties about the debt",
      "Continuing contact after written cease request"
    ],
    cease_rights: "Consumer has right to demand debt collector cease communication in writing"
  },
  "1692d": {
    section: "15 U.S.C. § 1692d",
    title: "Harassment or Abuse",
    description: "Prohibits conduct meant to harass, oppress, or abuse",
    violations: [
      "Use or threat of violence or criminal means",
      "Obscene or profane language",
      "Publishing 'deadbeat' lists",
      "Calling repeatedly to annoy or harass",
      "Calling without meaningful disclosure of caller's identity"
    ]
  },
  "1692e": {
    section: "15 U.S.C. § 1692e",
    title: "False or Misleading Representations",
    description: "Prohibits deceptive practices in debt collection",
    violations: [
      "Falsely representing the character, amount, or legal status of debt",
      "Falsely representing that individual is an attorney",
      "Representing debt as secured when it is not",
      "Threatening legal action that cannot legally be taken",
      "Communicating false credit information",
      "Using false name or business name",
      "Falsely representing that documents are legal forms",
      "Falsely representing debt will be sold or transferred",
      "Implying consumer committed a crime",
      "Misrepresenting amount of debt",
      "Falsely claiming to be government agency",
      "Threatening arrest or imprisonment",
      "Claiming to be credit reporting agency when not"
    ]
  },
  "1692f": {
    section: "15 U.S.C. § 1692f",
    title: "Unfair Practices",
    description: "Prohibits unfair or unconscionable means of collection",
    violations: [
      "Collecting amounts not authorized by agreement or law",
      "Accepting postdated checks for deposit prior to date",
      "Soliciting postdated checks for purpose of threatening prosecution",
      "Causing charges to be made by concealing purpose of communication",
      "Threatening repossession when not intended or lawful",
      "Using deceptive means to collect",
      "Depositing postdated check before stated date"
    ]
  },
  "1692g": {
    section: "15 U.S.C. § 1692g",
    title: "Validation of Debts",
    description: "Requires debt validation within 5 days of initial communication",
    requirements: [
      "Amount of debt must be stated",
      "Name of creditor must be provided",
      "Statement that debt will be assumed valid if not disputed within 30 days",
      "Statement that verification will be provided if disputed",
      "Notice that consumer can request name of original creditor"
    ],
    violations: [
      "Failing to send validation notice within 5 days",
      "Continuing collection during 30-day dispute period",
      "Failing to verify debt when disputed",
      "Failing to provide name of original creditor upon request",
      "Overshadowing or contradicting validation rights"
    ]
  },
  "1692j": {
    section: "15 U.S.C. § 1692j",
    title: "Furnishing Deceptive Forms",
    description: "Prohibits designing or providing deceptive collection forms",
    violations: [
      "Designing forms that falsely appear to be from government",
      "Creating forms that imply attorneys involved when they are not",
      "Using forms that misrepresent legal authority"
    ]
  }
};

export const FCRA_VIOLATIONS = {
  "1681c": {
    section: "15 U.S.C. § 1681c",
    title: "Requirements Relating to Information in Consumer Reports",
    description: "Time limits for reporting negative information",
    rules: [
      "Most negative information must be removed after 7 years",
      "Bankruptcy (Chapter 7 & 11) removed after 10 years",
      "Paid tax liens removed after 7 years from payment date",
      "Civil suits and judgments removed after 7 years or statute of limitations",
      "Collection accounts removed 7 years from date of first delinquency"
    ],
    violations: [
      "Reporting obsolete information (7-year rule)",
      "Reporting bankruptcy older than 10 years",
      "Re-aging accounts to extend reporting period",
      "Failing to remove accounts after 7-year period"
    ]
  },
  "1681e": {
    section: "15 U.S.C. § 1681e(b)",
    title: "Maximum Possible Accuracy",
    description: "CRAs must follow reasonable procedures for maximum accuracy",
    violations: [
      "Reporting inaccurate account balances",
      "Mixed file errors (reporting another person's accounts)",
      "Incorrect personal information (SSN, addresses, employment)",
      "Duplicate account reporting",
      "Incorrect payment history",
      "Wrong account status (open vs closed)",
      "Incorrect date of first delinquency"
    ]
  },
  "1681i": {
    section: "15 U.S.C. § 1681i",
    title: "Procedure in Case of Disputed Accuracy",
    description: "Requires investigation of disputed items within 30 days",
    consumer_rights: [
      "Free reinvestigation of disputed items",
      "Completion within 30 days (45 with additional info)",
      "Written results and free credit report if changes made",
      "Right to add consumer statement to file"
    ],
    violations: [
      "Failing to investigate dispute within 30 days",
      "Conducting only cursory or superficial investigation",
      "Not forwarding all relevant information to furnisher",
      "Failing to modify or delete inaccurate information",
      "Not providing written results of investigation"
    ]
  },
  "1681s-2": {
    section: "15 U.S.C. § 1681s-2",
    title: "Responsibilities of Furnishers of Information",
    description: "Duties of those who provide information to credit bureaus",
    subsections: {
      "a": {
        title: "Duty to Provide Accurate Information",
        requirements: [
          "Cannot furnish information known to be inaccurate",
          "Must correct and update previously furnished information",
          "Must report disputes to CRAs",
          "Must report accounts as disputed if consumer disputes"
        ]
      },
      "b": {
        title: "Duties Upon Notice of Dispute",
        requirements: [
          "Conduct investigation with respect to disputed information",
          "Review all relevant information provided by CRA",
          "Report results to CRA",
          "Modify, delete, or permanently block reporting if inaccurate"
        ]
      }
    },
    violations: [
      "Reporting information known to be inaccurate",
      "Failing to correct inaccurate information after notification",
      "Not reporting accounts as disputed",
      "Ignoring direct disputes from consumers",
      "Failing to conduct reasonable investigation"
    ]
  }
};

export const DEBT_BUYER_VIOLATIONS = {
  chain_of_title: {
    title: "Chain of Title / Assignment Issues",
    description: "Debt buyers must prove valid ownership through documented chain of assignment",
    violations: [
      "Cannot provide complete chain of title documentation",
      "Missing assignment agreements between original creditor and debt buyer",
      "Assignments lack proper notarization or execution",
      "Unable to match account to specific portfolio purchase",
      "Discrepancies in account numbers across assignments"
    ],
    legal_basis: "Debt buyer bears burden of proving ownership - see FTC Debt Buyer Report",
    defense_strategies: [
      "Demand complete chain of title documentation",
      "Request bill of sale and assignment agreements",
      "Challenge any gaps in documentation chain",
      "Request proof account was included in specific portfolio"
    ]
  },
  validation_requirements: {
    title: "Validation and Documentation Requirements",
    description: "Debt buyers must be able to validate debts with original documentation",
    violations: [
      "Unable to provide original signed credit agreement",
      "Cannot produce original account statements",
      "Missing terms and conditions from original creditor",
      "Unable to provide calculation of total amount owed",
      "No documentation of interest rate or fees assessed"
    ]
  },
  statute_of_limitations: {
    title: "Statute of Limitations Violations",
    description: "Collecting on time-barred debt or re-aging to extend SOL",
    violations: [
      "Attempting to collect debt past statute of limitations",
      "Making payment request that would restart SOL clock",
      "Filing lawsuit on time-barred debt",
      "Misrepresenting SOL status",
      "Not disclosing that debt is time-barred"
    ],
    note: "SOL varies by state - typically 3-6 years for credit card debt"
  }
};

export const STATE_MINI_FDCPA_LAWS = {
  california: {
    name: "Rosenthal Fair Debt Collection Practices Act",
    code: "Cal. Civ. Code §§ 1788-1788.33",
    key_differences: [
      "Applies to original creditors, not just third-party collectors",
      "Broader definition of 'debt collector'",
      "Additional penalties available"
    ]
  },
  texas: {
    name: "Texas Debt Collection Act",
    code: "Tex. Fin. Code §§ 392.001-392.404",
    key_differences: [
      "Applies to creditors and debt collectors",
      "Prohibits deceptive trade practices",
      "Additional state-level remedies"
    ]
  },
  new_york: {
    name: "New York City Consumer Protection Law",
    code: "NYC Admin. Code § 20-493",
    key_differences: [
      "Requires licensing for debt collectors",
      "Additional notice requirements",
      "Enhanced penalties for violations"
    ]
  },
  florida: {
    name: "Florida Consumer Collection Practices Act",
    code: "Fla. Stat. §§ 559.55-559.785",
    key_differences: [
      "Licensing requirement for collection agencies",
      "Specific bonding requirements",
      "State-level enforcement mechanisms"
    ]
  },
  massachusetts: {
    name: "Massachusetts Debt Collection Regulations",
    code: "940 CMR 7.00",
    key_differences: [
      "More restrictive than federal FDCPA",
      "Prohibits collection calls to workplace",
      "Enhanced disclosure requirements"
    ]
  }
};

export const DISPUTE_LETTER_TEMPLATES = {
  general_dispute: {
    title: "General FCRA Dispute Letter",
    sections: [
      "I am writing to dispute the following information in my credit file",
      "The item(s) I am disputing are: [ACCOUNT/ITEM DESCRIPTION]",
      "This item is [inaccurate/incomplete] because: [SPECIFIC REASON]",
      "I am requesting that the item be [removed/corrected] to show: [CORRECT INFORMATION]",
      "Enclosed are copies of [supporting documents] supporting my position"
    ],
    legal_citation: "Per my rights under FCRA 15 U.S.C. § 1681i, I request you investigate this dispute within 30 days and provide written results."
  },
  debt_validation: {
    title: "FDCPA Debt Validation Request",
    sections: [
      "Pursuant to my rights under 15 U.S.C. § 1692g, I am requesting validation of the alleged debt",
      "Please provide: Complete payment history from original creditor",
      "Please provide: Copy of original signed credit agreement",
      "Please provide: Complete chain of title documentation",
      "Please provide: Proof that you are licensed to collect in my state",
      "Please cease all collection activity until validation is provided"
    ],
    legal_citation: "Under FDCPA § 1692g, you must cease collection until the debt is validated."
  },
  obsolete_info: {
    title: "Obsolete Information Removal Request",
    sections: [
      "I am disputing the following item which violates FCRA reporting time limits",
      "The account [ACCOUNT NAME] has a date of first delinquency of [DATE]",
      "This exceeds the 7-year reporting period mandated by 15 U.S.C. § 1681c",
      "I demand immediate removal of this obsolete information"
    ],
    legal_citation: "Pursuant to 15 U.S.C. § 1681c, this item must be removed as it exceeds the maximum allowable reporting period."
  },
  re_aging_dispute: {
    title: "Re-Aging/DOFD Manipulation Dispute",
    sections: [
      "I am disputing the Date of First Delinquency (DOFD) reported for the following account",
      "The current reported DOFD of [REPORTED DATE] is inaccurate",
      "According to my records, the true DOFD was [ACTUAL DATE]",
      "Re-aging accounts to extend the reporting period violates FCRA",
      "I demand correction of the DOFD and removal if 7 years has passed from true DOFD"
    ],
    legal_citation: "Re-aging is a violation of 15 U.S.C. § 1681c and may constitute fraud under state law."
  },
  duplicate_reporting: {
    title: "Duplicate/Double Jeopardy Reporting Dispute",
    sections: [
      "The same debt is being reported multiple times on my credit report",
      "Original account: [ORIGINAL CREDITOR/ACCOUNT]",
      "Duplicate account(s): [COLLECTION AGENCY/DEBT BUYER]",
      "This 'double jeopardy' reporting violates FCRA maximum accuracy requirements",
      "I demand removal of duplicate entries immediately"
    ],
    legal_citation: "Duplicate reporting violates 15 U.S.C. § 1681e(b) requiring maximum possible accuracy."
  }
};

// Enhanced system prompt incorporating all legal knowledge
export const ENHANCED_SYSTEM_PROMPT = `You are an expert legal analyst specializing in consumer credit law, specifically the Fair Credit Reporting Act (FCRA) and Fair Debt Collection Practices Act (FDCPA). You have comprehensive knowledge of federal and state consumer protection laws.

YOUR EXPERTISE INCLUDES:

**FAIR DEBT COLLECTION PRACTICES ACT (15 U.S.C. § 1692)**
- § 1692b: Location information violations (third-party contacts)
- § 1692c: Communication violations (time, place, manner)
- § 1692d: Harassment or abuse (threatening, profane, repeated calls)
- § 1692e: False/misleading representations (16 specific prohibitions)
- § 1692f: Unfair practices (unauthorized fees, threats)
- § 1692g: Debt validation violations (5-day notice, 30-day dispute rights)
- § 1692j: Deceptive forms

**FAIR CREDIT REPORTING ACT (15 U.S.C. § 1681)**
- § 1681c: Obsolete information (7-year rule, 10-year bankruptcies)
- § 1681e(b): Maximum possible accuracy requirement
- § 1681i: Dispute investigation requirements (30-day investigation)
- § 1681s-2: Furnisher responsibilities (accuracy, dispute handling)

**DEBT BUYER SPECIFIC VIOLATIONS**
- Chain of title deficiencies (missing assignments, gaps in ownership)
- Lack of original documentation (signed agreements, statements)
- Statute of limitations issues (time-barred debts)
- Re-aging violations (manipulating DOFD)

**KEY VIOLATION PATTERNS TO DETECT**

1. DOUBLE JEOPARDY REPORTING
   - Same debt reported by original creditor AND collection agency
   - Multiple collection agencies reporting same underlying debt
   - Violation: 15 U.S.C. § 1681e(b) - maximum accuracy

2. OBSOLETE INFORMATION
   - Negative items older than 7 years from DOFD
   - Bankruptcies older than 10 years
   - Violation: 15 U.S.C. § 1681c

3. RE-AGING/DOFD MANIPULATION
   - Date of first delinquency incorrectly reported
   - Account age restarted after sale to debt buyer
   - Violation: 15 U.S.C. § 1681c, potential fraud

4. INACCURATE BALANCES
   - Balance doesn't match original creditor records
   - Unauthorized fees or interest added
   - Wrong balance on closed accounts
   - Violation: 15 U.S.C. § 1681e(b), § 1681s-2(a)

5. MIXED FILE ERRORS
   - Accounts belonging to another person
   - Wrong SSN or personal information
   - Violation: 15 U.S.C. § 1681e(b)

6. UNAUTHORIZED INQUIRIES
   - Hard inquiries without permissible purpose
   - Violation: 15 U.S.C. § 1681b

7. FAILURE TO REPORT DISPUTE STATUS
   - Account not marked as disputed after consumer dispute
   - Violation: 15 U.S.C. § 1681s-2(a)(3)

8. COLLECTION ACCOUNT DEFICIENCIES
   - Missing original creditor information
   - No validation provided
   - Collecting on disputed debt
   - Violation: 15 U.S.C. § 1692g

**FOR EACH VIOLATION FOUND, PROVIDE:**
1. Specific statute citation (e.g., "15 U.S.C. § 1681e(b)")
2. Clear explanation of how the reported information violates the law
3. Step-by-step actionable dispute instructions
4. Recommended dispute letter language
5. Estimated damages potential

**DAMAGE CALCULATIONS:**
- FCRA: $100-$1,000 per violation (statutory), uncapped actual damages
- FDCPA: Up to $1,000 per lawsuit, plus actual damages
- Willful violations: Punitive damages available
- Attorney fees recoverable in successful cases

CRITICAL INSTRUCTIONS:
1. Be thorough - analyze EVERY account for potential violations
2. Look for patterns that indicate systematic violations
3. Always cite specific statute sections
4. Provide actionable next steps, not just observations
5. Recommend attorney consultation for significant violations
6. Consider state mini-FDCPA laws that may provide additional protections

Return your analysis in the specified JSON format with comprehensive violation details.`;
