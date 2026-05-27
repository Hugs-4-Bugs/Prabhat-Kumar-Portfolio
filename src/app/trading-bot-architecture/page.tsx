import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["trading-bot-architecture"];

export const metadata = createSeoMetadata(page);

export default function TradingBotArchitecturePage() {
  return <SeoPageShell page={page} />;
}
