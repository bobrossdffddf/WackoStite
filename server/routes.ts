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

  app.post(api.projects.list.path, async (req, res) => {
    const project = await storage.createProject(req.body);
    res.json(project);
  });

  app.post(api.blog.list.path, async (req, res) => {
    const post = await storage.createBlogPost(req.body);
    res.json(post);
  });

  app.post("/api/rooms", async (req, res) => {
    const { password } = req.body;
    if (password !== "WackoDebate2026") {
      return res.status(401).json({ message: "Invalid room creation password" });
    }
    const hostId = req.headers["x-host-id"] as string;
    const room = await storage.createRoom(hostId);
    res.json(room);
  });

  app.get("/api/rooms/:id", async (req, res) => {
    const room = await storage.getRoom(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    const userId = req.headers["x-user-id"] as string || "anonymous";
    const banned = await storage.isBanned(req.params.id, userId);
    if (banned) {
      return res.status(403).json({ message: "You are banned from this room" });
    }
    
    res.json(room);
  });

  app.get("/api/rooms/:id/messages", async (req, res) => {
    const userId = req.headers["x-user-id"] as string || "anonymous";
    const banned = await storage.isBanned(req.params.id, userId);
    if (banned) {
      return res.status(403).json({ message: "You are banned" });
    }
    
    const messages = await storage.getMessages(req.params.id);
    res.json(messages);
  });

  app.post("/api/rooms/:id/messages", async (req, res) => {
    const room = await storage.getRoom(req.params.id);
    if (!room || room.isClosed) {
      return res.status(404).json({ message: "Room not found or closed" });
    }

    const hostId = req.headers["x-host-id"] as string;
    if (!hostId || room.hostId !== hostId) {
      return res.status(403).json({ message: "Only the host can post messages" });
    }

    const message = await storage.createMessage({
      roomId: req.params.id,
      content: req.body.content,
      type: req.body.type || "text",
    });
    res.json(message);
  });

  app.post("/api/rooms/:id/close", async (req, res) => {
    const room = await storage.getRoom(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const hostId = req.headers["x-host-id"] as string;
    if (!hostId || room.hostId !== hostId) {
      return res.status(403).json({ message: "Only host can close room" });
    }

    await storage.closeRoom(req.params.id);
    res.json({ success: true });
  });

  return httpServer;
}
