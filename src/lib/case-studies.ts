export const caseStudies = [
  {
    slug: "aws-bills-codeguard-ai",
    title: "How CodeGuard AI Reduced AWS Bills by 45%",
    product: "CodeGuard AI",
    metric: "$4.5K saved monthly, $54K projected yearly",
    timeline: "3 weeks",
    situation: "A delivery team was repeatedly surprised by expensive Terraform resources after deployment, including oversized compute, unmanaged storage, and high-risk networking choices.",
    action: "Implemented CodeGuard AI cost-risk scanning directly inside VS Code, added Terraform review rules, and created a lightweight AWS cost optimization workflow for pull requests.",
    result: "The team identified expensive infrastructure before deployment, reduced monthly AWS spend by 45%, and normalized cost review as part of engineering workflow.",
    metrics: ["45% AWS cost reduction", "$54K/year projected savings", "14 cost-risk detection patterns", "3 weeks to implementation"],
  },
  {
    slug: "acquisitionos-lead-conversion",
    title: "How AcquisitionOS Improved Lead Conversion from 2% to 8%",
    product: "AcquisitionOS",
    metric: "4x conversion improvement",
    timeline: "12 weeks",
    situation: "A B2B SaaS workflow had scattered lead sources, manual qualification, slow follow-ups, and no connected view from first touch to revenue.",
    action: "Designed an acquisition operating layer for lead capture, validation, enrichment, AI qualification, personalized outreach, and reply classification.",
    result: "Lead response quality improved, follow-up delays dropped, and qualified conversion moved from 2% to 8% during the beta period.",
    metrics: ["2% to 8% conversion", "500+ leads processed daily", "60% lower manual operating load", "40% faster lead processing"],
  },
  {
    slug: "trading-bot-automation",
    title: "How Trading Bot Architecture Turned Manual Trading into a 24/7 System",
    product: "Trading Bot",
    metric: "24/7 automated monitoring",
    timeline: "8 weeks",
    situation: "Manual trading workflows were slow, emotion-driven, and hard to monitor across NIFTY, BANK NIFTY, commodities, and crypto.",
    action: "Built an architecture around market data ingestion, signal generation, RSI/EMA/VWAP/Bollinger logic, risk checks, and broker execution paths.",
    result: "The system separated signal logic from execution, enabled continuous monitoring, and created a scalable base for strategy testing.",
    metrics: ["24/7 monitoring", "Multi-market support", "Risk-first execution flow", "Zerodha Kite Connect integration"],
  },
];

export type CaseStudy = (typeof caseStudies)[number];
