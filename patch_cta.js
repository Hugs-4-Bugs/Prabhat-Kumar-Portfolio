const fs = require('fs');
let file = 'src/components/sections/cta-bar.tsx';
let d = fs.readFileSync(file, 'utf8');

if (d.indexOf('import { LiquidButton }') === -1) {
  d = d.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { LiquidButton } from "@/components/ui/liquid-button";');
}

d = d.replace(/<button className="([^"]*?)ripple-btn([^"]*?)">([\s\S]*?)<\/button>/g, '<LiquidButton className="$1$2">$3</LiquidButton>');
fs.writeFileSync(file, d);

file = 'src/components/sections/contract-banner.tsx';
d = fs.readFileSync(file, 'utf8');

if (d.indexOf('import { LiquidButton }') === -1) {
  d = d.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { LiquidButton } from "@/components/ui/liquid-button";');
}

d = d.replace(/<button className="([^"]*?)ripple-bg([^"]*?)">([\s\S]*?)<\/button>/g, '<LiquidButton className="$1$2">$3</LiquidButton>');
fs.writeFileSync(file, d);

