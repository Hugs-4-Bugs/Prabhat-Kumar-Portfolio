import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["spring-boot-jwt-authentication-guide"];

export const metadata = createSeoMetadata(page);

export default function SpringBootJwtAuthenticationGuidePage() {
  return <SeoPageShell page={page} />;
}
