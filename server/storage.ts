import { type Project, type BlogPost, type Room, type Message } from "@shared/schema";
import { siteConfig } from "@shared/config";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createProject(project: Partial<Project>): Promise<Project>;
  createBlogPost(post: Partial<BlogPost>): Promise<BlogPost>;
  clearProjects(): Promise<void>;
  clearBlogPosts(): Promise<void>;
  // Room methods
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(hostId: string): Promise<Room>;
  getMessages(roomId: string): Promise<Message[]>;
  createMessage(message: Partial<Message>): Promise<Message>;
}

export class MemStorage implements IStorage {
  private projects: Project[];
  private blogPosts: BlogPost[];
  private rooms: Map<string, Room>;
  private messages: Message[];

  constructor() {
    this.projects = siteConfig.projects.map((p, i) => ({ ...p, id: i + 1 }));
    this.blogPosts = siteConfig.blogPosts.map((p, i) => ({ 
      ...p, 
      id: i + 1,
      publishedAt: new Date()
    }));
    this.rooms = new Map();
    this.messages = [];
  }

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find(post => post.slug === slug);
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const newProject = {
      ...project,
      id: this.projects.length + 1,
      tags: project.tags || [],
      status: project.status || "In progress",
      link: project.link || "#"
    } as Project;
    this.projects.push(newProject);
    return newProject;
  }

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const newPost = { 
      ...post, 
      id: this.blogPosts.length + 1,
      publishedAt: new Date(),
      slug: post.slug || (post.title ? post.title.toLowerCase().replace(/ /g, '-') : `post-${this.blogPosts.length + 1}`)
    } as BlogPost;
    this.blogPosts.push(newPost);
    return newPost;
  }

  async clearProjects(): Promise<void> {
    this.projects = [];
  }

  async clearBlogPosts(): Promise<void> {
    this.blogPosts = [];
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id.toUpperCase());
  }

  async createRoom(hostId: string): Promise<Room> {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    do {
      id = "";
      for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(id));

    const room: Room = {
      id,
      hostId,
      createdAt: new Date(),
    };
    this.rooms.set(id, room);
    return room;
  }

  async getMessages(roomId: string): Promise<Message[]> {
    return this.messages.filter(m => m.roomId === roomId.toUpperCase());
  }

  async createMessage(message: Partial<Message>): Promise<Message> {
    const newMessage: Message = {
      id: this.messages.length + 1,
      roomId: message.roomId!.toUpperCase(),
      content: message.content!,
      createdAt: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
