# Lộ Trình Học DevOps cho người dùng macOS/macMini

> **Background:** Node.js Developer (FE/BE) → DevOps Engineer
> **Timeline:** 12 tháng
> **Platform:** macOS (macBook/macMini)

---

# THÁNG 1: Terminal & Unix Fundamentals trên macOS

## Setup Môi Trường Ban Đầu

### Tasks

- [x] Cài đặt Homebrew package manager
- [x] Cài đặt iTerm2 (terminal tốt hơn Terminal.app)
- [x] Cài đặt Oh My Zsh (shell framework)
- [x] Configure iTerm2: themes, profiles, keyboard shortcuts
- [x] Setup ~/.zshrc với aliases và PATH

### Resources

- Homebrew: https://brew.sh
- iTerm2: https://iterm2.com
- Oh My Zsh: https://ohmyz.sh

---

## Tuần 1: Command Line Basics

### Học

- [x] Navigation commands: `cd`, `ls`, `pwd`, `mkdir`, `rm`, `cp`, `mv`
- [x] File operations: `touch`, `cat`, `less`, `head`, `tail`, `open`
- [x] Permissions: `chmod`, `chown`, hiểu rwx (read/write/execute)
- [x] macOS specific: `pbcopy`, `pbpaste` (clipboard operations)
- [x] Man pages: `man <command>` để đọc documentation

### Thực Hành

- [x] Tạo folder structure cho projects qua terminal
- [x] Copy/move/rename files without Finder
- [x] Change file permissions: `chmod 755 script.sh`
- [x] Pipe output to clipboard: `cat file.txt | pbcopy`
- [x] Create useful aliases trong ~/.zshrc:
  ```bash
  alias ll="ls -lah"
  alias gs="git status"
  alias dc="docker-compose"
  alias reload="source ~/.zshrc"
  ```

### Mini Challenge

- [x] Navigate entire project structure chỉ bằng command line
- [x] Tạo script đơn giản để organize Downloads folder
- [x] Find all .js files trong project: `find . -name "*.js"`

---

## Tuần 2: Homebrew & Development Tools

### Học

- [x] Homebrew commands: `brew install`, `brew update`, `brew upgrade`, `brew list`
- [x] Homebrew Cask cho GUI apps
- [x] Process management: `ps`, `top`, `htop`, `kill`, `killall`
- [x] Node version management: nvm hoặc fnm

### Thực Hành - Cài Đặt Essential Tools

- [x] `brew install git`
- [x] `brew install node`
- [x] `brew install wget curl`
- [x] `brew install tree` (visualize directories)
- [x] `brew install htop` (better process viewer)
- [x] `brew install jq` (JSON parser)
- [x] `brew install bat` (better cat)
- [x] `brew install ripgrep` (better grep)
- [x] `brew install fzf` (fuzzy finder)

### Thực Hành - GUI Apps

- [x] `brew install --cask visual-studio-code`
- [x] `brew install --cask docker`
- [x] `brew install --cask postman`
- [x] `brew install --cask rectangle` (window management)

### Thực Hành - Process Management

- [x] Chạy Node.js app và monitor với `htop`
- [x] Find process by port: `lsof -i :3000`
- [x] Kill process holding port: `kill -9 $(lsof -ti:3000)`
- [x] Run multiple Node.js instances trên different ports
- [ ] Parse JSON from API: `curl api.example.com | jq`

### Mini Project

- [x] Setup Node.js app với multiple instances
- [x] Monitor CPU/memory usage của từng instance
- [x] Script để start/stop/restart processes
- [x] Kill all Node processes với một command

---

## Tuần 3: Networking & Local Development

### Học

- [x] IP addresses: localhost, 127.0.0.1, 0.0.0.0
- [x] Ports: well-known ports (80, 443, 22, 3000)
- [x] DNS: domain name resolution
- [x] Network commands: `ping`, `curl`, `netstat`, `lsof`
- [x] `/etc/hosts` file để custom domains

### Thực Hành - Networking Commands

- [x] `ping google.com` để test connectivity
- [x] `curl` API với different methods: GET, POST, PUT, DELETE
- [x] `curl -v` để see request/response headers
- [x] Check open ports: `netstat -an | grep LISTEN`
- [x] Find what's using a port: `lsof -i :8080`

