const fs = require('fs');
const file = './src/components/products/ProductsLauncher.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update panel style
content = content.replace(
  /background: 'rgba\\(15, 15, 25, 0\\.85\\)',\\s*backdropFilter: 'blur\\(40px\\) saturate\\(180%\\)',\\s*WebkitBackdropFilter: 'blur\\(40px\\) saturate\\(180%\\)',\\s*border: '1px solid rgba\\(255, 255, 255, 0\\.08\\)',\\s*boxShadow: '0 25px 60px rgba\\(0, 0, 0, 0\\.5\\), 0 0 60px rgba\\(99, 102, 241, 0\\.05\\), inset 0 1px 0 rgba\\(255,255,255,0\\.05\\)',/g,
  `background: 'linear-gradient(145deg, rgba(16, 16, 22, 0.94), rgba(8, 8, 12, 0.97))',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 20px 40px rgba(255,255,255,0.02)',
              isolation: 'isolate',`
);

// Update Product tile style
content = content.replace(
  /background: isHovered\\s*\\?\\s*\`linear-gradient\\(135deg, \\$\\{product\\.color\\}15, rgba\\(255,255,255,0\\.03\\)\\)\`\\s*:\\s*"rgba\\(255,255,255,0\\.01\\)",\\s*border: \`1px solid \\$\\{isHovered \\? product\\.color \\+ "40" : "rgba\\(255,255,255,0\\.04\\)"\\}\`,/g,
  `background: isHovered
          ? \`linear-gradient(135deg, \${product.color}25, rgba(255,255,255,0.06))\`
          : "rgba(255,255,255,0.03)",
        opacity: isHovered ? 1 : 0.85,
        border: \`1px solid \${isHovered ? product.color + "50" : "rgba(255,255,255,0.08)"}\`,`
);

fs.writeFileSync(file, content);
console.log('Update complete.');
