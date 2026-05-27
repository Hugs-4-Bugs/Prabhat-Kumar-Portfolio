import { createSeoMetadata, SeoPageShell, seoPages } from "../(seo-pages)/seo-pages";

const page = seoPages["aws-codeguard-ai"];

export const metadata = createSeoMetadata(page);

export default function AwsCodeGuardAiPage() {
  return <SeoPageShell page={page} />;
}