### Thực Hành - Local Domain Setup

- [x] Edit `/etc/hosts`: map `myapp.local` → `127.0.0.1`
- [x] Setup Node.js API chạy `api.myapp.local:3000`
- [x] Setup React app chạy `myapp.local:3001`
- [x] Test access qua custom domains trong browser

### Thực Hành - Docker Desktop Setup

- [x] `brew install --cask docker`
- [x] Open Docker Desktop và complete setup
- [x] Verify: `docker --version`
- [x] Run hello world: `docker run hello-world`
- [x] Explore Docker Desktop dashboard

### Mini Project - Local Microservices

- [x] Node.js API service chạy `api.myapp.local`
- [x] React frontend chạy `app.myapp.local`
- [x] Simulate inter-service communication
- [x] Configure custom domains trong `/etc/hosts`

---

## Tuần 4: Shell Scripting & Automation

### Học

- [x] Zsh scripting basics: variables, loops, conditions
- [x] Functions trong shell scripts
- [x] Environment variables: export, .zshrc, .env files
- [x] Text processing: `grep`, `sed`, `awk`, `cut`
- [x] Cron jobs vs launchd (macOS scheduler)

### Thực Hành - Basic Scripts

- [x] Hello World script với shebang `#!/bin/zsh`
- [x] Script với variables và user input
- [x] If-else conditions
- [x] For loops để iterate files
- [x] Functions để reuse code

### Thực Hành - Useful DevOps Scripts

- [x] **cleanup-docker.sh**: Clean Docker images/containers

  ```bash
  #!/bin/zsh
  echo "Cleaning Docker..."
  docker system prune -af
  docker volume prune -f
  echo "Done!"
  ```

- [x] **backup-project.sh**: Backup projects to external drive

  ```bash
  #!/bin/zsh
  DATE=$(date +%Y-%m-%d)
  tar -czf ~/Backups/projects-$DATE.tar.gz ~/Projects
  echo "Backup: projects-$DATE.tar.gz"
  ```

- [x] **switch-project.sh**: Quick project switcher

  ```bash
  #!/bin/zsh
  cd ~/Projects/$1
  code .
  npm install
  npm run dev
  ```

- [x] **git-sync.sh**: Pull latest from all repos
  ```bash
  #!/bin/zsh
  for dir in ~/Projects/*/; do
    echo "Syncing $(basename $dir)..."
    cd "$dir"
    git pull
  done
  ```

### Thực Hành - Automation

- [x] Make scripts executable: `chmod +x script.sh`
- [x] Add scripts directory to PATH
- [x] Setup launchd để auto-run scripts
- [x] Create notification khi script completes
- [x] Schedule daily backup với launchd

### Mini Project - Git Hooks

- [x] Pre-commit hook: run ESLint
- [x] Pre-commit hook: run tests
- [x] Pre-push hook: check branch name
- [x] Post-commit hook: notification
- [x] Setup Husky for easier hook management

---

# THÁNG 2: Docker & Git Advanced

## Tuần 1: Docker Desktop Deep Dive

### Học - Docker Fundamentals

- [x] Docker architecture: daemon, CLI, images, containers
- [x] Images vs Containers
- [x] Docker registry: Docker Hub
- [x] Dockerfile instructions: FROM, COPY, RUN, CMD, EXPOSE
- [x] .dockerignore file
- [x] Multi-stage builds

### Thực Hành - Basic Docker Commands

- [x] `docker pull node:18-alpine`
- [x] `docker images` để list images
- [x] `docker run -it node:18-alpine sh` (interactive mode)
- [x] `docker ps` để list running containers
- [x] `docker ps -a` để list all containers
- [x] `docker stop <container>`
- [x] `docker rm <container>`
- [x] `docker rmi <image>`

### Thực Hành - Dockerfile cho Node.js

- [x] Create simple Dockerfile cho Express API

  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

- [x] Build image: `docker build -t my-api:v1 .`
- [x] Run container: `docker run -p 3000:3000 my-api:v1`
- [x] Test API trong browser/Postman
- [x] View logs: `docker logs <container>`
- [x] Exec into container: `docker exec -it <container> sh`

### Thực Hành - Optimize Dockerfile

