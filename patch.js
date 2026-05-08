const fs = require('fs');
const file = 'src/app/page.tsx';
let d = fs.readFileSync(file, 'utf8');
d = d.replace('import { Hero } from "@/components/sections/hero";', 'import { Hero } from "@/components/sections/hero";\nimport { CurrentlyBuilding } from "@/components/sections/currently-building";');
d = d.replace('<Hero />', '<Hero />\n        <CurrentlyBuilding />');
fs.writeFileSync(file, d);
