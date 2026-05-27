import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["ai-observability-platform"];

export const metadata = createSeoMetadata(page);

export default function AiObservabilityPlatformPage() {
  return <SeoPageShell page={page} />;
}
