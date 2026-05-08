const fs = require('fs');
const file = 'src/components/sections/testimonials.tsx';
let d = fs.readFileSync(file, 'utf8');

// Add generic useEffect import if not there
if (d.indexOf('useEffect') === -1) {
  d = d.replace('import { motion }', 'import React, { useEffect, useRef } from "react";\nimport { motion }');
}

// Add the auto-scroll logic inside the component
if (d.indexOf('const scrollRef = useRef') === -1) {
  d = d.replace('export function Testimonials() {', 'export function Testimonials() {\n  const scrollRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      if (scrollRef.current) {\n        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;\n        if (scrollLeft + clientWidth >= scrollWidth - 10) {\n          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });\n        } else {\n          scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });\n        }\n      }\n    }, 3000);\n    return () => clearInterval(interval);\n  }, []);\n');
  
  // Attach ref
  d = d.replace('className="flex overflow-x-auto', 'ref={scrollRef}\n          className="flex overflow-x-auto');
}

fs.writeFileSync(file, d);
