import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { blogPostSchema } from "@shared/schema";
import { z } from "zod";

// Projects Hook
export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

// Blog Hooks
export function useBlogPosts() {
  return useQuery({
    queryKey: [api.blog.list.path],
    queryFn: async () => {
      const res = await fetch(api.blog.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data = await res.json();
      return z.array(blogPostSchema).parse(data);
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: [api.blog.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.blog.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const data = await res.json();
      return blogPostSchema.parse(data);
    },
    enabled: !!slug,
  });
}
