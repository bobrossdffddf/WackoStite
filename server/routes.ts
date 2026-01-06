import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { siteConfig } from "@shared/config";

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

  // Re-sync logic: Only clear and re-seed if data is missing or out of sync
  const currentProjects = await storage.getProjects();
  const currentPosts = await storage.getBlogPosts();

  // Simple check: if counts match, assume sync is okay for now
  // In a more robust app, we'd check a version or hash
  if (currentProjects.length !== siteConfig.projects.length || 
      currentPosts.length !== siteConfig.blogPosts.length) {
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
