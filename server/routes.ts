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

  // Seed data from config
  const projects = await storage.getProjects();
  if (projects.length === 0) {
    for (const project of siteConfig.projects) {
      await storage.createProject(project);
    }
  }

  const posts = await storage.getBlogPosts();
  if (posts.length === 0) {
    for (const post of siteConfig.blogPosts) {
      await storage.createBlogPost(post);
    }
  }

  return httpServer;
}
