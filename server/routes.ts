import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { siteConfig } from "@shared/config";
import { db } from "./db";
import { projects, blogPosts } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.blog.list.path, async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get(api.blog.get.path, async (req, res) => {
    const post = await storage.getBlogPost(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Re-sync logic: Only clear and re-seed if counts change
  const projectCount = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const postCount = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);

  if (Number(projectCount[0].count) !== siteConfig.projects.length || 
      Number(postCount[0].count) !== siteConfig.blogPosts.length) {
    console.log("Syncing database with config...");
    await storage.clearProjects();
    await storage.clearBlogPosts();

    for (const project of siteConfig.projects) {
      await storage.createProject(project);
    }

    for (const post of siteConfig.blogPosts) {
      await storage.createBlogPost(post);
    }
    console.log("Sync complete.");
  }

  return httpServer;
}
