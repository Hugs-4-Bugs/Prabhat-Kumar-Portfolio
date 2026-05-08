const fs = require('fs');
const file = 'src/components/sections/currently-building.tsx';
let d = fs.readFileSync(file, 'utf8');

const oldStyle = `.glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .dark .glass-card {
          background: rgba(0, 0, 0, 0.2);
        }`;

const newStyle = `.glass-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }`;

d = d.replace(oldStyle, newStyle);
fs.writeFileSync(file, d);
