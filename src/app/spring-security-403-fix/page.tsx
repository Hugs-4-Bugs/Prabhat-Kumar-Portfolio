import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["spring-security-403-fix"];

export const metadata = createSeoMetadata(page);

export default function SpringSecurity403FixPage() {
  return <SeoPageShell page={page} />;
}
