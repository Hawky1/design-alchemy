import { useEffect, useState } from 'react';

const settlements = [
  { case: "FDCPA violation: debt collector's inappropriate response", amount: "$6K" },
  { case: "Erroneous background check affecting rental opportunities", amount: "$67K" },
  { case: "FDCPA violation: debt collector not reporting info", amount: "$6K" },
  { case: "FCRA: fraudulent credit info resulting in identity theft", amount: "$100K" },
  { case: "FCRA: inaccurate reporting leading to home refinance denial", amount: "$42K" },
  { case: "Inaccurate credit reporting causing score drop", amount: "$30K" },
  { case: "Incorrect credit info causing increased interest", amount: "$35K" },
  { case: "Vehicle repossession reporting error causing score drop", amount: "$67K" },
];

export function SettlementsBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Duplicate settlements for seamless infinite scroll
  const duplicatedSettlements = [...settlements, ...settlements];

  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground overflow-hidden">
      <div className="py-2 relative">
        <div className="flex animate-scroll-left">
          {duplicatedSettlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-6 whitespace-nowrap text-sm font-medium"
            >
              <span className="text-primary-foreground/70">Recent Settlement:</span>
              <span>{settlement.case}</span>
              <span className="font-bold text-lg">— {settlement.amount}</span>
              <span className="mx-4 text-primary-foreground/40">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
