// src/lib/blogs.ts
import data from './blogs.json';
import type { Blog } from './types';

const blogs = data.blogs as Array<{
  slug: string;
  title: string;
  description: string;
  tag: 'Paid' | 'Free';
  date: string;
  category: 'Technical' | 'Non-Technical' | 'Books';
  subCategory: string;
  content: string;
}>;

export const blogData: Blog[] = blogs.map((blog) => ({
  ...blog,
  subcategory: blog.subCategory,
}));
