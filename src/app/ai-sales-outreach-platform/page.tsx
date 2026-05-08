import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["ai-sales-outreach-platform"];

export const metadata = createSeoMetadata(page);

export default function AiSalesOutreachPlatformPage() {
  return <SeoPageShell page={page} />;
}
