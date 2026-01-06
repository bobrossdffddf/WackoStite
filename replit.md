# Wacko's Personal Website - Project Documentation

## Overview
A technical, builder-focused personal website for Wacko, highlighting self-hosting, infrastructure, and experimental projects.

## Project Structure
- `shared/schema.ts`: Database models for Projects and Blog Posts.
- `server/storage.ts`: Data access layer for CRUD operations.
- `server/routes.ts`: API endpoints and initial seed data.
- `client/src/`: Frontend React application.

## How to Edit and Create Content

### The Content Config File
I've created a central place for you to edit everything: `shared/config.ts`.
Go there to change:
- Your identity/name
- Skills and Interests
- Projects (titles, descriptions, status)
- Blog Posts

### Applying Changes
1. Edit `shared/config.ts`.
2. The app will automatically restart and pick up your changes for the initial setup. 
3. Note: If you've already started the app and data is in the database, you might need to clear the database tables to re-seed from the config, or I can help you add a "Refresh Content" button later.

### Project Status
In the config, use these exact strings for status:
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
