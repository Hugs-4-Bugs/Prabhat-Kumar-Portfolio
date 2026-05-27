const fs = require('fs');
const file = './src/components/products/ProductsLauncher.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { products, statusConfig } from "@/lib/products-data";',
  'import { products, statusConfig } from "@/lib/products-data";\nimport { useTheme } from "next-themes";'
);

content = content.replace(
  'function ProductTile({ product, index, onClose }: { product: Product; index: number; onClose: () => void }) {',
  'function ProductTile({ product, index, onClose, isDark }: { product: Product; index: number; onClose: () => void; isDark: boolean }) {'
);

const oldTileStyle = `      style={{
        background: isHovered 
          ? \`radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), \${product.color}35, rgba(255,255,255,0.05))\`
          : 'rgba(255,255,255,0.08)',
        opacity: isHovered ? 1 : 0.85,
        border: \`1px solid \${isHovered ? product.color + '60' : 'rgba(255,255,255,0.12)'}\`,
        boxShadow: isHovered ? \`0 0 40px \${product.color}25, inset 0 0 30px \${product.color}15\` : 'none',
      }}`;
const newTileStyle = `      style={{
        background: isHovered 
          ? \`radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), \${product.color}35, \${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'})\`
          : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'),
        opacity: isHovered ? 1 : 0.85,
        border: \`1px solid \${isHovered ? product.color + (isDark ? '60' : '40') : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')}\`,
        boxShadow: isHovered ? \`0 0 40px \${product.color}25, inset 0 0 30px \${product.color}15\` : 'none',
      }}`;
content = content.replace(oldTileStyle, newTileStyle);

content = content.replace(
  'export function ProductsLauncher({ className }: ProductsLauncherProps) {',
  'export function ProductsLauncher({ className }: ProductsLauncherProps) {\n  const { resolvedTheme } = useTheme();\n  const isDark = resolvedTheme !== "light";'
);

const oldPanelStyle = `            style={{
              background: 'linear-gradient(145deg, rgba(16, 16, 22, 0.94), rgba(8, 8, 12, 0.97))',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 20px 40px rgba(255,255,255,0.03)',
              isolation: 'isolate',
            }}`;
const newPanelStyle = `            style={{
              background: isDark ? 'linear-gradient(145deg, rgba(16, 16, 22, 0.94), rgba(8, 8, 12, 0.97))' : 'linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(248, 248, 250, 0.97))',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: isDark ? '0 40px 80px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 20px 40px rgba(255,255,255,0.03)' : '0 40px 80px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 20px 40px rgba(255,255,255,0.4)',
              isolation: 'isolate',
            }}`;
content = content.replace(oldPanelStyle, newPanelStyle);

// Texts replacements:
// <div className="w-10 h-1 rounded-full bg-white/20" /> -> isDark ? 'bg-white/20' : 'bg-black/20'
content = content.replace(
  '<div className="w-10 h-1 rounded-full bg-white/20" />',
  '<div className={`w-10 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-black/20"}`} />'
);

content = content.replace(
  '<h3 className="text-sm font-semibold text-white/90 font-headline">Products</h3>',
  '<h3 className={`text-sm font-semibold font-headline ${isDark ? "text-white/90" : "text-slate-900"}`}>Products</h3>'
);

content = content.replace(
  '<p className="text-[10px] text-white/40 mt-0.5">Ecosystem by Prabhat Kumar</p>',
  '<p className={`text-[10px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>Ecosystem by Prabhat Kumar</p>'
);

content = content.replace(
  'hover:bg-white/10 transition-colors"',
  'transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}"'
);

content = content.replace(
  '<X size={14} className="text-white/50" />',
  '<X size={14} className={isDark ? "text-white/50" : "text-slate-400"} />'
);

content = content.replace(
  '<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />',
  '<Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-white/30" : "text-slate-400"}`} />'
);

content = content.replace(
  'className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/8 text-white/80 placeholder:text-white/25 focus:outline-none focus:border-indigo-500/40 focus:bg-white/8 transition-all"',
  'className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-all ${isDark ? "bg-white/5 border-white/8 text-white/80 placeholder:text-white/25 focus:border-indigo-500/40 focus:bg-white/8" : "bg-black/5 border-black/10 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500/40 focus:bg-white"}`}'
);

content = content.replace(
  '<div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-white/10">',
  '<div className={`flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin ${isDark ? "scrollbar-thumb-white/10" : "scrollbar-thumb-black/10"}`}>'
);

content = content.replace(
  'onClose={() => setIsOpen(false)}',
  'onClose={() => setIsOpen(false)}\n                    isDark={isDark}'
);

content = content.replace(
  '<div className="flex flex-col items-center justify-center py-8 text-white/30">',
  '<div className={`flex flex-col items-center justify-center py-8 ${isDark ? "text-white/30" : "text-slate-400"}`}>'
);

content = content.replace(
  '<div className="px-5 py-3 border-t border-white/5">',
  '<div className={`px-5 py-3 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>'
);

content = content.replace(
  'className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-all"',
  'className={`flex items-center justify-center gap-2 w-full py-2 text-xs font-medium rounded-lg transition-all ${isDark ? "text-indigo-400 hover:text-indigo-300 hover:bg-white/5" : "text-indigo-600 hover:text-indigo-700 hover:bg-black/5"}`}'
);

fs.writeFileSync(file, content);
console.log('Update complete.');
