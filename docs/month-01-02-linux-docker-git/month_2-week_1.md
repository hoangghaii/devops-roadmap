# 🐳 Docker Fundamentals - Complete Theory Guide

**Author:** DevOps Learning Path  
**Topic:** Docker Architecture, Images, Containers, Dockerfile, Best Practices  
**Level:** Beginner to Intermediate  
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
8. [Complete Examples](#8-complete-examples)

---

## 1️⃣ Docker Architecture

### 🏗️ High-Level Overview

Docker uses a **client-server architecture**:

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│             │         │                  │         │             │
│   Docker    │────────▶│   Docker         │────────▶│   Docker    │
│   Client    │  REST   │   Daemon         │         │   Registry  │
│   (CLI)     │   API   │   (dockerd)      │         │  (Hub/etc)  │
│             │         │                  │         │             │
└─────────────┘         └──────────────────┘         └─────────────┘
                                 │
                                 │ Manages
                                 ▼
                    ┌────────────────────────┐
                    │                        │
                    │  Images & Containers   │
                    │  Networks & Volumes    │
                    │                        │
                    └────────────────────────┘
```

---

### 🔧 Components Explained

#### 1. Docker Client (CLI)

**What it is:**
- The command-line tool you use: `docker`
- User interface to Docker
- Sends commands to Docker daemon

**Examples:**
```bash
docker run nginx          # Client sends "run" command
docker build -t myapp .   # Client sends "build" command
docker ps                 # Client sends "list containers" command
```

**How it works:**
```
You type: docker run nginx
   ↓
Docker CLI processes command
   ↓
Sends REST API request to daemon
   ↓
Daemon executes command
   ↓
Result returned to CLI
   ↓
CLI displays output to you
```

---

#### 2. Docker Daemon (dockerd)

**What it is:**
- Background service running on host machine
- Does the heavy lifting
- Manages Docker objects (images, containers, networks, volumes)
- Listens for Docker API requests

**Responsibilities:**
- Building images
- Running containers
- Pulling images from registry
- Managing container lifecycle
- Networking between containers
- Volume management

**Location:**
- **macOS:** Runs inside Linux VM (Docker Desktop manages this)
- **Linux:** Runs natively on host
- **Windows:** Runs in WSL2 or Hyper-V

**Check if running:**
```bash
# Check daemon status
docker info

# View daemon logs (macOS)
# Docker Desktop → Preferences → Docker Engine
```

---

#### 3. Docker Objects

##### 📦 Images
- Read-only templates
- Blueprint for containers
- Built from Dockerfile
- Stored in layers

##### 🏃 Containers
- Runnable instance of an image
- Isolated process
- Has own filesystem, network, process tree

##### 🌐 Networks
- Connect containers together
- Isolate container communication
- Types: bridge, host, overlay, macvlan

##### 💾 Volumes
- Persistent data storage
- Survive container deletion
- Can be shared between containers

---

### 🔄 Docker Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. WRITE CODE
   ├── app.js
   ├── package.json
   └── Dockerfile

2. BUILD IMAGE
   docker build -t myapp:v1 .
   ├── Read Dockerfile
   ├── Execute instructions
   └── Create image layers

3. PUSH TO REGISTRY (optional)
   docker push username/myapp:v1
   └── Upload to Docker Hub

4. RUN CONTAINER
   docker run -p 3000:3000 myapp:v1
   ├── Pull image (if not local)
   ├── Create container
   └── Start application

5. MANAGE CONTAINER
   ├── docker ps          (list)
   ├── docker logs        (view logs)
   ├── docker stop        (stop)
   └── docker rm          (remove)
```

---

### 🎯 Complete Architecture Diagram

```
╔══════════════════════════════════════════════════════════════╗
║                        YOUR COMPUTER                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌────────────────────────────────────────────────────┐      ║
║  │           Docker Client (CLI)                      │      ║
║  │  $ docker run nginx                                │      ║
║  │  $ docker build -t myapp .                         │      ║
║  └────────────────┬───────────────────────────────────┘      ║
║                   │ REST API                                 ║
║                   ▼                                          ║
║  ┌────────────────────────────────────────────────────┐      ║
║  │           Docker Daemon (dockerd)                  │      ║
║  ├────────────────────────────────────────────────────┤      ║
║  │                                                    │      ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │      ║
║  │  │ Image    │  │ Image    │  │ Image    │          │      ║
║  │  │ nginx    │  │ node:20  │  │ myapp    │          │      ║
║  │  └──────────┘  └──────────┘  └──────────┘          │      ║
║  │                                                    │      ║
║  │  ┌─────────────────────────────────────────┐       │      ║
║  │  │        Running Containers               │       │      ║
║  │  ├─────────────────────────────────────────┤       │      ║
║  │  │  Container 1: nginx                     │       │      ║
║  │  │  - Port: 80                             │       │      ║
║  │  │  - Status: Running                      │       │      ║
║  │  ├─────────────────────────────────────────┤       │      ║
║  │  │  Container 2: myapp                     │       │      ║
║  │  │  - Port: 3000                           │       │      ║
║  │  │  - Status: Running                      │       │      ║
║  │  └─────────────────────────────────────────┘       │      ║
║  │                                                    │      ║
║  │  Networks: bridge, host, custom                    │      ║
║  │  Volumes: data-vol, logs-vol                       │      ║
║  │                                                    │      ║
║  └─────────────────┬──────────────────────────────────┘      ║
║                    │                                         ║
║                    │ Downloads Images                        ║
║                    ▼                                         ║
╚══════════════════════════════════════════════════════════════╝
                     │
                     │ Internet
                     ▼
         ┌────────────────────────┐
         │   Docker Hub Registry  │
         │  (hub.docker.com)      │
         ├────────────────────────┤
         │  - nginx               │
         │  - node                │
         │  - postgres            │
         │  - millions more...    │
         └────────────────────────┘
```

---

## 2️⃣ Images vs Containers

### 📦 Docker Images

**Definition:**
- Read-only template with instructions
- Blueprint for creating containers
- Contains everything needed to run an application

**Anatomy of an Image:**

```
Image: myapp:latest
├── Layer 5: CMD ["node", "server.js"]      ← Top layer
├── Layer 4: COPY . /app
├── Layer 3: RUN npm install
├── Layer 2: WORKDIR /app
├── Layer 1: FROM node:20-alpine            ← Base layer
```

**Key Concepts:**

1. **Layers:**
   - Each Dockerfile instruction creates a layer
   - Layers are stacked
   - Layers are cached (speeds up builds)
   - Layers are shared between images

2. **Immutable:**
   - Once built, image doesn't change
   - To update, rebuild image

3. **Versioning:**
   - Tagged with versions: `myapp:v1.0`, `myapp:v2.0`
   - `latest` tag = most recent version

**Image Commands:**

```bash
# List images
docker images
docker image ls

# Pull image from registry
docker pull nginx
docker pull nginx:1.25

# Build image
docker build -t myapp:v1 .

# Tag image
docker tag myapp:v1 myapp:latest
docker tag myapp:v1 username/myapp:v1

# Push to registry
docker push username/myapp:v1

# Remove image
docker rmi myapp:v1
docker image rm myapp:v1

# Inspect image
docker inspect nginx

# View image history (layers)
docker history nginx

# Prune unused images
docker image prune
docker image prune -a  # Remove all unused
```

---

### 🏃 Docker Containers

**Definition:**
- Running instance of an image
- Isolated environment
- Has its own filesystem, network, process tree
- Can be started, stopped, deleted

**Container Lifecycle:**

```
┌─────────────────────────────────────────────────────────┐
│                  CONTAINER LIFECYCLE                    │
└─────────────────────────────────────────────────────────┘

    CREATE                    START
       ↓                        ↓
   [Created] ──────────────▶ [Running]
                                │
                                │ STOP
                                ▼
                            [Stopped]
                                │
                                │ REMOVE
                                ▼
                            [Deleted]

   Additional Actions:
   - PAUSE/UNPAUSE (suspend/resume)
   - RESTART (stop + start)
   - KILL (force stop)
```

**Container vs Image:**

| Aspect | Image | Container |
|--------|-------|-----------|
| **Nature** | Static blueprint | Running process |
| **Mutability** | Immutable | Mutable (changes lost on delete) |
| **Storage** | Layers (read-only) | Writable layer on top |
| **Count** | One image | Multiple containers from same image |
| **Analogy** | Class (OOP) | Instance/Object |
| **Purpose** | Template | Execution environment |

**Visual Comparison:**

```
IMAGE (Blueprint)                 CONTAINERS (Instances)
┌─────────────────┐               ┌──────────────────────┐
│   nginx:latest  │               │  Container 1: web1   │
│                 │               │  - Port: 80          │
│  - Base OS      │   ─────────▶  │  - Serving site A    │
│  - Nginx binary │               └──────────────────────┘
│  - Config files │               
│  - Static files │               ┌──────────────────────┐
│                 │   ─────────▶  │  Container 2: web2   │
└─────────────────┘               │  - Port: 8080        │
                                  │  - Serving site B    │
    ONE IMAGE                     └──────────────────────┘
                                  
                                  ┌──────────────────────┐
                                  │  Container 3: web3   │
                        ─────────▶│  - Port: 8081        │
                                  │  - Serving site C    │
                                  └──────────────────────┘
                                  
                                     MANY CONTAINERS
```

**Container Commands:**

```bash
# Run container
docker run nginx
docker run -d -p 80:80 --name web nginx

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop web
docker stop abc123def456  # By ID

# Start stopped container
docker start web

# Restart container
docker restart web

# Remove container
docker rm web
docker rm -f web  # Force remove (even if running)

# View logs
docker logs web
docker logs -f web  # Follow logs

# Execute command in container
docker exec web ls /usr/share/nginx/html
docker exec -it web bash  # Interactive shell

# View container details
docker inspect web

# View resource usage
docker stats
docker stats web

# Pause/unpause
docker pause web
docker unpause web

# Copy files
docker cp file.txt web:/path/
docker cp web:/path/file.txt .

# Prune stopped containers
docker container prune
```

---

### 🎯 Real-World Example

**Scenario:** Running 3 Node.js apps from same image

```bash
# Build image once
docker build -t myapp:v1 .

# Run 3 containers from same image
docker run -d -p 3001:3000 --name app1 myapp:v1
docker run -d -p 3002:3000 --name app2 myapp:v1
docker run -d -p 3003:3000 --name app3 myapp:v1

# Result:
# - 1 image stored
# - 3 containers running
# - Each on different port
# - Each isolated from others
# - All sharing same image layers (efficient!)
```

**Storage Diagram:**

```
Disk Usage:

Image Layers (shared): ~500MB
  ├── Base OS layer
  ├── Node.js layer
  ├── Dependencies layer
  └── App code layer

Container 1 writable layer: ~10MB
Container 2 writable layer: ~10MB
Container 3 writable layer: ~10MB

Total: ~530MB (not 1500MB!)
       ↑
   Very efficient!
```

---

## 3️⃣ Docker Registry & Docker Hub

### 🌐 What is a Docker Registry?

**Definition:**
- Storage and distribution system for Docker images
- Like GitHub but for Docker images
- Can be public or private

**Types of Registries:**

1. **Docker Hub** (hub.docker.com)
   - Official public registry
   - Free for public images
   - Paid for private images
   - Millions of images available

2. **Private Registries**
   - Self-hosted
   - Company internal
   - More control and security

3. **Cloud Registries**
   - Amazon ECR (Elastic Container Registry)
   - Google Container Registry (GCR)
   - Azure Container Registry (ACR)

---

### 🐳 Docker Hub

**URL:** https://hub.docker.com

**Features:**
- Host public/private repositories
- Automated builds from GitHub
- Official images (verified)
- Community images
- Webhooks
- Organizations and teams

**Image Naming Convention:**

```
[registry/][username/]repository[:tag]

Examples:
nginx                           → Official image, latest tag
nginx:1.25                      → Official image, specific tag
username/myapp                  → User image, latest tag
username/myapp:v1.0            → User image, specific tag
docker.io/library/nginx        → Full official image path
ghcr.io/username/myapp         → GitHub Container Registry
```

---

### 📋 Docker Hub Usage

#### 1. Create Account

```bash
# Sign up at hub.docker.com
# Username: myusername
# Email: email@example.com
```

#### 2. Login from CLI

```bash
# Login
docker login

# Enter credentials:
# Username: myusername
# Password: ********

# Login successful
# Credentials stored in ~/.docker/config.json

# Logout
docker logout
```

#### 3. Search Images

```bash
# Search on Docker Hub
docker search nginx
docker search node
docker search postgres

# Example output:
NAME                     DESCRIPTION                     STARS  OFFICIAL
nginx                    Official build of Nginx.        19000  [OK]
nginx/nginx-ingress      NGINX Ingress Controller        500
bitnami/nginx           Bitnami nginx Docker Image      200
```

#### 4. Pull Images

```bash
# Pull official image
docker pull nginx

# Pull specific version
docker pull nginx:1.25
docker pull nginx:1.25-alpine

# Pull from specific registry
docker pull ghcr.io/username/myapp

# Pull all tags
docker pull -a nginx  # Not recommended (huge!)
```

#### 5. Push Images

```bash
# Tag image with username
docker tag myapp:v1 myusername/myapp:v1
docker tag myapp:v1 myusername/myapp:latest

# Push to Docker Hub
docker push myusername/myapp:v1
docker push myusername/myapp:latest

# View on Docker Hub
# https://hub.docker.com/r/myusername/myapp
```

---

### 🏢 Official vs Community Images

#### Official Images

**Characteristics:**
- Verified by Docker
- Well maintained
- Security scanned
- Best practices
- Clear documentation

**Examples:**
```bash
docker pull nginx       # ✓ Official
docker pull node        # ✓ Official
docker pull postgres    # ✓ Official
docker pull redis       # ✓ Official
docker pull python      # ✓ Official
```

**How to identify:**
- No username prefix
- "Official Image" badge on Docker Hub
- docker.io/library/ namespace

#### Community Images

**Characteristics:**
- User-contributed
- May not be maintained
- Security unknown
- Use with caution

**Examples:**
```bash
docker pull username/myapp     # Community
docker pull company/tool       # Community
```

**Best Practices:**
- Check image age
- Check stars/downloads
- Read Dockerfile
- Check security scans
- Prefer official images when available

---

### 📊 Docker Hub Dashboard

**Repository View:**
```
myusername/myapp
├── Overview
│   ├── Description
│   ├── README.md
│   └── Usage instructions
├── Tags
│   ├── latest (1 day ago)
│   ├── v1.0 (1 week ago)
│   └── v0.9 (2 weeks ago)
├── Builds (if automated)
│   ├── Build history
│   └── Build settings
└── Collaborators
    └── Team members with access
```

---

### 🔒 Private Repositories

```bash
# Create private repository on Docker Hub
# 1. Login to hub.docker.com
# 2. Create Repository
# 3. Set Visibility: Private

# Push to private repo
docker tag myapp:v1 myusername/private-app:v1
docker push myusername/private-app:v1

# Pull private image (need login)
docker login
docker pull myusername/private-app:v1
```

---

## 4️⃣ Dockerfile Instructions

### 📝 What is a Dockerfile?

**Definition:**
- Text file with instructions to build image
- Each instruction creates a layer
- Executed in order (top to bottom)
- Case-insensitive but UPPERCASE convention

**Basic Structure:**

```dockerfile
# Comment
INSTRUCTION arguments

# Example:
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

---

### 🔧 Core Instructions

#### 1. FROM - Base Image

**Purpose:** Specify base image to build from

**Syntax:**
```dockerfile
FROM image
FROM image:tag
FROM image:tag@digest
```

**Examples:**
```dockerfile
# Use official Node.js image
FROM node:20

# Use Alpine (smaller) version
FROM node:20-alpine

# Use specific version
FROM node:20.10.0-alpine

# Multi-stage build (explained later)
FROM node:20 AS builder

# Scratch (empty image)
FROM scratch
```

**Best Practices:**
- Use official images
- Use specific tags (not `latest`)
- Use Alpine variants for smaller size
- Pin exact versions for reproducibility

---

#### 2. COPY - Copy Files

**Purpose:** Copy files/directories from host to container

**Syntax:**
```dockerfile
COPY <src> <dest>
COPY ["<src>", "<dest>"]  # For paths with spaces
```

**Examples:**
```dockerfile
# Copy single file
COPY package.json /app/

# Copy multiple files
COPY package.json package-lock.json /app/

# Copy directory
COPY src/ /app/src/

# Copy everything
COPY . /app/

# Copy with ownership
COPY --chown=node:node . /app/
```

**Best Practices:**
- Copy only what's needed
- Use .dockerignore
- Copy package files before source code (caching)
- Set ownership for security

---

#### 3. RUN - Execute Commands

**Purpose:** Run commands during image build

**Syntax:**
```dockerfile
RUN command
RUN ["executable", "param1", "param2"]  # Exec form
```

**Examples:**
```dockerfile
# Install packages
RUN apt-get update && apt-get install -y curl

# Node.js dependencies
RUN npm install

# Multiple commands (shell form)
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Exec form
RUN ["npm", "install"]

# Create user
RUN useradd -m -s /bin/bash appuser
```

**Best Practices:**
- Combine commands with `&&` to reduce layers
- Clean up in same layer
- Use `\` for readability
- Remove cache files

---

#### 4. CMD - Default Command

**Purpose:** Specify default command to run when container starts

**Syntax:**
```dockerfile
CMD ["executable", "param1", "param2"]  # Exec form (preferred)
CMD command param1 param2               # Shell form
```

**Examples:**
```dockerfile
# Start Node.js app
CMD ["node", "server.js"]

# Start with npm
CMD ["npm", "start"]

# Shell form
CMD node server.js

# With parameters
CMD ["python", "app.py", "--port", "8000"]
```

**Important Notes:**
- Only ONE CMD per Dockerfile (last one wins)
- Can be overridden by `docker run` command
- Runs when container starts, not during build

**Override example:**
```bash
# Dockerfile has: CMD ["node", "server.js"]

# Use default command
docker run myapp

# Override command
docker run myapp node debug.js
docker run myapp bash
```

---

#### 5. EXPOSE - Document Ports

**Purpose:** Document which ports the container listens on

**Syntax:**
```dockerfile
EXPOSE <port>
EXPOSE <port>/<protocol>
```

**Examples:**
```dockerfile
# Single port
EXPOSE 3000

# Multiple ports
EXPOSE 80 443

# With protocol
EXPOSE 3000/tcp
EXPOSE 53/udp

# Range
EXPOSE 8000-8080
```

**Important Notes:**
- Does NOT actually publish the port
- Just documentation
- Still need `-p` when running container

```bash
# Dockerfile has: EXPOSE 3000

# This won't work from outside:
docker run myapp

# Need to publish:
docker run -p 3000:3000 myapp
```

---

### 🎨 Additional Important Instructions

#### WORKDIR - Set Working Directory

```dockerfile
# Set working directory
WORKDIR /app

# All subsequent commands run from here
COPY . .           # Copies to /app/
RUN npm install    # Runs in /app/

# Can be used multiple times
WORKDIR /app
WORKDIR src
WORKDIR utils
# Now in /app/src/utils
```

#### ENV - Environment Variables

```dockerfile
# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_HOME=/app

# Multiple at once
ENV NODE_ENV=production \
    PORT=3000 \
    APP_HOME=/app

# Use variables
WORKDIR $APP_HOME
```

#### ARG - Build Arguments

```dockerfile
# Define build argument
ARG NODE_VERSION=20
ARG APP_PORT=3000

# Use in FROM
FROM node:${NODE_VERSION}

# Use in RUN
RUN echo "Building on port ${APP_PORT}"

# Passed at build time:
# docker build --build-arg NODE_VERSION=18 .
```

#### USER - Set User

```dockerfile
# Create user
RUN useradd -m -s /bin/bash appuser

# Switch to user
USER appuser

# All subsequent commands run as appuser
```

#### VOLUME - Define Mount Point

```dockerfile
# Create mount point
VOLUME /data
VOLUME ["/data", "/logs"]

# Data persists even if container deleted
```

#### ENTRYPOINT - Set Entry Point

```dockerfile
# Similar to CMD but harder to override
ENTRYPOINT ["node"]
CMD ["server.js"]

# Results in: node server.js

# Can only override CMD part:
docker run myapp debug.js  # Runs: node debug.js
```

#### LABEL - Add Metadata

```dockerfile
# Add metadata
LABEL version="1.0"
LABEL description="My application"
LABEL maintainer="email@example.com"

# Multiple labels
LABEL version="1.0" \
      description="My application" \
      maintainer="email@example.com"
```

---

### 📊 Complete Dockerfile Example

```dockerfile
# Build stage
FROM node:20-alpine AS builder

# Set build arguments
ARG NODE_ENV=production

# Set environment variables
ENV NODE_ENV=$NODE_ENV

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application (if needed)
RUN npm run build

# Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js

# Add labels
LABEL version="1.0" \
      description="Node.js application" \
      maintainer="dev@example.com"

# Set entrypoint and command
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

---

## 5️⃣ .dockerignore File

### 📋 What is .dockerignore?

**Purpose:**
- Exclude files from Docker build context
- Similar to .gitignore
- Speeds up builds
- Reduces image size
- Prevents sensitive data in images

**Location:**
- Same directory as Dockerfile
- Named `.dockerignore`

---

### 🎯 Why Use .dockerignore?

**Without .dockerignore:**
```bash
# Build sends ALL files to daemon
docker build .

Sending build context to Docker daemon  2.5GB
# Includes node_modules, .git, logs, etc.
# Very slow!
```

**With .dockerignore:**
```bash
# Build sends only needed files
docker build .

Sending build context to Docker daemon  15MB
# Much faster!
```

---

### 📝 .dockerignore Syntax

```dockerignore
# Comments start with #

# Ignore specific file
README.md
LICENSE

# Ignore directory
node_modules
dist
build

# Ignore pattern
*.log
*.tmp
.DS_Store

# Ignore all markdown files
*.md

# But include this one
!IMPORTANT.md

# Ignore nested
**/.git
**/__pycache__
**/node_modules

# Ignore everything in directory
temp/*

# Ignore files ending with
*~
*.swp
```

---

### 🎨 Common .dockerignore Examples

#### Node.js Project

```dockerignore
# .dockerignore for Node.js

# Dependencies
node_modules
npm-debug.log
yarn-error.log
package-lock.json  # If using yarn
yarn.lock          # If using npm

# Testing
coverage
.nyc_output
*.test.js
*.spec.js
test/
__tests__/

# Build outputs
dist
build
.next
.nuxt

# Development
.env.local
.env.development
.env.test
*.dev.js

# IDE
.vscode
.idea
*.swp
*.swo
*~
.DS_Store

# Git
.git
.gitignore
.gitattributes

# CI/CD
.github
.gitlab-ci.yml
.travis.yml
Jenkinsfile

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
README.md
CHANGELOG.md
docs/
*.md

# Other
.editorconfig
.prettierrc
.eslintrc
temp/
tmp/
logs/
*.log
```

#### Python Project

```dockerignore
# .dockerignore for Python

# Python
__pycache__
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Testing
.pytest_cache
.coverage
htmlcov/
.tox/

# Jupyter
.ipynb_checkpoints

# IDEs
.vscode
.idea
*.swp
.DS_Store

# Git
.git
.gitignore

# Documentation
README.md
docs/
*.md

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore
```

---

### 💡 Best Practices

#### 1. Always Exclude

```dockerignore
# Always exclude these
.git
.gitignore
.dockerignore
Dockerfile
docker-compose.yml
README.md
LICENSE

# IDE files
.vscode
.idea
.DS_Store
*.swp

# Dependencies (install fresh in container)
node_modules      # Node.js
venv              # Python
vendor            # PHP/Go
```

#### 2. Exclude Build Artifacts

```dockerignore
# Build outputs
dist
build
*.min.js
*.min.css

# Compiled files
*.o
*.pyc
*.class
```

#### 3. Exclude Development Files

```dockerignore
# Development only
.env.local
.env.development
*.test.js
test/
__tests__/
spec/
```

#### 4. Exclude Large Files

```dockerignore
# Large files
*.zip
*.tar.gz
*.iso
*.dmg
videos/
datasets/
```

---

### 🔍 Testing .dockerignore

**Check what's being sent:**

```bash
# Build with verbose output
docker build --progress=plain .

# Or check build context size
docker build . 2>&1 | grep "Sending build context"

# List files being sent (workaround)
tar -czh . | docker build -
```

**Verify files excluded:**

```bash
# Build and check
docker build -t test .
docker run --rm test ls -la

# Should NOT see:
# - node_modules/
# - .git/
# - *.log files
# - etc.
```

---

## 6️⃣ Multi-stage Builds

### 🎯 What are Multi-stage Builds?

**Definition:**
- Multiple `FROM` statements in single Dockerfile
- Each `FROM` starts new build stage
- Copy artifacts between stages
- Final image only contains what you copy to it

**Purpose:**
- Reduce image size dramatically
- Separate build and runtime environments
- Keep secrets out of final image
- Cleaner, more maintainable Dockerfiles

---

### 📊 Single-stage vs Multi-stage

#### ❌ Single-stage (Bloated)

```dockerfile
FROM node:20

WORKDIR /app

# Copy everything
COPY . .

# Install ALL dependencies (including dev)
RUN npm install

# Build
RUN npm run build

# Final image includes:
# - Build tools
# - Dev dependencies
# - Source code
# - node_modules (dev + prod)
# - Build cache
# Total size: 1.2GB

CMD ["node", "dist/server.js"]
```

#### ✅ Multi-stage (Optimized)

```dockerfile
# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install  # All dependencies

COPY . .
RUN npm run build  # Build application

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production  # Production only

COPY --from=builder /app/dist ./dist

# Final image includes:
# - Runtime only
# - Production dependencies only
# - Built files only
# Total size: 150MB (8x smaller!)

CMD ["node", "dist/server.js"]
```

---

### 🏗️ Multi-stage Build Syntax

#### Basic Structure

```dockerfile
# Stage 1 (named "builder")
FROM node:20 AS builder
RUN echo "Building..."

# Stage 2 (named "tester")
FROM node:20 AS tester
RUN echo "Testing..."

# Stage 3 (final, unnamed)
FROM node:20-alpine
COPY --from=builder /app/dist ./dist
COPY --from=tester /app/test-results ./results
```

#### Copy from Previous Stage

```dockerfile
# Copy from named stage
COPY --from=builder /app/dist ./dist

# Copy from stage index (0-based)
COPY --from=0 /app/dist ./dist

# Copy from external image
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

#### Build Specific Stage

```bash
# Build only "builder" stage
docker build --target builder -t myapp:builder .

# Build only "tester" stage
docker build --target tester -t myapp:tester .

# Build final stage (default)
docker build -t myapp:latest .
```

---

### 🎨 Complete Multi-stage Examples

#### Example 1: Node.js Application

```dockerfile
# syntax=docker/dockerfile:1

###################
# BUILD STAGE
###################
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Run build
RUN npm run build

# Run tests (optional)
RUN npm test

###################
# PRODUCTION STAGE
###################
FROM node:20-alpine AS production

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

**Build and run:**
```bash
docker build -t myapp:prod .
docker run -p 3000:3000 myapp:prod
```

**Size comparison:**
```
Single-stage:  1.2GB
Multi-stage:   150MB
Reduction:     87.5%
```

---

#### Example 2: Go Application

```dockerfile
###################
# BUILD STAGE
###################
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

###################
# PRODUCTION STAGE
###################
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/main .

# Expose port
EXPOSE 8080

# Run
CMD ["./main"]
```

**Result:**
```
Build stage:  300MB (with Go compiler)
Final stage:  10MB (only binary + alpine)
```

---

#### Example 3: Python Application

```dockerfile
###################
# BUILD STAGE
###################
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies to /install
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

###################
# PRODUCTION STAGE
###################
FROM python:3.11-slim

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["python", "app.py"]
```

---

#### Example 4: React Frontend

```dockerfile
###################
# BUILD STAGE
###################
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build for production
RUN npm run build

###################
# PRODUCTION STAGE
###################
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 🎯 Advanced Multi-stage Patterns

#### Pattern 1: Development vs Production

```dockerfile
# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**Usage:**
```bash
# Development
docker build --target development -t myapp:dev .
docker run myapp:dev

# Production
docker build --target production -t myapp:prod .
docker run myapp:prod
```

---

#### Pattern 2: Testing Stage

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Test stage
FROM builder AS tester
RUN npm test
RUN npm run lint
RUN npm run coverage

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**CI/CD Usage:**
```bash
# In CI pipeline:
# 1. Run tests
docker build --target tester .

# 2. If tests pass, build production
docker build --target production -t myapp:prod .
```

---

#### Pattern 3: Multi-architecture

```dockerfile
# AMD64 builder
FROM --platform=linux/amd64 node:20-alpine AS builder-amd64
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# ARM64 builder
FROM --platform=linux/arm64 node:20-alpine AS builder-arm64
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Final stage (multi-arch)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder-${TARGETARCH} /app/dist ./dist
CMD ["node", "dist/server.js"]
```

---

### 💡 Multi-stage Best Practices

#### 1. Name Your Stages

```dockerfile
# ✅ Good - named stages
FROM node:20 AS builder
FROM node:20-alpine AS production

# ❌ Bad - unnamed
FROM node:20
FROM node:20-alpine
```

#### 2. Order Stages Strategically

```dockerfile
# ✅ Good - shared base
FROM node:20-alpine AS base
FROM base AS development
FROM base AS builder
FROM base AS production

# ❌ Bad - repeated base
FROM node:20-alpine AS development
FROM node:20-alpine AS builder
FROM node:20-alpine AS production
```

#### 3. Minimize Final Stage

```dockerfile
# ✅ Good - minimal final stage
FROM alpine:latest
COPY --from=builder /app/binary .

# ❌ Bad - bloated final stage
FROM ubuntu:latest
RUN apt-get update && apt-get install -y nodejs npm
COPY --from=builder /app .
```

#### 4. Use Build Cache

```dockerfile
# ✅ Good - copy dependencies first
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Bad - breaks cache
COPY . .
RUN npm install
```

---

## 7️⃣ Best Practices

### 🎯 Image Size Optimization

```dockerfile
# ✅ Use Alpine base images
FROM node:20-alpine  # ~150MB
# Instead of:
# FROM node:20       # ~900MB

# ✅ Multi-stage builds
FROM node:20 AS builder
RUN npm run build
FROM node:20-alpine
COPY --from=builder /app/dist ./dist

# ✅ Remove unnecessary files
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ✅ Combine RUN commands
RUN apt-get update && apt-get install -y \
    curl \
    vim \
 && rm -rf /var/lib/apt/lists/*
```

---

### 🔒 Security Best Practices

```dockerfile
# ✅ Run as non-root user
RUN adduser -D appuser
USER appuser

# ✅ Use specific versions
FROM node:20.10.0-alpine
# Not: FROM node:latest

# ✅ Scan for vulnerabilities
# docker scan myapp:latest

# ✅ Don't include secrets
# Use build arguments or runtime environment variables
ARG API_KEY
ENV API_KEY=$API_KEY

# ✅ Minimize installed packages
RUN apk add --no-cache curl
# Only install what's needed
```

---

### ⚡ Build Performance

```dockerfile
# ✅ Copy package files first (cache)
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Bad - breaks cache on any file change
COPY . .
RUN npm install

# ✅ Use .dockerignore
# Exclude node_modules, .git, etc.

# ✅ Order instructions by change frequency
FROM node:20-alpine         # Rarely changes
WORKDIR /app               # Never changes
COPY package*.json ./      # Changes sometimes
RUN npm install            # Changes sometimes
COPY . .                   # Changes often
```

---

### 📝 Dockerfile Maintenance

```dockerfile
# ✅ Add comments
# Install production dependencies
RUN npm ci --only=production

# ✅ Use labels
LABEL version="1.0" \
      maintainer="team@example.com" \
      description="Application description"

# ✅ One concern per stage
FROM node:20 AS builder     # Building
FROM node:20 AS tester      # Testing
FROM node:20-alpine         # Running

# ✅ Document exposed ports
EXPOSE 3000  # Application port
EXPOSE 9229  # Debug port
```

---

## 8️⃣ Complete Examples

### Example 1: Full-stack Application

**Directory Structure:**
```
myapp/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
└── frontend/
    ├── package.json
    └── src/
```

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm test

FROM node:20-alpine

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**.dockerignore:**
```dockerignore
node_modules
npm-debug.log
.git
.gitignore
.DS_Store
*.md
.env.local
coverage
dist
build
.vscode
```

---

## 📚 Summary

### Key Concepts Recap

| Concept | Description |
|---------|-------------|
| **Docker Architecture** | Client-daemon-registry model |
| **Images** | Read-only templates, layered |
| **Containers** | Running instances of images |
| **Docker Hub** | Public registry for images |
| **Dockerfile** | Instructions to build images |
| **.dockerignore** | Exclude files from build context |
| **Multi-stage** | Multiple build stages for optimization |

### Command Reference

```bash
# Images
docker images                          # List images
docker build -t name .                 # Build image
docker pull name                       # Pull from registry
docker push name                       # Push to registry
docker rmi name                        # Remove image

# Containers
docker run name                        # Run container
docker ps                              # List running
docker ps -a                           # List all
docker stop id                         # Stop container
docker rm id                           # Remove container
docker logs id                         # View logs
docker exec -it id bash                # Enter container

# Cleanup
docker system prune                    # Remove unused objects
docker volume prune                    # Remove unused volumes
docker image prune                     # Remove unused images

# Interactive mode
docker run -it node:18-alpine sh       # Interactive mode
# -i: Giữ luồng nhập (STDIN) của Container luôn mở, cho phép bạn gửi lệnh vào Container từ terminal của mình
# -t: Phân bổ một terminal giả cho Container. Điều này cho phép bạn thấy giao diện dòng lệnh (command-line interface)
# -it: Được dùng cùng nhau khi bạn muốn "nhảy vào" và tương tác trực tiếp với Container.
# sh: Shell cơ bản (thường là Almquist shell) trên các bản phân phối Linux tối giản như Alpine.
```

---

## 🎓 Learning Checklist

After studying this guide, you should understand:

- [ ] Docker client-server architecture
- [ ] Difference between images and containers
- [ ] How Docker Hub works
- [ ] All major Dockerfile instructions
- [ ] Purpose and usage of .dockerignore
- [ ] Multi-stage builds and their benefits
- [ ] Best practices for:
  - [ ] Image size optimization
  - [ ] Security
  - [ ] Build performance
  - [ ] Dockerfile maintenance

---

## 📖 Additional Resources

### Official Documentation
- Docker Docs: https://docs.docker.com
- Dockerfile Reference: https://docs.docker.com/engine/reference/builder/
- Best Practices: https://docs.docker.com/develop/dev-best-practices/

### Tools
- Docker Desktop: https://www.docker.com/products/docker-desktop
- Docker Hub: https://hub.docker.com
- Dive (image analyzer): https://github.com/wagoodman/dive

### Learning
- Play with Docker: https://labs.play-with-docker.com
- Docker Playground: https://www.katacoda.com/courses/docker

---

**End of Docker Fundamentals Theory Guide** 🎉

**Version:** 1.0  
**Last Updated:** December 2024

*Happy Dockerizing!* 🐳