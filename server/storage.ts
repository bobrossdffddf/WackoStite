import { projects, blogPosts, type Project, type BlogPost } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createProject(project: Partial<Project>): Promise<Project>;
  createBlogPost(post: Partial<BlogPost>): Promise<BlogPost>;
  clearProjects(): Promise<void>;
  clearBlogPosts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project as any).returning();
    return newProject;
  }

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post as any).returning();
    return newPost;
  }

  async clearProjects(): Promise<void> {
    await db.delete(projects);
  }

  async clearBlogPosts(): Promise<void> {
    await db.delete(blogPosts);
  }
}

export const storage = new DatabaseStorage();
