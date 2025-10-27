// src/components/logo.tsx
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="#home"
      className="font-headline text-xl font-bold tracking-tighter"
      data-cursor-hover
    >
      PK<span className="text-primary">_</span>
    </Link>
  );
}
