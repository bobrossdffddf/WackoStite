import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull(),
  status: text("status").notNull(), // "In progress", "Actively experimenting", "More details soon"
  link: text("link"),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertBlogPostSchema = createInsertSchema(blogPosts);

export type Project = typeof projects.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