- [x] Create multi-stage build để reduce image size

  ```dockerfile
  # Stage 1: Builder
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production

  # Stage 2: Production
  FROM node:18-alpine
  WORKDIR /app
  COPY --from=builder /app/node_modules ./node_modules
  COPY . .
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

- [x] Compare image sizes: before vs after optimization
- [x] Use .dockerignore để exclude node_modules, .git
- [x] Tag images properly: `my-api:latest`, `my-api:v1.0.0`

### Thực Hành - Docker Volumes

- [x] Create named volume: `docker volume create mongo-data`
- [x] Run MongoDB with volume: `docker run -v mongo-data:/data/db mongo`
- [x] Verify data persists after container restart
- [x] Bind mount for development: `docker run -v $(pwd):/app node:18-alpine`

### Mini Project - Containerize Full App

- [x] Dockerfile cho Express API
- [x] Dockerfile cho React frontend
- [x] Build both images
- [x] Run containers manually
- [x] Connect frontend to API container
- [x] Mount source code for hot reload
- [x] Push images to Docker Hub

---

## Tuần 2: Docker Compose

### Học - Docker Compose Fundamentals

- [x] docker-compose.yml syntax
- [x] Services, networks, volumes
- [x] Environment variables
- [x] Depends_on, healthchecks
- [x] Override files: docker-compose.override.yml

### Thực Hành - Basic Compose File

- [x] Create docker-compose.yml cho Node.js + MongoDB

  ```yaml
  version: '3.8'
  services:
    mongo:
      image: mongo:6
      ports:
        - '27017:27017'
      volumes:
        - mongo-data:/data/db
      environment:
        MONGO_INITDB_ROOT_USERNAME: admin
        MONGO_INITDB_ROOT_PASSWORD: password

    api:
      build: ./backend
      ports:
        - '3000:3000'
      depends_on:
        - mongo
      environment:
        NODE_ENV: development
        MONGO_URL: mongodb://admin:password@mongo:27017
      volumes:
        - ./backend:/app
        - /app/node_modules

  volumes:
    mongo-data:
  ```

### Thực Hành - Docker Compose Commands

- [x] `docker-compose up -d` (start all services)
- [x] `docker-compose ps` (list running services)
- [x] `docker-compose logs -f api` (follow API logs)
- [x] `docker-compose exec api sh` (exec into container)
- [x] `docker-compose restart api` (restart service)
- [x] `docker-compose down` (stop & remove containers)
- [x] `docker-compose down -v` (also remove volumes)

### Thực Hành - Multi-Service Setup

- [x] Add frontend service to docker-compose.yml
- [x] Add Redis service for caching
- [x] Configure networks để isolate services
- [x] Setup healthchecks for services
- [x] Use environment files: .env.development

### Thực Hành - Development vs Production

- [x] Create docker-compose.yml (base)
- [x] Create docker-compose.dev.yml (development overrides)
- [x] Create docker-compose.prod.yml (production overrides)
- [x] Start dev: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
- [x] Different configs: hot reload vs optimized builds

### Mini Project - Full MERN Stack

- [x] MongoDB service
- [x] Express API service (with hot reload)
- [x] React frontend service (with hot reload)
- [x] Nginx service (reverse proxy)
- [x] Redis service (caching/sessions)
- [x] All start với: `docker-compose up`
- [x] Healthchecks cho all services
- [x] Proper dependency order
- [x] Volume mounts for development
- [x] Environment variables management

---

## Tuần 3: Git Advanced Workflow

### Học - Branching Strategies

- [x] Git Flow model: main, develop, feature, release, hotfix
- [x] GitHub Flow: simple main + feature branches
- [x] Trunk-based development
- [x] When to use which strategy

### Học - Advanced Git Commands

- [x] Interactive rebase: `git rebase -i HEAD~3`
- [x] Cherry-pick: `git cherry-pick <commit-hash>`
- [x] Stash: `git stash save "message"`
- [x] Reflog: `git reflog` để recover lost commits
- [x] Reset vs Revert: `git reset`, `git revert`
- [x] Amend commit: `git commit --amend`

### Thực Hành - Branching

- [ ] Create feature branch: `git checkout -b feature/user-auth`
- [ ] Make commits với meaningful messages
- [ ] Rebase onto develop: `git rebase develop`
- [ ] Resolve merge conflicts
- [ ] Squash commits: `git rebase -i HEAD~5`
- [ ] Force push after rebase: `git push -f origin feature/user-auth`

### Thực Hành - Commit Messages

- [ ] Follow Conventional Commits format

  ```
  feat: add user authentication
  fix: resolve login redirect issue
  docs: update API documentation
  refactor: simplify auth middleware
  test: add unit tests for auth
  ```

- [ ] Write meaningful commit messages
- [ ] Keep commits atomic (one logical change)
- [ ] Use present tense: "add feature" not "added feature"

### Thực Hành - Advanced Scenarios

- [ ] Undo last commit (keep changes): `git reset HEAD~1`
- [ ] Undo last commit (discard changes): `git reset --hard HEAD~1`
- [ ] Recover deleted branch: use reflog
- [ ] Cherry-pick bug fix từ main vào develop
- [ ] Stash changes, switch branch, apply stash
- [ ] Interactive rebase để reorder/edit commits

### Thực Hành - Git Hooks

- [ ] Pre-commit hook: run linter

  ```bash
  #!/bin/sh
  npm run lint
  if [ $? -ne 0 ]; then
    echo "Linting failed!"
    exit 1
  fi
  ```

- [ ] Pre-commit hook: run tests
- [ ] Pre-push hook: check branch name
- [ ] Commit-msg hook: validate commit message format
- [ ] Setup Husky: `npm install husky -D`
- [ ] Setup lint-staged: only lint staged files

### Mini Project - Git Workflow

- [ ] Setup Git Flow cho project
- [ ] Create feature branch
- [ ] Make several commits
- [ ] Interactive rebase để clean history
- [ ] Submit pull request
- [ ] Code review process
- [ ] Merge to develop
- [ ] Create release branch
- [ ] Merge release to main
- [ ] Tag release: `git tag -a v1.0.0 -m "Release v1.0.0"`

---

## Tuần 4: Remote Server Setup & Deployment

### Học - AWS EC2 Basics

- [ ] EC2 instance types
- [ ] Security groups (firewall rules)
- [ ] SSH key pairs
- [ ] Elastic IPs
- [ ] Free tier limits

### Thực Hành - Launch EC2 Instance

- [ ] Sign up for AWS account
- [ ] Navigate to EC2 dashboard
- [ ] Launch Ubuntu 22.04 t2.micro instance
- [ ] Create/download SSH key pair
- [ ] Configure security group:
  - SSH (port 22) from your IP
  - HTTP (port 80) from anywhere
  - HTTPS (port 443) from anywhere
- [ ] Allocate Elastic IP (optional)
- [ ] Save key: `mv ~/Downloads/my-key.pem ~/.ssh/`
- [ ] Set permissions: `chmod 400 ~/.ssh/my-key.pem`

### Thực Hành - SSH Connection

- [ ] SSH into instance: `ssh -i ~/.ssh/my-key.pem ubuntu@<ec2-ip>`
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Create SSH config for easy access:
  ```
  # ~/.ssh/config
  Host my-server
    HostName <ec2-ip>
    User ubuntu
    IdentityFile ~/.ssh/my-key.pem
  ```
- [ ] Connect easily: `ssh my-server`

### Thực Hành - Server Setup

- [ ] Install Docker:
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker ubuntu
  ```
