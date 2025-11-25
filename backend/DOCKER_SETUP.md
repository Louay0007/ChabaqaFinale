# Docker Setup Guide

## Quick Start

### Build and Run
```bash
# Build the Docker image
docker-compose build

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop the application
docker-compose down
```

## What's Been Fixed

### 1. **Node Version Upgrade** (Node 18 → Node 20)
   - Your packages (NestJS 11, file-type, glob, etc.) require Node 20+
   - Updated all stages to use `node:20-alpine`

### 2. **Network Timeout Prevention**
   - Added npm configuration to handle slow/unstable connections:
     - `fetch-timeout: 300000` (5 minutes per package)
     - `fetch-retries: 5` (retry up to 5 times)
     - Retry timeout range: 20s - 120s

### 3. **Faster Builds**
   - Using `--prefer-offline` flag to use local npm cache when available
   - Fallback to fresh install if offline cache fails
   - Optimized layer caching by copying package.json first

### 4. **Simplified Multi-Stage Build**
   - Removed redundant "development" stage
   - Now using just 2 stages: builder → production
   - Smaller final image size

## Troubleshooting

### If build still times out:
```bash
# Try building with legacy npm resolver (slower but more reliable)
docker build --build-arg NPM_CONFIG_LEGACY_PEER_DEPS=true -t backend .

# Or build without cache
docker-compose build --no-cache
```

### If you have slow internet:
Consider using a local npm registry mirror or setting up Verdaccio for faster installs.

### Check if the container is running:
```bash
docker ps
```

### Access container shell for debugging:
```bash
docker exec -it chabaqa-backend sh
```

## Environment Variables

Make sure your `.env` file contains all required variables. The docker-compose.yml already mounts it automatically.

## Volumes

The following are mounted as volumes:
- `./uploads` → `/app/uploads` (persisted uploaded files)
- `./public` → `/app/public` (static files)

## Health Check

The container includes a health check at `http://localhost:3000/api/health`
- Checks every 30 seconds
- 60-second startup grace period
- 3 retries before marking as unhealthy
