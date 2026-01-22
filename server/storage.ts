import { type Project, type BlogPost, type Room } from "@shared/schema";
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
  createRoom(): Promise<Room>;
}

export class MemStorage implements IStorage {
  private projects: Project[];
  private blogPosts: BlogPost[];
  private rooms: Map<string, Room>;

  constructor() {
    this.projects = siteConfig.projects.map((p, i) => ({ ...p, id: i + 1 }));
    this.blogPosts = siteConfig.blogPosts.map((p, i) => ({ 
      ...p, 
      id: i + 1,
      publishedAt: new Date()
    }));
    this.rooms = new Map();
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

  async createRoom(): Promise<Room> {
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
      createdAt: new Date(),
    };
    this.rooms.set(id, room);
    return room;
  }
}

export const storage = new MemStorage();
