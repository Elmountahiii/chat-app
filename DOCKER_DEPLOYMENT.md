# Docker Deployment Guide

This guide explains how to deploy the chat application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2
- At least 2GB available RAM
- Ports 80, 443, 3000, 3001, and 27017 available

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/elmountahi/development/personal/chat_app
   ```

2. **Create environment file:**
   ```bash
   cp .env.template .env
   # Edit .env with your preferred settings
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the application:**
   - Frontend: http://localhost (via Nginx)
   - Backend API: http://localhost/api
   - Direct Frontend: http://localhost:3000
   - Direct Backend: http://localhost:3001
   - MongoDB: localhost:27017

## Architecture Overview

```
Internet -> Nginx (Port 80) -> Frontend (Port 3000) & Backend (Port 3001) -> MongoDB (Port 27017)
```

### Services:

1. **nginx**: Reverse proxy and load balancer
   - Routes `/` to frontend
   - Routes `/api/` to backend  
   - Routes `/socket.io/` to backend for WebSocket connections

2. **chat-frontend**: Next.js application
   - Standalone build for optimal performance
   - Supports SSR and client-side routing

3. **chat-backend**: Node.js/Express API server
   - RESTful API endpoints
   - WebSocket support via Socket.IO
   - JWT authentication

4. **mongodb**: Database server
   - Persistent data storage
   - Initialized with custom scripts

## Environment Variables

Copy `.env.template` to `.env` and customize:

```env
# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=secure_password_here
MONGO_DB=chatapp

# Backend
JWT_SECRET=your-secure-jwt-secret-here
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Commands

### Development
```bash
# Start all services in development mode
docker-compose up --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f chat-backend
```

### Production
```bash
# Start services in background
docker-compose up --build -d

# Stop all services
docker-compose down

# Stop and remove volumes (data loss!)
docker-compose down -v
```

### Maintenance
```bash
# Rebuild specific service
docker-compose build chat-frontend
docker-compose up -d chat-frontend

# Scale services (if needed)
docker-compose up -d --scale chat-backend=2

# Check service health
docker-compose ps
```

## Health Checks

All services include health checks:
- **MongoDB**: Database connectivity test
- **Backend**: HTTP endpoint check
- **Frontend**: HTTP endpoint check  
- **Nginx**: HTTP endpoint check

Check status:
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using ports
   lsof -i :80
   lsof -i :3000
   lsof -i :3001
   lsof -i :27017
   ```

2. **Permission issues:**
   ```bash
   # Fix Docker permissions on macOS/Linux
   sudo chown -R $USER:$USER .
   ```

3. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Database connection issues:**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Verify MongoDB is accessible
   docker-compose exec mongodb mongosh --username admin --password password
   ```

5. **Frontend/Backend communication:**
   ```bash
   # Check if backend is responding
   curl http://localhost:3001/health
   
   # Check if frontend is responding  
   curl http://localhost:3000
   ```

### Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs chat-backend
docker-compose logs chat-frontend
docker-compose logs mongodb
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f
```

### Network Issues

```bash
# Inspect network
docker network inspect chat_app_chat_network

# Test connectivity between services
docker-compose exec chat-backend ping chat-frontend
docker-compose exec chat-frontend ping mongodb
```

## Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets**
3. **Enable HTTPS** with SSL certificates
4. **Restrict network access** with firewalls
5. **Keep Docker images updated**

## Performance Optimization

1. **Resource Limits**: Add resource limits to docker-compose.yml
2. **Caching**: Nginx serves static files efficiently
3. **Database**: Configure MongoDB for your workload
4. **Monitoring**: Add health checks and monitoring

## Backup

```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --username admin --password password --authenticationDatabase admin --out /backup

# Copy backup from container
docker cp mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)
```

## Updates

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up --build -d
```