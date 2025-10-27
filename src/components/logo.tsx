// src/components/logo.tsx
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="#home" className="flex items-center gap-2" data-cursor-hover>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
      >
        <path
          d="M25,20 L25,80"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M25,50 C45,30 45,30 60,20"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
         <path
          d="M45,50 L75,80"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-headline text-xl font-bold tracking-tighter hidden sm:inline-block">
        Prabhat Kumar
      </span>
    </Link>
  );
}
