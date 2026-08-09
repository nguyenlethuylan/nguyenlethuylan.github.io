// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define the schema for your blog posts
const blogCollection = defineCollection({
    // Sử dụng loader thay vì type: 'content' theo chuẩn Astro mới
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(), // Enforces YYYY-MM-DD format
        categories: z.array(z.string()).optional(),
    })
});

// Export a single `collections` object to register your collection
export const collections = {
    'blog': blogCollection,
};