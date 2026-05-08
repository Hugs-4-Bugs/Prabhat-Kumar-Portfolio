const fs = require('fs');
const file = 'src/app/page.tsx';
let d = fs.readFileSync(file, 'utf8');

// Add imports
d = d.replace(
  'import { Contact } from "@/components/sections/contact";',
  'import { Contact } from "@/components/sections/contact";\nimport { ContractBanner } from "@/components/sections/contract-banner";\nimport { Testimonials } from "@/components/sections/testimonials";\nimport { CTABar } from "@/components/sections/cta-bar";'
);

// Insert <ContractBanner /> after <Services />
d = d.replace('<Services />', '<Services />\n        <ContractBanner />');

// Insert <Testimonials /> after <Experience />
d = d.replace('<Experience />', '<Experience />\n        <Testimonials />');

// Insert <CTABar /> before <Contact />
d = d.replace('<Contact />', '<CTABar />\n        <Contact />');

fs.writeFileSync(file, d);
