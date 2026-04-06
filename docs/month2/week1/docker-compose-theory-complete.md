# 🐳 Docker Compose - Complete Theory & Practice Guide

**Topic:** Docker Compose từ cơ bản đến nâng cao  
**Level:** Beginner to Intermediate  
**Last Updated:** December 2024

---

## 📚 Table of Contents

1. [Docker Compose Fundamentals](#1-docker-compose-fundamentals)
2. [docker-compose.yml Syntax](#2-docker-composeyml-syntax)
3. [Services Configuration](#3-services-configuration)
4. [Networks](#4-networks)
5. [Volumes](#5-volumes)
6. [Environment Variables](#6-environment-variables)
7. [Dependencies & Healthchecks](#7-dependencies--healthchecks)
8. [Override Files](#8-override-files)
9. [Docker Compose Commands](#9-docker-compose-commands)
10. [Development vs Production](#10-development-vs-production)
11. [Complete Examples](#11-complete-examples)
12. [Best Practices](#12-best-practices)

---

## 1️⃣ Docker Compose Fundamentals

### 🎯 What is Docker Compose?

**Definition:**
Docker Compose là tool để define và run multi-container Docker applications. Bạn dùng YAML file để config application's services, sau đó chỉ cần 1 command để tạo và start tất cả services.

**Key Benefits:**
- **Simplicity:** 1 file YAML thay vì nhiều `docker run` commands
- **Reproducibility:** Same configuration mọi lúc mọi nơi
- **Version Control:** Commit docker-compose.yml vào Git
- **Easy Sharing:** Team members dùng same setup
- **Environment Management:** Dev, staging, production configs

### 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              docker-compose.yml                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  services:                                   │   │
│  │    database:    ─────────────┐              │   │
│  │    api:         ─────────┐   │              │   │
│  │    frontend:    ─────┐   │   │              │   │
│  └──────────────────────┼───┼───┼──────────────┘   │
└─────────────────────────┼───┼───┼──────────────────┘
                          │   │   │
                          ▼   ▼   ▼
        ┌──────────────────────────────────┐
        │     Docker Compose CLI           │
        │  (parses YAML, calls Docker)     │
        └──────────────────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────┐
        │       Docker Engine              │
        │                                  │
        │  ┌──────┐ ┌──────┐ ┌──────┐    │
        │  │ DB   │ │ API  │ │ Web  │    │
        │  └──────┘ └──────┘ └──────┘    │
        │        Shared Network            │
        └──────────────────────────────────┘
```

### 💡 Why Docker Compose?

**Without Compose:**
```bash
# Create network
docker network create myapp-network

# Start database
docker run -d \
  --name mongo \
  --network myapp-network \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v mongo-data:/data/db \
  mongo:6

# Build and start API
docker build -t myapi ./backend
docker run -d \
  --name api \
  --network myapp-network \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e MONGO_URL=mongodb://admin:secret@mongo:27017 \
  -v $(pwd)/backend:/app \
  myapi

# Build and start frontend
docker build -t myfrontend ./frontend
docker run -d \
  --name frontend \
  --network myapp-network \
  -p 8080:80 \
  myfrontend

# 😰 Phức tạp, dễ sai, khó maintain
```

**With Compose:**
```bash
# Just one command!
docker-compose up -d

# ✅ Đơn giản
# ✅ Dễ maintain
# ✅ Reproducible
```

---

## 2️⃣ docker-compose.yml Syntax

### 📝 Basic Structure

```yaml
# Version (optional in newer Compose)
version: '3.8'

# Services (containers)
services:
  service-name:
    # Service configuration

# Networks
networks:
  network-name:
    # Network configuration

# Volumes
volumes:
  volume-name:
    # Volume configuration
```

### 🎨 Complete Annotated Example

```yaml
version: '3.8'

services:
  # Database service
  database:
    image: postgres:15-alpine        # Image từ Docker Hub
    container_name: myapp-db         # Custom tên container
    hostname: postgres-host          # Hostname trong network
    restart: unless-stopped          # Restart policy
    
    # Port mapping host:container
    ports:
      - "5432:5432"
    
    # Environment variables
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
    
    # Volumes
    volumes:
      - db-data:/var/lib/postgresql/data    # Named volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro  # Bind mount (read-only)
    
    # Health check
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    
    # Networks
    networks:
      - backend

# Network definitions
networks:
  backend:
    driver: bridge

# Volume definitions
volumes:
  db-data:
    driver: local
```

### 📊 YAML Format Rules

```yaml
# Key-value pairs
key: value

# Nested structures (2 spaces indentation)
parent:
  child: value
  another_child: value

# Lists/Arrays
list:
  - item1
  - item2
  - item3

# Inline list
inline_list: [item1, item2, item3]

# Multi-line strings
multiline: |
  Line 1
  Line 2
  Line 3

# Folded strings (spaces replaced with space)
folded: >
  This long text
  will be folded
  into one line

# Comments
# This is a comment
key: value  # Inline comment

# Boolean values
boolean_true: true
boolean_false: false

# Numbers
number: 123
float: 3.14

# Null/None
null_value: null
```

---

## 3️⃣ Services Configuration

### 📦 Service Definition

**Service** = Container definition trong Compose file

```yaml
services:
  service-name:
    # === IMAGE OR BUILD ===
    image: nginx:alpine              # Pull từ registry
    # OR
    build:                           # Build từ Dockerfile
      context: ./path                # Build context
      dockerfile: Dockerfile         # Dockerfile name
      args:                          # Build arguments
        NODE_VERSION: 20
      target: production             # Multi-stage target
    
    # === NAMING ===
    container_name: my-container     # Override auto-generated name
    hostname: my-hostname            # Hostname trong network
    
    # === PORTS ===
    ports:
      - "8080:80"                    # host:container
      - "443:443"
    expose:
      - "3000"                       # Expose to other services only
    
    # === ENVIRONMENT ===
    environment:
      NODE_ENV: production
      PORT: 3000
    env_file:
      - .env
      - .env.production
    
    # === VOLUMES ===
    volumes:
      - ./src:/app/src               # Bind mount
      - node_modules:/app/node_modules  # Named volume
      - /app/logs                    # Anonymous volume
    
    # === NETWORKS ===
    networks:
      - frontend
      - backend
    
    # === DEPENDENCIES ===
    depends_on:
      - database
      - redis
    
    # === COMMANDS ===
    command: npm start               # Override CMD
    entrypoint: /docker-entrypoint.sh  # Override ENTRYPOINT
    
    # === RESTART POLICY ===
    restart: unless-stopped          # no, always, on-failure, unless-stopped
    
    # === WORKING DIRECTORY ===
    working_dir: /app
    
    # === USER ===
    user: "node:node"                # Run as user:group
    
    # === HEALTH CHECK ===
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # === RESOURCE LIMITS ===
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    # === LOGGING ===
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 🎯 Build Configuration

```yaml
services:
  api:
    # Simple build
    build: ./backend
    
    # OR Extended build config
    build:
      context: ./backend             # Path chứa Dockerfile
      dockerfile: Dockerfile.dev     # Custom Dockerfile name
      args:                          # Build-time arguments
        NODE_VERSION: "20"
        APP_ENV: "development"
      target: development            # Multi-stage build target
      cache_from:                    # Use cache from images
        - myapp:cache
      labels:                        # Image labels
        com.example.version: "1.0"
    
    image: myapp:dev                 # Tag built image
```

### 🔄 Restart Policies

```yaml
services:
  # Never restart (default)
  service1:
    restart: "no"
  
  # Always restart
  service2:
    restart: always
  
  # Restart on failure (with max retries)
  service3:
    restart: on-failure:3
  
  # Restart unless stopped manually
  service4:
    restart: unless-stopped
```

---

## 4️⃣ Networks

### 🌐 Network Basics

**Purpose:**
- Container communication
- Service discovery via DNS
- Network isolation
- Control traffic flow

### 📝 Network Configuration

```yaml
services:
  frontend:
    image: nginx
    networks:
      - public        # Connected to public network
  
  api:
    image: myapi
    networks:
      - public        # Can talk to frontend
      - private       # Can talk to database
  
  database:
    image: postgres
    networks:
      - private       # Only api can access

networks:
  # Default bridge network
  public:
    driver: bridge
  
  # Internal network (no external access)
  private:
    driver: bridge
    internal: true
```

### 🎨 Network Types

```yaml
networks:
  # Bridge (default)
  default-network:
    driver: bridge
  
  # Custom bridge with subnet
  custom-network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1
  
  # Host network (no isolation)
  host-network:
    driver: host
  
  # Overlay (for Swarm)
  swarm-network:
    driver: overlay
  
  # External (pre-existing)
  existing-network:
    external: true
    name: my-existing-network
```

### 🔒 Network Isolation Example

```yaml
version: '3.8'

services:
  # Public-facing nginx
  nginx:
    image: nginx
    ports:
      - "80:80"
    networks:
      - frontend
  
  # API server
  api:
    build: ./api
    networks:
      - frontend      # Can receive from nginx
      - backend       # Can access database
  
  # Database
  postgres:
    image: postgres
    networks:
      - backend       # Isolated, only api can access

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true    # No external connectivity
```

**Network Diagram:**
```
Internet
   │
   ▼
[nginx] ─────┐
             │ frontend network
             ▼
          [api] ─────┐
                     │ backend network
                     ▼
                [postgres]

✅ nginx → api: allowed
✅ api → postgres: allowed
❌ nginx → postgres: blocked
❌ Internet → postgres: blocked
```

### 🎯 Service Discovery

```yaml
services:
  api:
    image: myapi
    networks:
      - mynetwork
  
  database:
    image: postgres
    networks:
      - mynetwork

networks:
  mynetwork:
```

**DNS Resolution:**
```javascript
// Inside api container
// Can access database via service name
const dbUrl = 'postgresql://user:pass@database:5432/mydb';
//                                      ^^^^^^^^
//                                      Service name = hostname
```

---

## 5️⃣ Volumes

### 💾 Volume Types

**1. Named Volumes (Recommended)**
```yaml
services:
  database:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:    # Managed by Docker
```

**2. Bind Mounts (Host Paths)**
```yaml
services:
  api:
    image: myapi
    volumes:
      - ./src:/app/src              # Relative path
      - /var/log:/app/logs          # Absolute path
      - ~/data:/data                # Home directory
```

**3. Anonymous Volumes**
```yaml
services:
  api:
    image: myapi
    volumes:
      - /app/node_modules           # Created & destroyed with container
```

### 📝 Volume Syntax

```yaml
services:
  app:
    volumes:
      # === SHORT SYNTAX ===
      # Named volume
      - volume-name:/container/path
      
      # Bind mount
      - ./host/path:/container/path
      
      # Read-only
      - ./host/path:/container/path:ro
      
      # Read-write with options
      - ./host/path:/container/path:rw,z
      
      # === LONG SYNTAX ===
      - type: volume
        source: volume-name
        target: /container/path
        volume:
          nocopy: true
      
      - type: bind
        source: ./host/path
        target: /container/path
        read_only: true
      
      - type: tmpfs
        target: /tmp
        tmpfs:
          size: 1000000

volumes:
  volume-name:
```

### 🎨 Volume Configuration

```yaml
volumes:
  # Simple named volume
  simple:
  
  # With driver
  custom:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
  
  # NFS volume
  nfs-volume:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.1,rw
      device: ":/path/to/dir"
  
  # External volume
  existing:
    external: true
    name: my-existing-volume
  
  # With labels
  labeled:
    driver: local
    labels:
      com.example.description: "Database volume"
```

### 💡 Common Patterns

**Development: Source Code Mount**
```yaml
services:
  api:
    volumes:
      - ./backend:/app              # Hot reload
      - /app/node_modules           # Don't override node_modules
```

**Database: Data Persistence**
```yaml
services:
  postgres:
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  postgres-data:
```

**Shared Volume Between Services**
```yaml
services:
  producer:
    volumes:
      - shared-data:/data
  
  consumer:
    volumes:
      - shared-data:/data:ro        # Read-only access

volumes:
  shared-data:
```

---

## 6️⃣ Environment Variables

### 🔐 Setting Environment Variables

**Method 1: Inline**
```yaml
services:
  api:
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
```

**Method 2: List Format**
```yaml
services:
  api:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=postgres
```

**Method 3: From File**
```yaml
services:
  api:
    env_file:
      - .env
      - .env.production
```

**Method 4: Substitution from Host**
```yaml
services:
  api:
    environment:
      NODE_ENV: ${NODE_ENV}              # From host/shell
      PORT: ${PORT:-3000}                # With default
      DB_PASSWORD: ${DB_PASSWORD:?required}  # Required
```

### 📄 Environment File (.env)

**File Structure:**
```bash
# .env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD=secret123
```

**Priority (highest to lowest):**
1. Compose file `environment`
2. Shell environment
3. `env_file`
4. Dockerfile `ENV`

### 🎯 Best Practices

**Project Structure:**
```
project/
├── docker-compose.yml
├── .env                     # For Compose variable substitution
├── .env.development         # For containers in dev
├── .env.production          # For containers in prod
├── .env.example             # Template (commit to git)
└── .gitignore              # Ignore .env files
```

**.gitignore:**
```gitignore
.env
.env.local
.env.*.local
.env.development
.env.production
```

**.env.example:**
```bash
# .env.example - Template file
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PASSWORD=CHANGE_ME
API_KEY=YOUR_KEY_HERE
```

### 🔒 Secrets Management

```yaml
services:
  api:
    secrets:
      - db_password
      - api_key
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
```

---

## 7️⃣ Dependencies & Healthchecks

### 🔗 depends_on

**Purpose:** Control startup order

**Basic Usage:**
```yaml
services:
  web:
    image: nginx
    depends_on:
      - api
  
  api:
    image: myapi
    depends_on:
      - database
      - redis
  
  database:
    image: postgres
  
  redis:
    image: redis
```

**Startup Order:**
```
1. database starts
2. redis starts  
3. api starts (after db & redis)
4. web starts (after api)
```

**⚠️ Important:** 
- Only waits for container to START
- Does NOT wait for service to be READY

### 🏥 Healthchecks

**Purpose:** Check if service is actually ready

**Syntax:**
```yaml
services:
  database:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s       # Check every 10s
      timeout: 5s         # Timeout after 5s
      retries: 5          # Retry 5 times before unhealthy
      start_period: 30s   # Grace period before checking
```

**Test Command Options:**
```yaml
healthcheck:
  # Shell form
  test: curl -f http://localhost/health || exit 1
  
  # Exec form (recommended)
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  
  # Shell wrapper
  test: ["CMD-SHELL", "curl -f http://localhost/health || exit 1"]
  
  # Disable healthcheck
  disable: true
```

### 🎯 Combining depends_on with Healthchecks

```yaml
services:
  database:
    image: postgres
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
  
  api:
    image: myapi
    depends_on:
      database:
        condition: service_healthy    # Wait until healthy!
    environment:
      DB_HOST: database
```

**Available Conditions:**
- `service_started`: Just started (default)
- `service_healthy`: Passed healthcheck
- `service_completed_successfully`: Exited with code 0

### 📊 Complete Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s
    volumes:
      - postgres-data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - redis-data:/data
  
  api:
    build: ./backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 20s
    ports:
      - "3000:3000"
  
  frontend:
    build: ./frontend
    depends_on:
      api:
        condition: service_healthy
    ports:
      - "8080:80"

volumes:
  postgres-data:
  redis-data:
```

---

## 8️⃣ Override Files

### 🎨 What are Override Files?

**Purpose:**
- Extend base configuration
- Environment-specific settings
- Keep base config DRY

**Default Override:**
`docker-compose.override.yml` is automatically loaded

### 📋 File Structure

```yaml
# docker-compose.yml (BASE)
version: '3.8'
services:
  api:
    image: myapi
    ports:
      - "3000:3000"

# docker-compose.override.yml (AUTO-LOADED)
version: '3.8'
services:
  api:
    environment:
      NODE_ENV: development
    volumes:
      - ./src:/app/src
```

**When running `docker-compose up`:**
Both files merge automatically

### 🎯 Multiple Environment Files

```yaml
# docker-compose.yml (BASE - committed)
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"

# docker-compose.dev.yml (DEVELOPMENT)
version: '3.8'
services:
  api:
    build:
      target: development
    environment:
      NODE_ENV: development
    volumes:
      - ./backend:/app
    command: npm run dev

# docker-compose.prod.yml (PRODUCTION)
version: '3.8'
services:
  api:
    image: registry.example.com/myapi:${VERSION}
    environment:
      NODE_ENV: production
    restart: always
```

**Usage:**
```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Aliases
alias dc-dev='docker-compose -f docker-compose.yml -f docker-compose.dev.yml'
alias dc-prod='docker-compose -f docker-compose.yml -f docker-compose.prod.yml'

dc-dev up
dc-prod up -d
```

### 🔧 Merge Rules

**1. Scalar values: Override**
```yaml
# Base: image: myapi:v1
# Override: image: myapi:v2
# Result: image: myapi:v2
```

**2. Arrays: Merge/Append**
```yaml
# Base:
environment:
  - KEY1=value1

# Override:
environment:
  - KEY2=value2

# Result:
environment:
  - KEY1=value1
  - KEY2=value2
```

**3. Maps: Merge**
```yaml
# Base:
environment:
  KEY1: value1

# Override:
environment:
  KEY2: value2

# Result:
environment:
  KEY1: value1
  KEY2: value2
```

---

## 9️⃣ Docker Compose Commands

### 📋 Essential Commands

**Start Services:**
```bash
docker-compose up                 # Start all services
docker-compose up -d              # Detached mode
docker-compose up --build         # Rebuild before start
docker-compose up api frontend    # Start specific services
docker-compose up --scale api=3   # Scale service
```

**Stop Services:**
```bash
docker-compose stop               # Stop services
docker-compose stop api           # Stop specific service
docker-compose down               # Stop and remove
docker-compose down -v            # Also remove volumes
docker-compose down --rmi all     # Also remove images
```

**View Status:**
```bash
docker-compose ps                 # List services
docker-compose ps -a              # Include stopped
docker-compose config             # View merged config
docker-compose config --services  # List service names
```

**Logs:**
```bash
docker-compose logs               # View logs
docker-compose logs -f            # Follow logs
docker-compose logs -f api        # Follow specific service
docker-compose logs --tail=100    # Last 100 lines
docker-compose logs -t            # With timestamps
```

**Execute Commands:**
```bash
docker-compose exec api sh        # Interactive shell
docker-compose exec api npm test  # Run command
docker-compose exec -u root api sh  # As different user
```

**Run One-off Commands:**
```bash
docker-compose run api npm test   # Run in new container
docker-compose run --rm api npm test  # Remove after
docker-compose run --no-deps api npm test  # Without deps
```

**Build:**
```bash
docker-compose build              # Build all
docker-compose build api          # Build specific
docker-compose build --no-cache   # Without cache
```

**Restart:**
```bash
docker-compose restart            # Restart all
docker-compose restart api        # Restart specific
```

**Other:**
```bash
docker-compose pull               # Pull images
docker-compose push               # Push images
docker-compose top                # Show processes
docker-compose images             # Show images
docker-compose rm                 # Remove stopped containers
```

### 🎯 Common Workflows

**Development:**
```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f api

# Make changes (hot reload)

# Restart if needed
docker-compose restart api

# Stop
docker-compose down
```

**Debugging:**
```bash
# Start
docker-compose up -d

# Check status
docker-compose ps

# Shell into container
docker-compose exec api sh

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

**Clean Restart:**
```bash
# Remove everything
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

---

## 🔟 Development vs Production

### 📊 Comparison

| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ Volume mounts | ❌ No |
| Debug Ports | ✅ Exposed | ❌ Hidden |
| Image Size | Larger | Smaller |
| Restart Policy | `no` | `always` |
| Resource Limits | ❌ None | ✅ Strict |
| Logging | Console | File rotation |

### 🛠️ Development Setup

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      target: development
    environment:
      NODE_ENV: development
      DEBUG: "api:*"
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port
    command: npm run dev
```

### 🚀 Production Setup

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      target: production
    image: registry.example.com/myapi:${VERSION}
    environment:
      NODE_ENV: production
    restart: always
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 1️⃣1️⃣ Complete Examples

### 🎨 Example 1: Node.js + MongoDB

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6-alpine
    container_name: myapp-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret123
      MONGO_INITDB_DATABASE: myapp
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: myapp-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      MONGO_URL: mongodb://admin:secret123@mongo:27017/myapp?authSource=admin
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      mongo:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - backend
      - frontend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: myapp-frontend
    restart: unless-stopped
    ports:
      - "8080:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3000
      CHOKIDAR_USEPOLLING: "true"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge

volumes:
  mongo-data:
```

### 🎨 Example 2: Full MERN Stack with Redis & Nginx

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongo:
    image: mongo:6-alpine
    container_name: mern-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
      MONGO_INITDB_DATABASE: ${DB_NAME}
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      retries: 5
    networks:
      - backend

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: mern-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      retries: 5
    networks:
      - backend

  # Express API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: mern-api
    restart: unless-stopped
    env_file:
      - .env.development
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
      - api-logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - backend

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: mern-frontend
    restart: unless-stopped
    environment:
      REACT_APP_API_URL: http://localhost/api
      CHOKIDAR_USEPOLLING: "true"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: mern-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
      - frontend
    networks:
      - frontend
      - backend

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge

volumes:
  mongo-data:
  redis-data:
  api-logs:
```

**nginx.conf:**
```nginx
upstream api {
    server api:3000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket support (for hot reload)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 1️⃣2️⃣ Best Practices

### ✅ DO's

**1. Use Specific Image Tags**
```yaml
✅ Good:
image: node:20-alpine
image: postgres:15-alpine

❌ Bad:
image: node:latest
image: postgres
```

**2. Use Named Volumes**
```yaml
✅ Good:
volumes:
  - db-data:/var/lib/postgresql/data
volumes:
  db-data:

❌ Bad:
volumes:
  - /var/lib/postgresql/data  # Anonymous
```

**3. Health Checks**
```yaml
✅ Good:
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 10s

❌ Bad:
# No health check
```

**4. Proper Dependencies**
```yaml
✅ Good:
depends_on:
  database:
    condition: service_healthy

❌ Bad:
depends_on:
  - database  # No health check
```

**5. Environment Files**
```yaml
✅ Good:
env_file:
  - .env.${ENVIRONMENT}

❌ Bad:
environment:
  DB_PASSWORD: secret123  # Hardcoded!
```

**6. Resource Limits**
```yaml
✅ Good:
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M

❌ Bad:
# No limits - can use all resources
```

**7. Logging Configuration**
```yaml
✅ Good:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

❌ Bad:
# No logging config - grows indefinitely
```

### ❌ DON'Ts

**1. Don't Hardcode Secrets**
```yaml
❌ Bad:
environment:
  DB_PASSWORD: secret123
  API_KEY: abc123xyz

✅ Good:
environment:
  DB_PASSWORD: ${DB_PASSWORD}
  API_KEY: ${API_KEY}
```

**2. Don't Use `latest` Tag**
```yaml
❌ Bad:
image: node:latest

✅ Good:
image: node:20-alpine
```

**3. Don't Mount Everything**
```yaml
❌ Bad:
volumes:
  - ./:/app  # Everything!

✅ Good:
volumes:
  - ./src:/app/src  # Only what's needed
  - /app/node_modules
```

**4. Don't Run as Root**
```yaml
❌ Bad:
# No user specified = root

✅ Good:
user: "node:node"
```

---

## 📚 Quick Reference

### Common Commands
```bash
docker-compose up -d              # Start services
docker-compose down               # Stop and remove
docker-compose down -v            # Also remove volumes
docker-compose ps                 # List services
docker-compose logs -f service    # Follow logs
docker-compose exec service sh    # Shell into container
docker-compose restart service    # Restart service
docker-compose build              # Rebuild images
docker-compose pull               # Pull images
```

### File Structure
```
project/
├── docker-compose.yml            # Base config
├── docker-compose.dev.yml        # Dev overrides
├── docker-compose.prod.yml       # Prod overrides
├── .env.example                  # Template
├── .env.development              # Dev env
├── .env.production               # Prod env
└── .gitignore                    # Ignore .env files
```

### Basic docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## 🎓 Learning Checklist

- [ ] Understand Docker Compose purpose
- [ ] Write docker-compose.yml
- [ ] Configure services
- [ ] Setup networks
- [ ] Use volumes
- [ ] Manage environment variables
- [ ] Implement healthchecks
- [ ] Use override files
- [ ] Master commands
- [ ] Build multi-service apps
- [ ] Separate dev/prod configs

---

**End of Docker Compose Complete Guide** 🎉

*Happy Composing!* 🐳
