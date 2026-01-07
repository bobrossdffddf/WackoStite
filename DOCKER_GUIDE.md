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

> **CRITICAL:** Use `http://` and NOT `https://`. Since there is no SSL certificate configured by default, using `https://` will cause a `ERR_SSL_PROTOCOL_ERROR`.

### Troubleshooting SSL Errors
If you see "This site can't provide a secure connection":
1. Check your browser's address bar.
2. Ensure it says `http://192.168.68.140:5000` (or your IP).
3. If it automatically redirects to `https://`, try using a Private/Incognito window or a different browser.

> **Note:** Since PM2 is running **inside** the container, commands like `pm2 list` will not work on your host machine. Instead, use Docker commands to manage the app:

- **View Logs:** `docker-compose logs -f`
- **Restart App:** `docker-compose restart`
- **Check Status:** `docker-compose ps`
- **Stop App:** `docker-compose down`
