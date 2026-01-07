#!/bin/bash

# --- CONFIGURATION ---
APP_NAME="portfolio-app"
PORT=5000

# --- LOGGING UTILITY ---
log() {
    echo -e "\033[1;34m[$(date +'%T')] [DEPLOY] $1\033[0m"
}

error() {
    echo -e "\033[1;31m[$(date +'%T')] [ERROR] $1\033[0m"
    exit 1
}

# --- STARTUP SEQUENCE ---
log "Starting deployment sequence for Debian 13..."

# 1. Dependency Check
log "Checking for system dependencies..."
if ! [ -x "$(command -v docker)" ]; then
    log "Docker not found. Installing Docker..."
    apt-get update && apt-get install -y docker.io docker-compose || error "Failed to install Docker"
fi

if ! [ -x "$(command -v node)" ]; then
    log "Node.js not found. Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs || error "Failed to install Node.js"
fi

# 2. Build and Start
log "Building Docker images (this may take a minute on first run)..."
docker-compose build --pull || error "Docker build failed"

log "Starting application containers..."
docker-compose up -d || error "Failed to start containers"

# 3. Process Management Check
log "Checking process health..."
sleep 5
if docker-compose ps | grep -q "Up"; then
    log "SUCCESS: $APP_NAME is running on http://localhost:$PORT"
    log "To view real-time logs, run: docker-compose logs -f"
else
    error "Containers failed to start. Check 'docker-compose logs' for details."
fi

# 4. Persistence (Optional PM2 if running outside Docker, but here we use Docker restart policy)
log "Deployment complete. Application is managed by Docker with auto-restart."
