import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["system-design-interview"];

export const metadata = createSeoMetadata(page);

export default function SystemDesignInterviewPage() {
  return <SeoPageShell page={page} />;
}
