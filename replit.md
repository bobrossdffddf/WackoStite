# Wacko's Personal Website - Project Documentation

## Overview
A technical, builder-focused personal website for Wacko, highlighting self-hosting, infrastructure, and experimental projects.

## Project Structure
- `shared/schema.ts`: Database models for Projects and Blog Posts.
- `server/storage.ts`: Data access layer for CRUD operations.
- `server/routes.ts`: API endpoints and initial seed data.
- `client/src/`: Frontend React application.

## How to Edit and Create Content

### Creating New Blog Posts
To add or edit blog posts, modify the `seedDatabase` logic in `server/routes.ts`. 
1. Open `server/routes.ts`.
2. Locate the `if (posts.length === 0)` block or add new `storage.createBlogPost` calls.
3. The blog is currently read-only and populated via the backend storage layer.

### Modifying Projects
1. Open `server/routes.ts`.
2. Locate the `if (projects.length === 0)` block.
3. Add or update `storage.createProject` calls with the desired title, description, tags, and status.

### Status Placeholders for Projects
Allowed statuses:
- `In progress`
- `Actively experimenting`
- `More details soon`

## Design & Aesthetics
- **Palette**: Dark/Neutral.
- **Typography**: Space Grotesk (Sans) and JetBrains Mono (Mono).
- **Animations**: Framer Motion is used for smooth transitions.

## User Preferences
- **Identity**: Wacko (No real names).
- **Tone**: Honest, Direct, Builder-focused.
- **Rules**: Read-only blog, no admin panel, no fabrication of details.
