# Self-Hosting Guide (Docker)

To host this application on your own server using Docker, follow these steps:

### 1. Create a `Dockerfile`
Create a file named `Dockerfile` in the root of your project:

```dockerfile
# Use Node.js 20
FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

### 2. Create a `docker-compose.yml`
Create a file named `docker-compose.yml` in the root:

```yaml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=5000
```

### 3. Build and Run
On your Debian 13 server, run:

```bash
docker compose up -d --build
```

The application will now be accessible at `http://your-server-ip:5000`.