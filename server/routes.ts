import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

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

  // Seed data
  const projects = await storage.getProjects();
  if (projects.length === 0) {
    await storage.createProject({
      title: "Home Server Infrastructure",
      description: "A complete overhaul of my home lab using Proxmox and Docker containers for media, storage, and automation.",
      tags: ["Docker", "Proxmox", "Linux"],
      status: "In progress",
      link: "#"
    });
    await storage.createProject({
      title: "Custom Discord Bot",
      description: "A utility bot for managing server roles and automating welcome messages using the latest Discord.js features.",
      tags: ["Node.js", "TypeScript", "Discord.js"],
      status: "Actively experimenting",
      link: "#"
    });
    await storage.createProject({
      title: "Self-Hosted Cloud Storage",
      description: "Setting up a private Nextcloud instance to replace Google Drive, focusing on privacy and data sovereignty.",
      tags: ["Nextcloud", "Docker"],
      status: "More details soon",
      link: "#"
    });
  }

  const posts = await storage.getBlogPosts();
  if (posts.length === 0) {
    await storage.createBlogPost({
      title: "Why I Self-Host Everything",
      slug: "why-i-self-host",
      excerpt: "Ownership of data is more important than convenience.",
      content: "Ownership of data is more important than convenience. In this post, I explore the trade-offs between using SaaS products and hosting your own alternatives. It's not just about privacy; it's about learning how things work under the hood.",
    });
    await storage.createBlogPost({
      title: "My Docker Workflow",
      slug: "my-docker-workflow",
      excerpt: "Streamlining deployments with docker-compose and bash scripts.",
      content: "I used to deploy everything manually. Then I discovered Docker. Here is how I structure my docker-compose files and use simple bash scripts to automate updates and backups.",
    });
    await storage.createBlogPost({
      title: "Recovering from a Failed Deploy",
      slug: "recovering-failed-deploy",
      excerpt: "Lessons learned when production went down at 3 AM.",
      content: "It happens to everyone. You push a change, and suddenly nothing works. This is the story of how I broke my reverse proxy and the steps I took to troubleshoot and fix it.",
    });
  }

  return httpServer;
}