- [ ] Install Docker Compose
- [ ] Install Git
- [ ] Setup firewall: `sudo ufw allow 22,80,443/tcp`

### Thực Hành - Deploy với Docker

- [ ] Clone repository trên server
- [ ] Create .env file với production configs
- [ ] `docker-compose up -d`
- [ ] Check logs: `docker-compose logs -f`
- [ ] Test app: `curl localhost:3000`

### Thực Hành - Docker Hub Workflow

- [ ] Create Docker Hub account
- [ ] Login: `docker login`
- [ ] Tag image: `docker tag my-api:latest username/my-api:latest`
- [ ] Push: `docker push username/my-api:latest`
- [ ] Pull trên server: `docker pull username/my-api:latest`
- [ ] Run: `docker run -d -p 80:3000 username/my-api:latest`

### Thực Hành - Deployment Script

- [ ] Create deploy.sh trên Mac:

  ```bash
  #!/bin/zsh
  echo "Building image..."
  docker build -t my-api:latest .

  echo "Pushing to Docker Hub..."
  docker tag my-api:latest username/my-api:latest
  docker push username/my-api:latest

  echo "Deploying to server..."
  ssh my-server << 'EOF'
    docker pull username/my-api:latest
    docker stop my-api || true
    docker rm my-api || true
    docker run -d --name my-api -p 80:3000 username/my-api:latest
  EOF

  echo "Deployed!"
  ```

