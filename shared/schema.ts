import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  status: z.string(),
  link: z.string().optional().nullable(),
});

export const blogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  publishedAt: z.coerce.date().optional(),
});

export const roomSchema = z.object({
  id: z.string(), // 4-letter code
  createdAt: z.coerce.date(),
  hostId: z.string(), // Session/User ID
  isClosed: z.boolean().default(false),
});

export const messageSchema = z.object({
  id: z.number(),
  roomId: z.string(),
  content: z.string(),
  type: z.enum(["text", "image", "video"]).default("text"),
  createdAt: z.coerce.date(),
});

export const banSchema = z.object({
  id: z.number(),
  roomId: z.string(),
  userId: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type Room = z.infer<typeof roomSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Ban = z.infer<typeof banSchema>;

export const insertProjectSchema = projectSchema.omit({ id: true });
export const insertBlogPostSchema = blogPostSchema.omit({ id: true });
export const insertRoomSchema = roomSchema;
export const insertMessageSchema = messageSchema.omit({ id: true });
