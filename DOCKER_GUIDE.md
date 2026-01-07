# Self-Hosting Guide (Debian 13)

Follow these steps to host your portfolio website on a Debian 13 server using Docker.

## Prerequisites

- Debian 13 (Bookworm)
- Root or sudo access

## Step-by-Step Deployment

### 1. Preparation
Connect to your server via SSH and ensure you are in the directory where you want to host the app.

### 2. Run the Docker Helper Script
We have provided a `deploy.sh` script that automates the installation of Docker, Node.js, and the setup of your application.

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
sudo ./deploy.sh
```

### 3. Manual Steps (If not using the script)

If you prefer to run commands manually:

**Install Dependencies:**
```bash
apt update
apt install -y git curl build-essential docker.io docker-compose
```

**Clone and Build:**
```bash
git clone <your-repo-url>
cd <repo-folder>
docker-compose up -d --build
```

### 4. Verification
Your app will be running at `http://<YOUR_SERVER_IP>:5000`.

## Logging and Management

- **View Logs:** `docker-compose logs -f`
- **Restart App:** `docker-compose restart`
- **Stop App:** `docker-compose down`

The application uses **PM2** inside the container to ensure fast startup and process stability.
