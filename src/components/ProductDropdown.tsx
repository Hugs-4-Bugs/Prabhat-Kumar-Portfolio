"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";

import { productLinks } from "@/lib/product-links";
import { cn } from "@/lib/utils";

type ProductDropdownProps = {
  mobile?: boolean;
  onSelect?: () => void;
};

export function ProductDropdown({ mobile = false, onSelect }: ProductDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const close = () => {
    setOpen(false);
    onSelect?.();
  };

  const focusItem = (index: number) => itemRefs.current[index]?.focus();

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const handleItemKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem((index + 1) % productLinks.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem((index - 1 + productLinks.length) % productLinks.length);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const renderItem = (item: typeof productLinks[number], index: number, compact = false) => {
    const Icon = item.icon;
    const isActive = !item.external && pathname === item.href;
    const className = cn(
      "group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:outline-none",
      isActive && "bg-primary/10 text-primary"
    );
    const content = (
      <>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            {item.label}
            {item.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
          </span>
          {!compact && <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>}
        </span>
        <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {item.status}
        </span>
      </>
    );

    return item.external ? (
      <a
        key={item.href}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={close}
        onKeyDown={(event) => handleItemKeyDown(event, index)}
      >
        {content}
      </a>
    ) : (
      <Link
        key={item.href}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        href={item.href}
        className={className}
        onClick={close}
        onKeyDown={(event) => handleItemKeyDown(event, index)}
      >
        {content}
      </Link>
    );
  };

  if (mobile) {
    return (
      <div className="w-full max-w-sm px-4 text-center">
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md text-lg transition-colors hover:text-primary"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={handleTriggerKeyDown}
        >
          Products
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 grid gap-1 rounded-lg border bg-background/90 p-2 shadow-lg">
                {productLinks.map((item, index) => renderItem(item, index, true))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 transition-colors hover:text-primary",
          productLinks.some((item) => !item.external && pathname === item.href) && "text-primary"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        data-cursor-hover
      >
        Products
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-4 w-[360px] -translate-x-1/2 rounded-xl border bg-background/95 p-2 shadow-xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40"
            role="menu"
          >
            <div className="grid gap-1">
              {productLinks.map((item, index) => renderItem(item, index))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
