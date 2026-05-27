"use client";

import { useEffect } from "react";

export function SeoTitleSync({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
