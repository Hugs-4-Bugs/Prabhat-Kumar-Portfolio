// src/components/error-boundary.tsx
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary — wraps dynamic sections so they fail silently.
 * Catches render-time errors without breaking the rest of the page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development only (won't surface in prod)
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[ErrorBoundary] Section "${this.props.sectionName ?? "unknown"}" crashed:`,
        error,
        info
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // Render nothing (or optional fallback) — section silently disappears
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
