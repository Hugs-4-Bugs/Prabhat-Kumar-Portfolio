import { NextResponse } from "next/server";

const fallbackMetrics = {
  tradingBot: {
    niftyPrice: "22,950.00",
    niftyChange: "+0.42%",
    activePositions: "3",
    pnl: "+₹18,420",
    status: "Last known",
  },
  codeGuard: {
    users: "1,000+",
    costsSaved: "$54K/year",
    scans: "14 cost-risk patterns",
    status: "Aggregated",
  },
  acquisitionOS: {
    leadsProcessed: "500+ / day",
    conversionRate: "8%",
    lift: "4x",
    status: "Beta metric",
  },
  socialProof: {
    githubStars: "Portfolio-wide",
    vscodeDownloads: "Marketplace ready",
    linkedinConnections: "Growing network",
    emailSubscribers: "Lead magnet active",
  },
  updatedAt: new Date().toISOString(),
};

async function getNiftyQuote() {
  try {
    const response = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?range=1d&interval=5m",
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    const price = meta?.regularMarketPrice;
    const previousClose = meta?.previousClose;
    if (typeof price !== "number" || typeof previousClose !== "number") return null;
    const change = ((price - previousClose) / previousClose) * 100;
    return {
      niftyPrice: price.toLocaleString("en-IN", { maximumFractionDigits: 2 }),
      niftyChange: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      status: "Live market fetch",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const nifty = await getNiftyQuote();

  return NextResponse.json({
    ...fallbackMetrics,
    tradingBot: {
      ...fallbackMetrics.tradingBot,
      ...(nifty ?? {}),
    },
    updatedAt: new Date().toISOString(),
  });
}
