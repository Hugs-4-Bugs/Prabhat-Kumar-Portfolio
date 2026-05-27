import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center mb-12 md:mb-16", className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-center relative">
        {children}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-primary rounded-full"></span>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/4 h-1 bg-accent rounded-full animate-pulse"></span>
      </h2>
    </div>
  );
}
