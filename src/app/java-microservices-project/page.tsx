import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["java-microservices-project"];

export const metadata = createSeoMetadata(page);

export default function JavaMicroservicesProjectPage() {
  return <SeoPageShell page={page} />;
}