- [ ] Make executable: `chmod +x deploy.sh`
- [ ] Run: `./deploy.sh`
- [ ] Test deployment

### Mini Project - Complete Deployment Pipeline

- [ ] Full-stack app: API + Frontend + Database
- [ ] Dockerized với docker-compose
- [ ] Pushed to GitHub
- [ ] Images on Docker Hub
- [ ] Deployed on AWS EC2
- [ ] One-command deployment script
- [ ] Environment-specific configs
- [ ] Logs accessible: `docker-compose logs`
- [ ] Health checks working
- [ ] Test từ public IP

---

# CAPSTONE PROJECT: Dev-to-Production Pipeline

## Objective

Tạo complete workflow từ development trên Mac đến production deployment trên AWS.

## Requirements Checklist

### [ ] 1. Application Stack

- [ ] Express.js REST API
- [ ] React frontend (Create React App hoặc Vite)
- [ ] MongoDB database
- [ ] Redis for caching (optional)

### [ ] 2. Local Development (trên Mac)

- [ ] docker-compose.yml với all services
- [ ] Hot reload cho backend: nodemon
- [ ] Hot reload cho frontend: webpack dev server
- [ ] Custom domains trong /etc/hosts:
  - api.myapp.local → API
  - app.myapp.local → Frontend
- [ ] MongoDB data persists qua volumes
- [ ] Environment variables trong .env.development

### [ ] 3. Dockerization

- [ ] Dockerfile cho API (multi-stage build)
- [ ] Dockerfile cho Frontend (build → serve với nginx)
- [ ] .dockerignore files
- [ ] Image size < 200MB each
- [ ] Images tagged properly: v1.0.0, latest

### [ ] 4. Version Control

- [ ] Git repository trên GitHub
- [ ] Git Flow branching strategy:
  - main: production code
  - develop: development code
  - feature/\*: feature branches
- [ ] .gitignore: node_modules, .env, .DS_Store
- [ ] Pre-commit hooks:
  - ESLint
  - Prettier
  - Unit tests
- [ ] Conventional Commits messages

### [ ] 5. Production Deployment

- [ ] AWS EC2 instance (Ubuntu 22.04)
- [ ] Docker + Docker Compose installed
- [ ] Security group configured (22, 80, 443)
- [ ] docker-compose.prod.yml cho production
- [ ] Environment variables trong .env.production
- [ ] Services restart on failure

### [ ] 6. Automation

- [ ] deploy.sh script trên Mac:
  - Build images
  - Push to Docker Hub
  - SSH to server
  - Pull latest images
  - Restart containers
- [ ] One-command deployment: `./deploy.sh`
- [ ] Rollback script: `./rollback.sh`

### [ ] 7. Documentation

- [ ] README.md với:
  - Project overview
  - Tech stack
  - Setup instructions
  - Deployment instructions
  - Troubleshooting guide
- [ ] Architecture diagram (draw.io hoặc Excalidraw)
- [ ] API documentation (Swagger/Postman)

### [ ] 8. Monitoring & Logging

- [ ] Application logs accessible: `docker-compose logs -f`
- [ ] Log rotation configured
- [ ] Basic health check endpoint: `/health`
- [ ] Monitor disk space: `df -h`
- [ ] Monitor memory: `free -h`

## Bonus Challenges

- [ ] HTTPS với Let's Encrypt (Certbot)
- [ ] Nginx reverse proxy
- [ ] CI/CD với GitHub Actions (will learn in Month 3)
- [ ] Database backups automated
- [ ] Monitoring với Prometheus + Grafana
- [ ] Multiple environments: dev, staging, production

---

# Ready for Month 3?

## Self-Assessment Checklist

### Terminal & Unix

