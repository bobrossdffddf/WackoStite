import { z } from 'zod';
import { projectSchema, blogPostSchema } from './schema';

export const api = {
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(projectSchema),
      },
    },
  },
  blog: {
    list: {
      method: 'GET' as const,
      path: '/api/blog',
      responses: {
        200: z.array(blogPostSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/blog/:slug',
      responses: {
        200: blogPostSchema,
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
