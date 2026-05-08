const fs = require('fs');
const file = 'src/components/sections/currently-building.tsx';
let d = fs.readFileSync(file, 'utf8');

d = d.replace('hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(var(--primary-rgb),0.12)]', 'hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/20');
fs.writeFileSync(file, d);
