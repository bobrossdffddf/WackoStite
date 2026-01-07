import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  status: z.string(),
  link: z.string().optional().nullable(),
});

export const blogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  publishedAt: z.date().optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;

export const insertProjectSchema = projectSchema.omit({ id: true });
export const insertBlogPostSchema = blogPostSchema.omit({ id: true });
