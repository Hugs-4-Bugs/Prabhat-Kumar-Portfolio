
"use client";

import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'prabhatverse-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to parse bookmarks from localStorage", error);
      setBookmarks([]);
    }
  }, []);

  const toggleBookmark = useCallback((blogId: number) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(blogId)) {
        newBookmarks.delete(blogId);
      } else {
        newBookmarks.add(blogId);
      }
      const updatedBookmarks = Array.from(newBookmarks);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  }, []);

  return { bookmarks, toggleBookmark };
}
