# 🐳 Docker Complete Theory Guide

**Comprehensive Docker Concepts & Best Practices**  
**From Beginner to Advanced**  
**Last Updated:** December 2024

---

## Table of Contents

1. [Docker Architecture](#1-docker-architecture)
2. [Images vs Containers](#2-images-vs-containers)
3. [Docker Registry & Docker Hub](#3-docker-registry--docker-hub)
4. [Dockerfile Instructions](#4-dockerfile-instructions)
5. [.dockerignore File](#5-dockerignore-file)
6. [Multi-stage Builds](#6-multi-stage-builds)
7. [Best Practices](#7-best-practices)

---

## 1️⃣ Docker Architecture

### 🏗️ High-Level Overview

Docker uses **client-server architecture**. Here's the complete picture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         REST API          ┌─────────────┐ │
│  │              │◄────────────────────────►  │             │ │
│  │ Docker CLI   │                            │   Docker    │ │
│  │  (client)    │      Unix Socket/TCP       │   Daemon    │ │
│  │              │                            │  (dockerd)  │ │
│  └──────────────┘                            └─────────────┘ │
│                                                      │        │
│                              ┌───────────────────────┴───────┐│
│                    ┌─────────▼─────────┐         ┌──────────▼┴─────────┐
│                    │     Images        │         │    Containers       │
│                    │  (read-only)      │         │   (running)         │
│                    └───────────────────┘         └─────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

### 🧩 Core Components

#### 1. Docker Client (CLI)

The **Docker CLI** is the primary way users interact with Docker.

```bash
docker run nginx
docker build -t myapp .
docker ps
```

**Key Points:**
- Sends commands to Docker daemon via REST API
- Can connect to local or remote daemons
- Multiple clients can connect to one daemon

---

#### 2. Docker Daemon (dockerd)

The **Docker Daemon** is a background service that manages everything.

**Responsibilities:**
- Build images
- Pull/push images to registry
- Create and manage containers
- Manage networks and volumes
- Handle container lifecycle

---

#### 3. Docker Images

**Image** = Read-only template with instructions to create a container

**Image Layers:**
```
┌─────────────────────────────────┐
│  Application Layer (writable)   │  ← Container runtime
├─────────────────────────────────┤
│  CMD ["node", "app.js"]         │  ← Layer 5
├─────────────────────────────────┤
│  COPY . /app                    │  ← Layer 4
├─────────────────────────────────┤
│  RUN npm install                │  ← Layer 3
├─────────────────────────────────┤
│  WORKDIR /app                   │  ← Layer 2
├─────────────────────────────────┤
│  FROM node:20-alpine            │  ← Layer 1 (Base)
└─────────────────────────────────┘
```

**Layer Caching:**
- Each instruction creates a layer
- Layers are cached
- If instruction unchanged → reuse cache
- If instruction changed → rebuild from that layer

---

#### 4. Docker Containers

**Container** = Runnable instance of an image

**Lifecycle:**
```
Image → Created → Running → Stopped → Deleted
```

**Key Characteristics:**
- Isolated process environment
- Ephemeral (temporary)
- Has writable layer on top of image
- Portable across environments

---

## 2️⃣ Images vs Containers

### 📦 Docker Image

**Analogy:** Image = Class in programming

**Characteristics:**
- **Immutable** - cannot be changed after build
- **Layered** - built from multiple layers
- **Reusable** - one image → many containers
- **Versionable** - has tags (v1.0, latest, etc.)

**Common Commands:**
```bash
docker images              # List images
docker pull nginx:latest   # Download image
docker build -t myapp:v1 . # Build image
docker rmi myapp:v1        # Remove image
docker history myapp:v1    # View layers
```

---

### 🏃 Docker Container

**Analogy:** Container = Object/Instance in programming

**Characteristics:**
- **Ephemeral** - can be deleted and recreated
- **Isolated** - runs in isolated environment
- **Writable** - has temporary writable layer
- **Stateful** - has runtime state

**Common Commands:**
```bash
docker ps                  # List running containers
docker ps -a               # List all containers
docker run -d nginx        # Create and start
docker stop mycontainer    # Stop container
docker rm mycontainer      # Remove container
docker logs mycontainer    # View logs
docker exec -it mycontainer bash  # Enter container
```

---

### 🔄 Key Differences

| Aspect | Image | Container |
|--------|-------|-----------|
| **Nature** | Template | Running instance |
| **State** | Immutable | Mutable |
| **Lifecycle** | Persistent | Ephemeral |
| **Storage** | Read-only layers | Layers + writable layer |
| **Reusability** | 1 image → many containers | Each container is unique |
| **Creation** | `docker build` | `docker run` |

### Example: One Image, Multiple Containers

```bash
# Build image once
docker build -t myapp:v1 .

# Create multiple containers from same image
docker run -d --name app-dev -p 3001:3000 myapp:v1
docker run -d --name app-test -p 3002:3000 myapp:v1
docker run -d --name app-prod -p 3003:3000 myapp:v1

# All use same image but run independently
```

---

## 3️⃣ Docker Registry & Docker Hub

### 🌐 What is Docker Registry?

**Registry** = Storage and distribution system for Docker images

Think of it like:
- GitHub for code → Docker Hub for images
- npm for packages → Docker Hub for containers

---

### 🏢 Docker Hub

**Docker Hub** = Default public registry (https://hub.docker.com)

**Image Naming:**
```
[registry/][namespace/]repository[:tag]

Examples:
nginx                          # Official (library/nginx:latest)
nginx:1.25                     # Specific version
username/myapp:v1.0.0         # User's image
company/api:latest             # Organization
docker.io/library/postgres:15  # Full path
```

---

### 🔐 Working with Registry

```bash
# Login
docker login

# Tag image
docker tag myapp:v1 username/myapp:v1

# Push to registry
docker push username/myapp:v1

# Pull from registry
docker pull username/myapp:v1

# Search images
docker search nginx
```

---

### 🏷️ Image Tags

**Common Tag Conventions:**
```bash
myapp:1.0.0          # Version
myapp:latest         # Latest stable
myapp:dev            # Environment
myapp:1.0.0-alpine   # Variant
myapp:arm64          # Architecture
```

**Important:** Always use specific versions in production!

```bash
# ❌ Bad - unpredictable
FROM node:latest

# ✅ Good - specific version
FROM node:20.10.0-alpine
```

---

### 📊 Official vs Community Images

**Official Images:**
- ✓ Curated by Docker, Inc.
- ✓ No username prefix
- ✓ Examples: `nginx`, `postgres`, `node`

**Community Images:**
- Created by users/companies
- Has username prefix
- Use with caution

---

## 4️⃣ Dockerfile Instructions

### 📄 What is Dockerfile?

Text file with instructions to build Docker image.

**Basic Format:**
```dockerfile
# Comment
INSTRUCTION arguments
```

---

### 🏗️ Essential Instructions

#### FROM - Base Image

```dockerfile
# Official image
FROM node:20

# Specific version (recommended)
FROM node:20.10.0-alpine

# Multi-stage
FROM node:20 AS builder
```

**Best Practice:** Always use specific versions

---

#### WORKDIR - Set Working Directory

```dockerfile
WORKDIR /app

# All subsequent commands run in /app
COPY . .
RUN npm install
```

---

#### COPY - Copy Files

```dockerfile
# Copy files
COPY package.json /app/

# Copy directory
COPY src/ /app/src/

# Copy everything (respect .dockerignore)
COPY . .

# With ownership
COPY --chown=node:node . .
```

**Best Practice:** Copy package files before source code

```dockerfile
# ✅ Good - leverage cache
COPY package*.json ./
RUN npm install
COPY . .
```

---

#### RUN - Execute Commands

```dockerfile
# Shell form
RUN apt-get update && apt-get install -y nginx

# Exec form
RUN ["npm", "install"]

# Chain commands (single layer)
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

**Best Practice:** Chain commands and cleanup in same layer

---

#### CMD - Default Command

```dockerfile
# Exec form (preferred)
CMD ["node", "server.js"]

# Shell form
CMD node server.js
```

**Important:** 
- Only last CMD is used
- Can be overridden: `docker run myimage custom-command`

---

#### EXPOSE - Document Ports

```dockerfile
# Single port
EXPOSE 3000

# Multiple ports
EXPOSE 80 443

# With protocol
EXPOSE 8080/tcp
```

**Note:** This is documentation only. Actual publishing:
```bash
docker run -p 3000:3000 myapp
```

---

#### ENV - Environment Variables

```dockerfile
# Single variable
ENV NODE_ENV=production

# Multiple variables
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info
```

**Override at runtime:**
```bash
docker run -e NODE_ENV=development myapp
```

---

#### ARG - Build Arguments

```dockerfile
# With default
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}

# Without default
ARG VERSION
LABEL version=${VERSION}
```

**Pass at build:**
```bash
docker build --build-arg NODE_VERSION=18 .
```

**ARG vs ENV:**
- ARG = Build time only
- ENV = Build + Runtime

---

#### USER - Set User

```dockerfile
# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Run subsequent commands as nodejs user
COPY --chown=nodejs:nodejs . .
CMD ["node", "server.js"]
```

**Security Best Practice:** Always run as non-root

---

#### HEALTHCHECK - Container Health

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

### 📋 Complete Dockerfile Example

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
EXPOSE 3000
HEALTHCHECK CMD node healthcheck.js || exit 1
CMD ["node", "dist/server.js"]
```

---

## 5️⃣ .dockerignore File

### 📄 What is .dockerignore?

File specifying what to **exclude** from Docker build context.

**Why Important?**
- ✅ Faster builds
- ✅ Smaller images
- ✅ Better security
- ✅ Cleaner builds

---

### 📝 Basic Syntax

```bash
# Exclude file
secrets.txt

# Exclude directory
node_modules/
.git/

# Wildcard
*.log
**/*.test.js

# Exception (don't exclude)
!important.log
```

---

### 🎯 Complete Example

```bash
# .dockerignore

# ============================================
# Version Control
# ============================================
.git/
.gitignore

# ============================================
# Dependencies
# ============================================
node_modules/
npm-debug.log

# ============================================
# Build Outputs
# ============================================
dist/
build/
.next/

# ============================================
# Environment Files
# ============================================
.env
.env.*
!.env.example

# ============================================
# IDE Files
# ============================================
.vscode/
.idea/
*.swp
.DS_Store

# ============================================
# Testing
# ============================================
coverage/
test/
*.test.js
*.spec.js

# ============================================
# Documentation
# ============================================
README.md
docs/
*.md
!API.md

# ============================================
# CI/CD
# ============================================
.github/
.gitlab-ci.yml

# ============================================
# Docker
# ============================================
Dockerfile
docker-compose.yml
.dockerignore

# ============================================
# Logs
# ============================================
logs/
*.log

# ============================================
# Temporary Files
# ============================================
tmp/
*.tmp
*.cache
```

---

### 🎨 Project-Specific Examples

**Node.js:**
```bash
node_modules/
npm-debug.log
dist/
.env
*.test.js
```

**Python:**
```bash
__pycache__/
*.pyc
venv/
.pytest_cache/
.env
```

**React:**
```bash
node_modules/
.next/
build/
.env.local
.eslintcache
```

---

## 6️⃣ Multi-stage Builds

### 🎯 What are Multi-stage Builds?

Multiple `FROM` statements in one Dockerfile.

**Benefits:**
- ✅ Smaller final images
- ✅ Separate build and runtime dependencies
- ✅ Better security
- ✅ No manual cleanup needed

---

### 📊 Single-stage vs Multi-stage

#### ❌ Single-stage (Bad)

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install  # Includes devDependencies
COPY . .
RUN npm run build

# Final image contains:
# - Source code
# - Dev dependencies
# - Build tools
# Result: ~500MB
CMD ["node", "dist/server.js"]
```

---

#### ✅ Multi-stage (Good)

```dockerfile
# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Final image contains ONLY:
# - Compiled output
# - Production dependencies
# Result: ~150MB
CMD ["node", "dist/server.js"]
```

**Result: 3x smaller!** 🎉

---

### 🏗️ Common Patterns

#### Pattern 1: Build + Runtime (Node.js)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

---

#### Pattern 2: Compile + Runtime (Go)

```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server

# Stage 2: Runtime
FROM alpine:3.18
COPY --from=builder /app/server /server
CMD ["/server"]
```

**Result:** ~10MB instead of 300MB+

---

#### Pattern 3: Development vs Production

```dockerfile
# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 2: Development
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage 3: Build
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Stage 4: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**Build specific target:**
```bash
docker build --target development -t myapp:dev .
docker build --target production -t myapp:prod .
```

---

### 📊 Size Comparison

**React App Example:**

```bash
# Single-stage: ~1.2 GB
FROM node:20
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Multi-stage: ~25 MB
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
```

**48x smaller!** 🚀

---

## 7️⃣ Best Practices

### 🎯 Essential Best Practices

#### 1. Use Specific Versions

```dockerfile
# ❌ Bad
FROM node

# ✅ Good
FROM node:20.10.0-alpine
```

---

#### 2. Minimize Layers

```dockerfile
# ❌ Bad - 3 layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ Good - 1 layer
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

---

#### 3. Leverage Build Cache

```dockerfile
# ❌ Bad
COPY . .
RUN npm install

# ✅ Good
COPY package*.json ./
RUN npm ci
COPY . .
```

---

#### 4. Use .dockerignore

```bash
# .dockerignore
node_modules/
.git/
*.md
.env
```

---

#### 5. Run as Non-Root

```dockerfile
# ❌ Bad
FROM node:20
COPY . /app
CMD ["node", "server.js"]

# ✅ Good
FROM node:20
RUN adduser --system nodejs
USER nodejs
COPY --chown=nodejs . /app
CMD ["node", "server.js"]
```

---

#### 6. Use Multi-stage Builds

```dockerfile
FROM node:20 AS builder
RUN npm run build

FROM node:20-alpine
COPY --from=builder /app/dist ./dist
```

---

#### 7. Use Alpine Images

```dockerfile
FROM node:20-alpine  # ~40MB
# vs
FROM node:20         # ~900MB
```

---

#### 8. Add Health Checks

```dockerfile
HEALTHCHECK CMD curl -f http://localhost/health || exit 1
```

---

#### 9. Clean Up in Same Layer

```dockerfile
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

---

#### 10. Don't Store Secrets

```dockerfile
# ❌ Bad
ENV API_KEY=secret123

# ✅ Good - pass at runtime
docker run -e API_KEY=secret123 myapp
```

---

### 🔒 Security Checklist

- ✅ Use official base images
- ✅ Run as non-root user
- ✅ Don't store secrets in image
- ✅ Keep images updated
- ✅ Scan for vulnerabilities
- ✅ Use specific versions
- ✅ Minimize attack surface

---

### 📦 Size Optimization

- ✅ Use Alpine variants
- ✅ Use multi-stage builds
- ✅ Remove dev dependencies
- ✅ Clean package manager caches
- ✅ Use .dockerignore

---

## 📚 Quick Reference

### Dockerfile Instructions

| Instruction | Purpose |
|-------------|---------|
| `FROM` | Base image |
| `WORKDIR` | Set working directory |
| `COPY` | Copy files |
| `RUN` | Execute command (build time) |
| `CMD` | Default command (runtime) |
| `EXPOSE` | Document port |
| `ENV` | Environment variable |
| `ARG` | Build argument |
| `USER` | Set user |
| `HEALTHCHECK` | Health check |

### Common Commands

```bash
# Build
docker build -t myapp:v1 .

# Run
docker run -d -p 3000:3000 myapp:v1

# Manage
docker ps
docker logs myapp
docker stop myapp

# Registry
docker push myapp:v1
docker pull myapp:v1
```

---

## 🎓 Learning Checklist

- [ ] Understand Docker architecture
- [ ] Know difference between images and containers
- [ ] Understand Docker Hub
- [ ] Write Dockerfiles
- [ ] Use .dockerignore
- [ ] Implement multi-stage builds
- [ ] Apply security best practices
- [ ] Optimize image size

---

**End of Guide** 🎉

**Version:** 1.0  
**Last Updated:** December 2024

*Happy Dockerizing!* 🐳
