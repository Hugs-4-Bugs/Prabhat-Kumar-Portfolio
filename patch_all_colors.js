const fs = require('fs');
const file = 'src/components/sections/currently-building.tsx';
let d = fs.readFileSync(file, 'utf8');

d = d.replace(/bg-yellow-500\/10 text-yellow-500/g, 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400');
d = d.replace(/bg-green-500\/10 text-green-500/g, 'bg-green-500/10 text-green-600 dark:text-green-400');
d = d.replace(/bg-orange-500\/10 text-orange-500/g, 'bg-orange-500/10 text-orange-600 dark:text-orange-400');
d = d.replace(/bg-blue-500\/10 text-blue-500/g, 'bg-blue-500/10 text-blue-600 dark:text-blue-400');
d = d.replace(/bg-purple-500\/10 text-purple-500/g, 'bg-purple-500/10 text-purple-600 dark:text-purple-400');

fs.writeFileSync(file, d);