- [ ] Comfortable với iTerm2/Terminal daily
- [ ] Create/manage files/directories qua CLI
- [ ] Understand file permissions (rwx)
- [ ] Write basic shell scripts
- [ ] Use Homebrew để install/update tools

### Docker

- [ ] Understand Docker architecture
- [ ] Write optimized Dockerfiles
- [ ] Build and run containers
- [ ] Use Docker Compose cho multi-service apps
- [ ] Manage volumes và networks
- [ ] Push/pull images từ Docker Hub

### Git

- [ ] Create and manage branches
- [ ] Resolve merge conflicts
- [ ] Interactive rebase
- [ ] Use Git hooks
- [ ] Follow Git Flow workflow
- [ ] Write meaningful commit messages

### Networking

- [ ] Understand ports và IP addresses
- [ ] Use curl để test APIs
- [ ] Configure /etc/hosts
- [ ] Debug connection issues
- [ ] Basic firewall concepts

### Deployment

- [ ] SSH into remote servers
- [ ] Deploy Docker containers to cloud
- [ ] Write deployment scripts
- [ ] Manage environment variables
- [ ] Basic troubleshooting skills

---

# Resources Tổng Hợp

## Documentation

- [ ] Docker Docs: https://docs.docker.com
- [ ] Docker Compose: https://docs.docker.com/compose
- [ ] Git: https://git-scm.com/book
- [ ] AWS EC2: https://docs.aws.amazon.com/ec2
- [ ] Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

## Interactive Learning

- [ ] Learn Git Branching: https://learngitbranching.js.org
- [ ] Play with Docker: https://labs.play-with-docker.com
- [ ] Linux Journey: https://linuxjourney.com
- [ ] OverTheWire: https://overthewire.org/wargames/bandit

## Video Courses

- [ ] Docker for Beginners (FreeCodeCamp YouTube)
- [ ] Git & GitHub (The Odin Project)
- [ ] Linux Command Line (Traversy Media)

## Communities

- [ ] DevOps Vietnam (Facebook Group)
- [ ] r/devops (Reddit)
- [ ] Docker Community Slack
- [ ] Dev.to #devops tag

## Tools to Master

- [ ] iTerm2: terminal emulator
- [ ] Oh My Zsh: shell framework
- [ ] Homebrew: package manager
- [ ] Docker Desktop: containerization
- [ ] VS Code: code editor
- [ ] Postman: API testing
- [ ] Rectangle: window management

---

# Tips for Success

## Daily Habits

- [ ] Spend 1-2 hours practicing daily
- [ ] Use terminal for everything (avoid GUI when possible)
- [ ] Document what you learn
- [ ] Build something every week
- [ ] Share progress (blog, Twitter, LinkedIn)

## Learning Approach

- [ ] Practice > Theory: 80% hands-on, 20% reading
- [ ] Break things: don't fear errors
- [ ] Google efficiently: "docker node.js hot reload"
- [ ] Read error messages carefully
- [ ] Use Stack Overflow and GitHub Issues

## Project Ideas

- [ ] Personal portfolio site (Docker + CI/CD)
- [ ] URL shortener microservice
- [ ] Blog platform with admin panel
- [ ] Todo app với real-time sync
- [ ] Weather app with multiple APIs

## Networking

- [ ] Join DevOps Vietnam community
- [ ] Contribute to open-source projects
- [ ] Write blog posts about learning journey
- [ ] Help others in forums/Discord
- [ ] Attend tech meetups (online/offline)

---

# Next Steps (Month 3 Preview)

After completing Month 1-2, you'll learn:

- **CI/CD**: GitHub Actions, GitLab CI
- **Kubernetes**: Container orchestration
- **Infrastructure as Code**: Terraform
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack
- **Cloud Services**: AWS (EC2, S3, RDS, VPC)

But first, **master the fundamentals** in these 2 months!

---

# Progress Tracking

## Week 1

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 2

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 3

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 4

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 5

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 6

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 7

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

## Week 8

- Date Started: \***\*\_\_\_\*\***
- Completed Tasks: **_ / _**
- Challenges Faced: \***\*\_\_\_\*\***
- Key Learnings: \***\*\_\_\_\*\***

---

**Good luck on your DevOps journey! 🚀**

_Remember: Consistent practice beats intensive cramming. Take it one day at a time._
