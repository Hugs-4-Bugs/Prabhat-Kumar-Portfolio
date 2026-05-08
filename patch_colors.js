const fs = require('fs');
const file = 'src/components/sections/currently-building.tsx';
let d = fs.readFileSync(file, 'utf8');

d = d.replace(/tag: "Architecting",\s*tagColor: "bg-purple-500\/10 text-purple-500 border-purple-500\/20"/, 'tag: "Architecting",\n    tagColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"');
fs.writeFileSync(file, d);
