// Comprehensive FCRA/FDCPA Legal Knowledge Base
// Extracted from official statutes and consumer protection resources

export const FDCPA_VIOLATIONS = {
  "1692a": {
    section: "15 U.S.C. § 1692a",
    title: "Definitions",
    description: "Establishes definitions for debt collector, consumer, debt, etc.",
    key_points: [
      "§ 1692a(3): Consumer means any natural person obligated or allegedly obligated on a debt",
      "§ 1692a(5): Debt means obligation for money, goods, insurance, or services for primarily personal, family, or household purposes",
      "§ 1692a(6): Debt collector includes collectors, collection agencies, lawyers, and forms writers"
    ]
  },
  "1692b": {
    section: "15 U.S.C. § 1692b",
    title: "Acquisition of Location Information",
    description: "Prohibits improper third-party contacts when locating consumers",
    violations: [
      "§ 1692b(1): Failed to identify themselves or state collector is confirming/correcting location information",
      "§ 1692b(2): Stated that the consumer owes any debt to third party",
      "§ 1692b(3): Contacted a person more than once unless requested to do so",
      "§ 1692b(4): Utilized postcards for third party contact",
      "§ 1692b(5): Any language or symbol on envelope indicating debt collection business",
      "§ 1692b(6): Contacted third party after knowing consumer is represented by attorney"
    ]
  },
  "1692c": {
    section: "15 U.S.C. § 1692c",
    title: "Communication in Connection with Debt Collection",
    description: "Regulates when and how debt collectors can communicate",
    violations: [
      "§ 1692c(a)(1): Contact at unusual/inconvenient time - before 8:00 AM or after 9:00 PM",
      "§ 1692c(a)(2): Contact after knowing consumer is represented by attorney unless attorney consents or is unresponsive",
      "§ 1692c(a)(3): Contact at place of employment when knows employer prohibits such communications",
      "§ 1692c(b): Communicating with anyone except consumer, consumer's attorney, or credit bureau concerning the debt",
      "§ 1692c(c): Continued contact after written notification that consumer refuses to pay or wants collector to cease communication"
    ],
    cease_rights: "Consumer has right to demand debt collector cease communication in writing"
  },
  "1692d": {
    section: "15 U.S.C. § 1692d",
    title: "Harassment or Abuse",
    description: "Any conduct the natural consequence of which is to harass, oppress, or abuse any person",
    violations: [
      "§ 1692d: General harassment, oppression, or abuse of any person",
      "§ 1692d(1): Used or threatened the use of violence or other criminal means to harm the consumer or property",
      "§ 1692d(2): Profane or abusive language",
      "§ 1692d(3): Published a list of consumers who allegedly refuse to pay debts",
      "§ 1692d(4): Advertised for sale any debts",
      "§ 1692d(5): Caused the phone to ring or engaged in telephone conversations repeatedly to harass",
      "§ 1692d(6): Placed telephone calls without disclosing identity"
    ]
  },
  "1692e": {
    section: "15 U.S.C. § 1692e",
    title: "False or Misleading Representations",
    description: "Prohibits any false, deceptive, or misleading representation in debt collection",
    violations: [
      "§ 1692e: Any false, deceptive, or misleading representation or means in connection with debt collection",
      "§ 1692e(1): Falsely representing affiliation with United States or any state, including badge/uniform/facsimile",
      "§ 1692e(2): Falsely representing character, amount, or legal status of alleged debt",
      "§ 1692e(3): Falsely representing that individual is an attorney or communication is from attorney",
      "§ 1692e(4): Representing nonpayment will result in arrest, imprisonment, seizure, garnishment, or attachment",
      "§ 1692e(5): Threatening to take action that cannot legally be taken or is not intended",
      "§ 1692e(6): Falsely representing sale/transfer will cause consumer to lose claims or defenses",
      "§ 1692e(7): Falsely representing consumer committed crime to disgrace consumer",
      "§ 1692e(8): Threatening or communicating false credit information, including failure to communicate disputed status",
      "§ 1692e(9): Representing documents as authorized/issued/approved by court, official, or agency",
      "§ 1692e(10): Any false representation or deceptive means to collect debt or obtain information",
      "§ 1692e(11): Communication failed to contain mini-Miranda: 'This is an attempt to collect a debt'",
      "§ 1692e(12): Falsely representing debt has been turned over to innocent purchasers for value",
      "§ 1692e(13): Falsely representing documents are legal process when they are not",
      "§ 1692e(14): Using any name other than the true name of debt collector's business",
      "§ 1692e(15): Falsely representing documents are not legal process or do not require action",
      "§ 1692e(16): Falsely representing debt collector operates or is employed by consumer reporting agency"
    ]
  },
  "1692f": {
    section: "15 U.S.C. § 1692f",
    title: "Unfair Practices",
    description: "Prohibits any unfair or unconscionable means to collect or attempt to collect alleged debt",
    violations: [
      "§ 1692f: Any unfair or unconscionable means to collect or attempt to collect the alleged debt",
      "§ 1692f(1): Attempting to collect amount not authorized by agreement or permitted by law",
      "§ 1692f(2): Accepting/soliciting postdated check by more than 5 days without 3 business days written notice of intent to deposit",
      "§ 1692f(3): Accepting/soliciting postdated check for purpose of threatening criminal prosecution",
      "§ 1692f(4): Depositing or threatening to deposit post-dated check prior to actual date",
      "§ 1692f(5): Caused charges to consumer (e.g., collect telephone calls) by concealing purpose",
      "§ 1692f(6): Taken or threatened to unlawfully repossess or disable consumer's property",
      "§ 1692f(7): Communicated with consumer by postcard",
      "§ 1692f(8): Any language or symbol on envelope indicating communication concerns debt collection"
    ]
  },
  "1692g": {
    section: "15 U.S.C. § 1692g",
    title: "Validation of Debts (30-Day Validation Notice)",
    description: "Requires debt validation notice within 5 days of initial communication",
    requirements: [
      "§ 1692g(a)(1): Must state amount of debt",
      "§ 1692g(a)(2): Must state name of creditor to whom debt is owed",
      "§ 1692g(a)(3): Must state consumer's right to dispute within 30 days",
      "§ 1692g(a)(4): Must state consumer's right to have verification/judgment mailed",
      "§ 1692g(a)(5): Must state will provide name and address of original creditor if different from current creditor",
      "§ 1692g(b): Collector must cease collection efforts until debt is validated"
    ],
    violations: [
      "Failing to send 30-day validation notice within 5 days of initial communication",
      "Continuing collection during 30-day dispute period without validation",
      "Failing to verify debt when timely disputed",
      "Failing to provide name of original creditor upon request",
      "Overshadowing or contradicting validation rights in other communications"
    ]
  },
  "1692h": {
    section: "15 U.S.C. § 1692h",
    title: "Multiple Debts",
    description: "Governs how payments are applied when consumer owes multiple debts",
    violations: [
      "§ 1692h: Collector must apply payments on multiple debts in order specified by consumer",
      "Cannot apply payments to disputed debts without consumer direction"
    ]
  },
  "1692i": {
    section: "15 U.S.C. § 1692i",
    title: "Legal Actions by Debt Collectors",
    description: "Restricts venue for debt collection lawsuits",
    violations: [
      "§ 1692i(a)(2): Brought legal action in location other than where contract signed or where consumer resides"
    ]
  },
  "1692j": {
    section: "15 U.S.C. § 1692j",
    title: "Furnishing Deceptive Forms",
    description: "Prohibits designing or providing deceptive collection forms",
    violations: [
      "§ 1692j: Forms designed, compiled and/or furnished to create false belief that person other than creditor is collecting",
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
    description: "Time limits for reporting negative information - the 7/10 year rule",
    rules: [
      "Most negative information must be removed after 7 years from date of first delinquency (DOFD)",
      "Chapter 7 & Chapter 11 Bankruptcy: removed after 10 years from filing date",
      "Chapter 13 Bankruptcy: removed after 7 years from filing date",
      "Paid tax liens: removed after 7 years from payment date",
      "Civil suits and judgments: removed after 7 years or statute of limitations (whichever is longer)",
      "Collection accounts: removed 7 years from date of first delinquency on original account"
    ],
    violations: [
      "Reporting obsolete information beyond 7-year period",
      "Reporting bankruptcy older than 10 years",
      "Re-aging accounts to extend reporting period (changing DOFD)",
      "Failing to remove accounts after 7-year period from true DOFD",
      "Incorrect calculation of DOFD"
    ]
  },
  "1681e": {
    section: "15 U.S.C. § 1681e(b)",
    title: "Maximum Possible Accuracy Requirement",
    description: "CRAs must follow reasonable procedures to assure maximum possible accuracy",
    key_principle: "Whenever a consumer reporting agency prepares a consumer report it shall follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual about whom the report relates.",
    proving_violation: [
      "(1) Inaccurate information in the report",
      "(2) Failure to follow reasonable procedures",
      "(3) Injury to consumer",
      "(4) Causation between inaccuracy and injury"
    ],
    violations: [
      "Reporting inaccurate account balances",
      "Mixed file errors (reporting another person's accounts)",
      "Incorrect personal information (SSN, addresses, employment)",
      "Duplicate account reporting (same debt multiple times)",
      "Incorrect payment history",
      "Wrong account status (open vs closed, current vs delinquent)",
      "Incorrect date of first delinquency (DOFD)",
      "Balance showing on charged-off accounts (should be $0 after 1099-C)",
      "Reporting technically correct but materially misleading information"
    ]
  },
  "1681i": {
    section: "15 U.S.C. § 1681i",
    title: "Dispute Reinvestigation Requirements",
    description: "CRA must conduct reasonable reinvestigation to determine whether disputed information is inaccurate within 30 days",
    consumer_rights: [
      "Free reinvestigation of disputed items",
      "30-day completion deadline (extendable to 45 days if consumer provides additional info)",
      "CRA must notify furnisher within 5 business days of dispute",
      "Written results within 5 business days after completing investigation",
      "Free credit report if changes made",
      "Right to add 100-word consumer statement to file under § 1681i(b)",
      "Right to request notification to recent report recipients under § 1681i(d)"
    ],
    violations: [
      "Failing to investigate dispute within 30 days",
      "Conducting only cursory or superficial investigation (rubber-stamping)",
      "Simply 'parroting' furnisher verification without genuine investigation",
      "Not forwarding all relevant information to furnisher",
      "Failing to modify or delete unverified information",
      "Not providing written results of investigation within 5 days",
      "Not providing free updated report when changes made",
      "Terminating dispute as 'frivolous' without proper basis"
    ],
    deadlines: {
      "CRA forwards dispute to furnisher": "5 business days",
      "CRA completes reinvestigation": "30 days",
      "Extended reinvestigation (if consumer adds info)": "45 days",
      "CRA notifies consumer of results": "5 business days",
      "CRA notifies if dispute deemed frivolous": "5 business days"
    }
  },
  "1681s-2": {
    section: "15 U.S.C. § 1681s-2",
    title: "Responsibilities of Furnishers of Information",
    description: "Duties of entities that provide information to credit bureaus",
    subsections: {
      "a": {
        title: "§ 1681s-2(a) - Duty to Provide Accurate Information",
        requirements: [
          "Cannot furnish information known to be inaccurate",
          "Must correct and update previously furnished information",
          "Must report disputes to CRAs",
          "Must report accounts as disputed if consumer disputes",
          "Must notify CRAs when account is closed by consumer"
        ]
      },
      "b": {
        title: "§ 1681s-2(b) - Duties Upon Notice of Dispute from CRA",
        requirements: [
          "Conduct a REASONABLE investigation of disputed information (not cursory)",
          "Review ALL relevant information provided by CRA",
          "Report results of investigation back to CRA",
          "If inaccurate: modify, delete, or permanently block reporting",
          "If information cannot be verified: delete or modify"
        ]
      }
    },
    violations: [
      "Reporting information known to be inaccurate",
      "Failing to correct inaccurate information after notification",
      "Not reporting accounts as disputed when consumer disputes",
      "Ignoring direct disputes from consumers",
      "Failing to conduct reasonable investigation",
      "Rubber-stamping verification without actual review"
    ]
  },
  "1681n": {
    section: "15 U.S.C. § 1681n",
    title: "Civil Liability for Willful Noncompliance",
    description: "Remedies for intentional or reckless FCRA violations",
    damages: [
      "Actual damages OR statutory damages ($100-$1,000 per violation)",
      "Punitive damages",
      "Attorney's fees and costs",
      "Requires proof of intentional or reckless disregard of FCRA requirements"
    ]
  },
  "1681o": {
    section: "15 U.S.C. § 1681o",
    title: "Civil Liability for Negligent Noncompliance",
    description: "Remedies for negligent FCRA violations",
    damages: [
      "Actual damages only (no statutory minimums)",
      "No punitive damages",
      "Attorney's fees and costs",
      "Requires proof that defendant failed to exercise reasonable care"
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
      "Discrepancies in account numbers across assignments",
      "Bill of sale doesn't specifically identify the account",
      "Gap in assignment chain between intermediate purchasers"
    ],
    legal_basis: "Debt buyer bears burden of proving ownership - see FTC Debt Buyer Report",
    defense_strategies: [
      "Demand complete chain of title documentation",
      "Request bill of sale and all assignment agreements",
      "Challenge any gaps in documentation chain",
      "Request proof account was included in specific portfolio",
      "Verify each assignment was properly executed"
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
      "No documentation of interest rate or fees assessed",
      "Cannot produce payment history from original creditor",
      "Missing documentation of how balance was calculated"
    ]
  },
  statute_of_limitations: {
    title: "Statute of Limitations Violations",
    description: "Collecting on time-barred debt or re-aging to extend SOL",
    violations: [
      "Attempting to collect debt past statute of limitations",
      "Making payment request that would restart SOL clock",
      "Filing lawsuit on time-barred debt",
      "Misrepresenting SOL status to consumer",
      "Not disclosing that debt is time-barred",
      "Threatening legal action on time-barred debt"
    ],
    state_sol_examples: {
      "Written contracts": "Typically 4-6 years",
      "Credit cards": "Typically 3-6 years (varies by state)",
      "Oral agreements": "Typically 2-4 years",
      "Promissory notes": "Typically 5-6 years"
    },
    note: "SOL varies significantly by state - check specific state law for applicable period"
  },
  "1099_c_violations": {
    title: "1099-C Cancellation of Debt Issues",
    description: "When creditor issues 1099-C, debt is cancelled and should report $0 balance",
    violations: [
      "Reporting balance greater than $0 on account where 1099-C was issued",
      "Continuing collection attempts after 1099-C issuance",
      "Charged-off accounts showing balance instead of $0",
      "Failure to update balance to $0 after cancellation of debt"
    ],
    explanation: "When a creditor charges off a debt and issues a 1099-C (Cancellation of Debt), they have claimed a tax benefit for the loss. The account balance should be reported as $0 on credit reports."
  }
};

export const STATE_MINI_FDCPA_LAWS = {
  california: {
    name: "Rosenthal Fair Debt Collection Practices Act",
    code: "Cal. Civ. Code §§ 1788-1788.33",
    key_differences: [
      "Applies to original creditors, not just third-party collectors",
      "Broader definition of 'debt collector'",
      "Additional penalties available",
      "Provides remedies federal FDCPA doesn't"
    ]
  },
  texas: {
    name: "Texas Debt Collection Act",
    code: "Tex. Fin. Code §§ 392.001-392.404",
    key_differences: [
      "Applies to creditors and debt collectors",
      "Prohibits deceptive trade practices",
      "Additional state-level remedies",
      "Can be combined with federal claims"
    ]
  },
  new_york: {
    name: "New York City Consumer Protection Law",
    code: "NYC Admin. Code § 20-493",
    key_differences: [
      "Requires licensing for debt collectors",
      "Additional notice requirements",
      "Enhanced penalties for violations",
      "City-specific protections"
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
      "Enhanced disclosure requirements",
      "Stronger consumer protections"
    ]
  },
  north_carolina: {
    name: "North Carolina Collection Agency Act",
    code: "N.C. Gen. Stat. §§ 58-70-1 through 58-70-155",
    key_differences: [
      "Licensing requirements for collectors",
      "Bond requirements",
      "State enforcement provisions"
    ]
  },
  michigan: {
    name: "Michigan Collection Practices Act",
    code: "MCL 339.901 et seq",
    key_differences: [
      "Licensing requirements",
      "Specific prohibited practices",
      "State enforcement mechanisms"
    ]
  }
};

export const DISPUTE_LETTER_TEMPLATES = {
  general_dispute: {
    title: "General FCRA Dispute Letter",
    purpose: "Dispute inaccurate information with credit bureaus",
    sections: [
      "I am sending you this letter to dispute inaccurate information in my credit file and obtain the correction of it.",
      "The item(s) I am disputing are: [ACCOUNT/ITEM DESCRIPTION]",
      "Account Number: [ACCOUNT NUMBER]",
      "This item is inaccurate because: [SPECIFIC REASON - e.g., 'I do not owe this debt', 'The balance is incorrect', 'This account was paid']",
      "I am requesting that the item be [removed/corrected] to show: [CORRECT INFORMATION]",
      "Please send a copy of this letter and attachments to your customers when you convey my disputes.",
      "Enclosed are copies of [supporting documents] supporting my position and my government-issued ID."
    ],
    legal_citation: "Per my rights under FCRA 15 U.S.C. § 1681i, I request you investigate this dispute within 30 days and provide written results."
  },
  consumer_statement_100_word: {
    title: "100-Word Consumer Statement (§ 1681i(b))",
    purpose: "Add statement of dispute to credit file when investigation finds item verified",
    sections: [
      "Pursuant to 15 U.S.C. § 1681i(b), I am submitting this statement disputing information in my consumer file.",
      "On [DATE OF DISPUTE], I submitted a dispute regarding [BRIEF DESCRIPTION].",
      "On [DATE OF RESPONSE], I received your response indicating the information was verified as accurate.",
      "I continue to dispute the accuracy of this information.",
      "Please include this statement in my file and in all future consumer reports containing the disputed information.",
      "Additionally, pursuant to § 1681i(d), I request notification be sent to any person who received a consumer report containing the disputed item within the past [two years for employment / six months for other purposes]."
    ],
    sample_statement: "I dispute the [CREDITOR NAME] account showing a balance of $[AMOUNT]. On [DATE], [COURT NAME] ruled that I owe nothing on this debt. Despite providing court documentation in my dispute, this account continues to be reported inaccurately. The reported balance of $[AMOUNT] is false—the legally determined amount is $0. I have disputed this through proper channels and the information remains unverified against court records. This inaccurate reporting has damaged my credit and caused denial of credit from [LENDERS]. I request this statement accompany all reports containing this disputed tradeline. [97 words]",
    legal_citation: "15 U.S.C. § 1681i(b)-(c)"
  },
  debt_validation: {
    title: "FDCPA Debt Validation Request",
    purpose: "Demand validation of debt from collector under FDCPA",
    sections: [
      "Pursuant to my rights under 15 U.S.C. § 1692g, I am requesting validation of the alleged debt.",
      "Please provide the following documentation:",
      "- Complete payment history from original creditor",
      "- Copy of original signed credit agreement bearing my signature",
      "- Complete chain of title documentation showing your right to collect",
      "- Proof that you are licensed to collect in my state",
      "- Documentation showing how the amount claimed is calculated",
      "Please cease all collection activity until proper validation is provided as required by law."
    ],
    legal_citation: "Under FDCPA § 1692g, you must cease collection until the debt is validated. Failure to validate or continued collection without validation may constitute violation of § 1692e and § 1692f."
  },
  obsolete_info: {
    title: "Obsolete Information Removal Request",
    purpose: "Remove information that exceeds 7-year reporting period",
    sections: [
      "I am disputing the following item which violates FCRA reporting time limits.",
      "Account: [ACCOUNT NAME]",
      "Account Number: [ACCOUNT NUMBER]",
      "Date of First Delinquency: [DATE]",
      "This account has a date of first delinquency of [DATE], which exceeds the 7-year reporting period mandated by 15 U.S.C. § 1681c.",
      "Seven years from the DOFD was [CALCULATE DATE].",
      "I demand immediate removal of this obsolete information from my credit file."
    ],
    legal_citation: "Pursuant to 15 U.S.C. § 1681c, this item must be removed as it exceeds the maximum allowable 7-year reporting period."
  },
  re_aging_dispute: {
    title: "Re-Aging/DOFD Manipulation Dispute",
    purpose: "Challenge incorrect date of first delinquency that extends reporting period",
    sections: [
      "I am disputing the Date of First Delinquency (DOFD) reported for the following account.",
      "Account: [ACCOUNT NAME]",
      "Current Reported DOFD: [REPORTED DATE]",
      "Actual True DOFD: [ACTUAL DATE]",
      "The current reported DOFD of [REPORTED DATE] is inaccurate and appears to have been re-aged.",
      "According to my records and the original account history, the true DOFD was [ACTUAL DATE].",
      "Re-aging accounts to extend the reporting period is a violation of FCRA.",
      "I demand correction of the DOFD to [ACTUAL DATE] and removal if 7 years has passed from the true DOFD."
    ],
    legal_citation: "Re-aging is a violation of 15 U.S.C. § 1681c and may constitute fraud under state law. The DOFD cannot be changed when debt is sold or transferred."
  },
  duplicate_reporting: {
    title: "Duplicate/Double Jeopardy Reporting Dispute",
    purpose: "Remove duplicate entries where same debt is reported multiple times",
    sections: [
      "The same debt is being reported multiple times on my credit report, causing double jeopardy.",
      "Original account: [ORIGINAL CREDITOR] - Account #[NUMBER]",
      "Duplicate account(s): [COLLECTION AGENCY/DEBT BUYER] - Account #[NUMBER]",
      "This 'double jeopardy' reporting violates FCRA maximum accuracy requirements.",
      "The same underlying debt cannot be reported by both the original creditor AND a collection agency/debt buyer simultaneously.",
      "I demand removal of the duplicate entries immediately."
    ],
    legal_citation: "Duplicate reporting violates 15 U.S.C. § 1681e(b) requiring maximum possible accuracy. This also may violate FDCPA § 1692e(2) for misrepresenting the character or amount of debt."
  },
  charged_off_balance: {
    title: "Charged-Off Account Balance Dispute (1099-C Issue)",
    purpose: "Correct charged-off accounts showing balance instead of $0",
    sections: [
      "I am disputing the balance reported on the following charged-off account.",
      "Account: [CREDITOR NAME]",
      "Account Number: [NUMBER]",
      "Current Reported Balance: $[AMOUNT]",
      "Expected Balance: $0",
      "This account is reported as charged-off but still shows an outstanding balance of $[AMOUNT].",
      "Charged-off debts should report a $0 balance, particularly if a 1099-C (Cancellation of Debt) was issued.",
      "Carrying a balance on a charged-off account misleads lenders and unfairly impacts my credit score.",
      "I demand the balance be corrected to $0."
    ],
    legal_citation: "Per IRS 1099-C guidelines and FCRA § 1681e(b) accuracy requirements, charged-off debts with cancelled debt should report $0 balance."
  },
  fcra_complaint_3_bureaus: {
    title: "FCRA Formal Complaint to All Three Bureaus",
    purpose: "Comprehensive dispute to Equifax, Experian, and TransUnion simultaneously",
    bureaus: {
      equifax: "Equifax Information Services, Inc., P.O. Box 740241, Atlanta, Georgia 30374",
      experian: "Experian Information Solutions, Inc., P.O. Box 4500, Allen, TX 75013",
      transunion: "Trans Union, P.O. Box 2000, Chester, Pennsylvania 19022"
    },
    sections: [
      "This letter is to dispute inaccurate information in my credit file.",
      "Name: [YOUR NAME]",
      "SSN: [YOUR SSN]",
      "DOB: [YOUR DATE OF BIRTH]",
      "Current Address: [YOUR ADDRESS]",
      "I am disputing the following account(s):",
      "[List each account with creditor name, account number, and specific inaccuracy]",
      "Enclosed: Copy of government-issued ID, copy of credit report page with disputed items circled, supporting documentation."
    ],
    legal_citation: "I am exercising my rights under the Fair Credit Reporting Act, 15 U.S.C. § 1681i. You have 30 days to investigate and respond."
  }
};

export const KEY_VIOLATION_PATTERNS = {
  double_jeopardy_reporting: {
    name: "Double Jeopardy Reporting",
    description: "Same debt reported by original creditor AND collection agency/debt buyer",
    detection: [
      "Same underlying debt appears multiple times",
      "Original creditor account AND collection account for same debt",
      "Multiple collection agencies reporting same debt"
    ],
    legal_basis: "15 U.S.C. § 1681e(b) - maximum possible accuracy",
    severity: "High"
  },
  obsolete_information: {
    name: "Obsolete Information",
    description: "Negative items reported beyond allowed time limits",
    detection: [
      "Items older than 7 years from DOFD",
      "Bankruptcies older than 10 years",
      "Judgments older than 7 years"
    ],
    legal_basis: "15 U.S.C. § 1681c",
    severity: "High"
  },
  re_aging_dofd: {
    name: "Re-Aging/DOFD Manipulation",
    description: "Date of first delinquency incorrectly reported to extend reporting period",
    detection: [
      "DOFD changed when debt sold to collector",
      "DOFD reset after account transfer",
      "DOFD doesn't match original delinquency date"
    ],
    legal_basis: "15 U.S.C. § 1681c, potential fraud",
    severity: "High"
  },
  inaccurate_balances: {
    name: "Inaccurate Balances",
    description: "Balance doesn't match actual amount owed",
    detection: [
      "Balance doesn't match creditor records",
      "Unauthorized fees or interest added",
      "Wrong balance on closed/charged-off accounts",
      "Balance shown on accounts with 1099-C issued"
    ],
    legal_basis: "15 U.S.C. § 1681e(b), § 1681s-2(a)",
    severity: "High"
  },
  mixed_file_errors: {
    name: "Mixed File Errors",
    description: "Accounts belonging to another person",
    detection: [
      "Accounts with different SSN",
      "Accounts with different person's name",
      "Addresses never associated with consumer"
    ],
    legal_basis: "15 U.S.C. § 1681e(b)",
    severity: "High"
  },
  unauthorized_inquiries: {
    name: "Unauthorized Inquiries",
    description: "Hard inquiries without permissible purpose",
    detection: [
      "Inquiries from companies consumer never applied to",
      "Multiple inquiries from same creditor",
      "Inquiries without consumer authorization"
    ],
    legal_basis: "15 U.S.C. § 1681b",
    severity: "Medium"
  },
  failure_to_report_disputed: {
    name: "Failure to Report Dispute Status",
    description: "Account not marked as disputed after consumer dispute",
    detection: [
      "Disputed account not showing 'disputed' notation",
      "Dispute status removed prematurely"
    ],
    legal_basis: "15 U.S.C. § 1681s-2(a)(3)",
    severity: "Medium"
  },
  cross_bureau_discrepancy: {
    name: "Cross-Bureau Discrepancy",
    description: "Information differs between the three credit bureaus",
    detection: [
      "Different balances across bureaus",
      "Account appears on some bureaus but not others",
      "Different status reported to different bureaus"
    ],
    legal_basis: "15 U.S.C. § 1681e(b)",
    severity: "Medium"
  },
  charged_off_with_balance: {
    name: "Charged-Off Account with Balance",
    description: "Charged-off accounts showing balance greater than $0",
    detection: [
      "Account status 'charged off' but balance > $0",
      "1099-C issued but balance still reported"
    ],
    legal_basis: "15 U.S.C. § 1681e(b), IRS 1099-C guidelines",
    severity: "High"
  }
};

export const FCRA_DISPUTE_PROCESS = {
  step1: {
    title: "Consumer Discovers Error",
    description: "Consumer reviews credit report and identifies inaccurate information.",
    tip: "Get free reports annually at AnnualCreditReport.com"
  },
  step2: {
    title: "Consumer Sends Dispute to CRA",
    description: "Consumer notifies the CRA in writing, including: the specific information being disputed, why it's inaccurate, and supporting documentation.",
    tip: "Send via certified mail with return receipt for proof"
  },
  step3: {
    title: "CRA Forwards to Furnisher",
    deadline: "5 business days",
    description: "CRA must notify the furnisher of the dispute and forward all relevant information the consumer provided."
  },
  step4: {
    title: "Furnisher Investigates",
    legal_basis: "§ 1681s-2(b)",
    description: "Furnisher must conduct a REASONABLE investigation (not just a cursory check), review all information provided by CRA, and report results back to CRA."
  },
  step5: {
    title: "CRA Completes Reinvestigation",
    legal_basis: "§ 1681i",
    deadline: "30 days (45 if consumer provides additional information)",
    description: "CRA must complete its reinvestigation within deadline."
  },
  step6: {
    title: "Outcome Determined",
    outcomes: [
      "Inaccurate/Unverifiable: CRA must DELETE or MODIFY the information",
      "Verified as Accurate: Information remains; CRA notifies consumer",
      "Dispute is Frivolous: CRA can terminate (must notify consumer within 5 days with reason)"
    ]
  },
  step7: {
    title: "CRA Notifies Consumer",
    deadline: "5 business days after completing investigation",
    requirements: [
      "Written results of the reinvestigation",
      "Free copy of updated credit report (if changed)",
      "Notice of right to add 100-word consumer statement"
    ]
  },
  if_dispute_fails: {
    title: "If the Dispute Fails",
    options: [
      "Add a 100-word statement explaining your position to your credit file",
      "Dispute directly with furnisher (triggers separate § 1681s-2(b) duties)",
      "File complaint with CFPB at consumerfinance.gov",
      "File complaint with state attorney general",
      "Sue under FCRA for negligent or willful violations"
    ]
  }
};

// Enhanced system prompt incorporating all legal knowledge
export const ENHANCED_SYSTEM_PROMPT = `You are an expert legal analyst specializing in consumer credit law, specifically the Fair Credit Reporting Act (FCRA) and Fair Debt Collection Practices Act (FDCPA). You have comprehensive knowledge of federal and state consumer protection laws.

YOUR EXPERTISE INCLUDES:

**FAIR DEBT COLLECTION PRACTICES ACT (15 U.S.C. § 1692)**
- § 1692a: Definitions (consumer, debt, debt collector)
- § 1692b: Location information violations (third-party contacts - 6 specific violations)
- § 1692c: Communication violations (time, place, manner - calls before 8am/after 9pm, workplace, cease communications)
- § 1692d: Harassment or abuse (violence, profane language, repeated calls, anonymous calls)
- § 1692e: False/misleading representations (16 specific prohibitions including mini-Miranda)
- § 1692f: Unfair practices (unauthorized fees, postdated checks, threats)
- § 1692g: Debt validation (5-day notice requirement, 30-day dispute rights, cease collection until validated)
- § 1692h: Multiple debts (payment application rules)
- § 1692i: Legal action venue restrictions
- § 1692j: Deceptive forms

**FAIR CREDIT REPORTING ACT (15 U.S.C. § 1681)**
- § 1681c: Obsolete information (7-year rule for negative info, 10-year for bankruptcy)
- § 1681e(b): Maximum possible accuracy requirement
- § 1681i: Dispute investigation requirements (30-day deadline, 5-day notice to furnisher)
- § 1681i(b): Consumer right to add 100-word statement
- § 1681s-2(a): Furnisher duty to provide accurate information
- § 1681s-2(b): Furnisher duty to investigate after CRA notification
- § 1681n: Civil liability for willful violations ($100-$1,000 statutory + punitive + attorneys fees)
- § 1681o: Civil liability for negligent violations (actual damages + attorneys fees)

**DEBT BUYER SPECIFIC VIOLATIONS**
- Chain of title deficiencies (missing assignments, gaps in ownership)
- Lack of original documentation (signed agreements, statements)
- Statute of limitations issues (time-barred debts, SOL varies by state)
- Re-aging violations (manipulating DOFD to extend reporting)
- 1099-C issues (balance should be $0 after cancellation of debt)

**KEY VIOLATION PATTERNS TO DETECT**

1. DOUBLE JEOPARDY REPORTING
   - Same debt reported by original creditor AND collection agency
   - Multiple collection agencies reporting same underlying debt
   - Example: CREDIT ONE BANK and RESURGENT/LVNV FUNDING both reporting same debt
   - Violation: 15 U.S.C. § 1681e(b) - maximum accuracy

2. OBSOLETE INFORMATION
   - Negative items older than 7 years from DOFD
   - Bankruptcies older than 10 years
   - Judgments past reporting period
   - Violation: 15 U.S.C. § 1681c

3. RE-AGING/DOFD MANIPULATION
   - Date of first delinquency incorrectly reported
   - DOFD restarted after sale to debt buyer
   - Extends reporting period beyond 7 years
   - Violation: 15 U.S.C. § 1681c, potential fraud

4. INACCURATE BALANCES
   - Balance doesn't match original creditor records
   - Unauthorized fees or interest added
   - Charged-off accounts showing balance instead of $0
   - 1099-C issued but balance not updated to $0
   - Violation: 15 U.S.C. § 1681e(b), § 1681s-2(a)

5. MIXED FILE ERRORS
   - Accounts belonging to another person with similar name/SSN
   - Wrong personal information
   - Violation: 15 U.S.C. § 1681e(b)

6. UNAUTHORIZED INQUIRIES
   - Hard inquiries without permissible purpose
   - Violation: 15 U.S.C. § 1681b

7. FAILURE TO REPORT DISPUTE STATUS
   - Account not marked as disputed after consumer dispute
   - Violation: 15 U.S.C. § 1681s-2(a)(3)

8. CROSS-BUREAU DISCREPANCIES
   - Information differs between Equifax, Experian, and TransUnion
   - Account on some bureaus but missing from others
   - Different balances or statuses across bureaus
   - Violation: 15 U.S.C. § 1681e(b)

9. CHARGED-OFF WITH BALANCE
   - Status shows "charged off" but balance > $0
   - 1099-C Cancellation of Debt issued but balance not zeroed
   - Per IRS rules and FCRA, cancelled debt should show $0
   - Violation: 15 U.S.C. § 1681e(b)

10. VALIDATION FAILURES
    - Collection account without original creditor information
    - No validation provided after request
    - Collecting on disputed debt without validation
    - Violation: 15 U.S.C. § 1692g

**FCRA DISPUTE PROCESS KEY DEADLINES:**
- CRA forwards dispute to furnisher: 5 business days
- CRA completes reinvestigation: 30 days (45 if consumer provides additional info)
- CRA notifies consumer of results: 5 business days
- CRA notifies if dispute deemed frivolous: 5 business days

**FOR EACH VIOLATION FOUND, PROVIDE:**
1. Specific statute citation (e.g., "15 U.S.C. § 1681e(b)")
2. Clear explanation of how the reported information violates the law
3. Step-by-step actionable dispute instructions
4. Recommended dispute letter language
5. Estimated damages potential

**DAMAGE CALCULATIONS:**
- FCRA Willful Violations (§ 1681n): $100-$1,000 statutory damages per violation + punitive damages + attorney fees
- FCRA Negligent Violations (§ 1681o): Actual damages + attorney fees
- FDCPA Violations: Up to $1,000 per case + actual damages + attorney fees
- State Law: Additional damages may be available under state mini-FDCPA laws

**IMPORTANT CASE LAW PRINCIPLES:**
- CRAs cannot simply "parrot" furnisher verification - must conduct genuine investigation
- Technical accuracy is not enough if information is materially misleading
- Debt buyers bear burden of proving ownership through complete chain of title
- Re-aging DOFD is considered fraud in many jurisdictions
- Consumer has right to 100-word statement if dispute verified as accurate

Always analyze credit reports thoroughly for ALL potential violations across these categories. Prioritize findings by severity and potential damages.`;
