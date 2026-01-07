import { type Project, type BlogPost } from "@shared/schema";
import { siteConfig } from "@shared/config";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createProject(project: Partial<Project>): Promise<Project>;
  createBlogPost(post: Partial<BlogPost>): Promise<BlogPost>;
  clearProjects(): Promise<void>;
  clearBlogPosts(): Promise<void>;
}

export class MemStorage implements IStorage {
  private projects: Project[];
  private blogPosts: BlogPost[];

  constructor() {
    this.projects = siteConfig.projects.map((p, i) => ({ ...p, id: i + 1 }));
    this.blogPosts = siteConfig.blogPosts.map((p, i) => ({ 
      ...p, 
      id: i + 1,
      publishedAt: new Date()
    }));
  }

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find(post => post.slug === slug);
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const newProject = { ...project, id: this.projects.length + 1 } as Project;
    this.projects.push(newProject);
    return newProject;
  }

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const newPost = { 
      ...post, 
      id: this.blogPosts.length + 1,
      publishedAt: new Date()
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
}

export const storage = new MemStorage();
