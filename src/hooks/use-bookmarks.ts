// src/hooks/use-bookmarks.ts
"use client";

import { useState, useEffect } from 'react';
import { getBrowserStorage } from '@/lib/browser-storage';

const BOOKMARKS_KEY = 'blog-bookmarks';

export function useBookmarks(): [string[], (slug: string) => void, (slug: string) => void] {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedBookmarks = getBrowserStorage()?.getItem(BOOKMARKS_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error);
    }
  }, []);

  const addBookmark = (slug: string) => {
    const newBookmarks = [...bookmarks, slug];
    setBookmarks(newBookmarks);
    getBrowserStorage()?.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const removeBookmark = (slug: string) => {
    const newBookmarks = bookmarks.filter((b) => b !== slug);
    setBookmarks(newBookmarks);
    getBrowserStorage()?.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  return [bookmarks, addBookmark, removeBookmark];
}
