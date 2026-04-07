# Tháng 3: CI/CD với GitHub Actions

> **Prerequisites:** Hoàn thành Tháng 1-2 (Linux, Docker, Git basics)
> **Focus:** Continuous Integration/Continuous Deployment
> **Main Tools:** GitHub Actions, Docker Registry, Automated Testing

---

## Mục Tiêu Tháng 3

Sau tháng này, bạn sẽ:

- [x] Hiểu khái niệm CI/CD và tầm quan trọng
- [x] Viết được GitHub Actions workflows
- [x] Tự động hóa testing, building, deployment
- [x] Setup automated Docker image builds
- [x] Deploy tự động lên server khi push code
- [x] Implement security scanning trong pipeline

---

# Tuần 1: CI/CD Fundamentals

## Học - CI/CD Concepts

### Theory

- [x] Continuous Integration (CI) là gì?
- [x] Continuous Deployment (CD) vs Continuous Delivery
- [x] Benefits của CI/CD:
    - Faster feedback
    - Early bug detection
    - Automated testing
    - Consistent deployments
- [x] CI/CD pipeline stages:
    - Source → Build → Test → Deploy
- [x] Popular CI/CD tools: Jenkins, GitLab CI, CircleCI, GitHub Actions

### GitHub Actions Architecture

- [x] Workflows: automated processes
- [x] Jobs: group of steps
- [x] Steps: individual tasks
- [x] Runners: servers executing jobs
- [x] Actions: reusable units
- [x] Triggers: events starting workflows

## Thực Hành - First GitHub Actions Workflow

### Setup Repository

- [x] Create new repository: `nodejs-cicd-demo`
- [x] Create simple Express API:
  ```javascript
  // server.js
  const express = require('express');
  const app = express();
  
  app.get('/', (req, res) => {
    res.json({ message: 'Hello CI/CD!' });
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
  });
  
  module.exports = app;
  ```

- [x] Add tests với Jest:
  ```javascript
  // server.test.js
  const request = require('supertest');
  const app = require('./server');
  
  describe('API Tests', () => {
    test('GET / returns message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Hello CI/CD!');
    });
  });
  ```

### Create First Workflow

- [x] Create `.github/workflows/ci.yml`:
  ```yaml
  name: CI Pipeline
  
  on:
    push:
      branches: [ main, develop ]
    pull_request:
      branches: [ main ]
  
  jobs:
    test:
      runs-on: ubuntu-latest
      
      steps:
        - name: Checkout code
          uses: actions/checkout@v3
        
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
        
        - name: Install dependencies
          run: npm ci
        
        - name: Run tests
          run: npm test
        
        - name: Run linter
          run: npm run lint
  ```

### Test Workflow

- [x] Push code lên GitHub
- [x] Navigate to Actions tab
- [x] Verify workflow chạy tự động
- [x] Check logs từng step
- [x] Fix errors nếu có

## Thực Hành - Advanced Triggers

### Different Trigger Types

- [x] Push to specific branches:
  ```yaml
  on:
    push:
      branches:
        - main
        - 'release/**'
  ```

- [x] Pull request events:
  ```yaml
  on:
    pull_request:
      types: [opened, synchronize, reopened]
  ```

- [ ] Scheduled runs (cron):
  ```yaml
  on:
    schedule:
      - cron: '0 2 * * *'  # Daily at 2 AM
  ```

- [x] Manual trigger:
  ```yaml
  on:
    workflow_dispatch:
      inputs:
        environment:
          description: 'Deployment environment'
          required: true
          default: 'staging'
  ```

### Path Filters

- [x] Trigger only when specific files change:
  ```yaml
  on:
    push:
      paths:
        - 'src/**'
        - 'package.json'
      paths-ignore:
        - 'docs/**'
        - '**.md'
  ```

## Mini Project Week 1

- [x] Create Node.js API với tests
- [x] Setup ESLint và Prettier
- [x] GitHub Actions workflow:
    - Run on push to main/develop
    - Run on pull requests
    - Install dependencies
    - Run linter
    - Run tests
    - Report results
- [x] Add status badge to README
- [x] Test với pull request workflow

---

# Tuần 2: Building & Docker Integration

## Học - Build Processes

### Build Strategies

- [x] Development vs Production builds
- [x] Build artifacts: compiled code, bundled assets
- [x] Caching dependencies để faster builds
- [x] Multi-stage Docker builds review
- [x] Docker layer caching

### Docker Registry Options

- [x] Docker Hub (free public, limited private)
- [x] GitHub Container Registry (ghcr.io)
- [ ] AWS ECR
- [ ] Private registries

## Thực Hành - Docker Build trong CI

### Setup Docker Build Workflow

- [x] Create `.github/workflows/docker-build.yml`:
  ```yaml
  name: Docker Build & Push
  
  on:
    push:
      branches: [ main ]
      tags:
        - 'v*'
  
  env:
    REGISTRY: ghcr.io
    IMAGE_NAME: ${{ github.repository }}
  
  jobs:
    build-and-push:
      runs-on: ubuntu-latest
      permissions:
        contents: read
        packages: write
      
      steps:
        - name: Checkout code
          uses: actions/checkout@v3
        
        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v2
        
        - name: Log in to Container Registry
          uses: docker/login-action@v2
          with:
            registry: ${{ env.REGISTRY }}
            username: ${{ github.actor }}
            password: ${{ secrets.GITHUB_TOKEN }}
        
        - name: Extract metadata
          id: meta
          uses: docker/metadata-action@v4
          with:
            images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
            tags: |
              type=ref,event=branch
              type=semver,pattern={{version}}
              type=sha,prefix={{branch}}-
        
        - name: Build and push
          uses: docker/build-push-action@v4
          with:
            context: .
            push: true
            tags: ${{ steps.meta.outputs.tags }}
            labels: ${{ steps.meta.outputs.labels }}
            cache-from: type=gha
            cache-to: type=gha,mode=max
  ```

### Docker Hub Alternative

- [x] Create Docker Hub account
- [x] Generate access token
- [x] Add to GitHub Secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- [x] Update workflow để push to Docker Hub:
  ```yaml
  - name: Log in to Docker Hub
    uses: docker/login-action@v2
    with:
      username: ${{ secrets.DOCKERHUB_USERNAME }}
      password: ${{ secrets.DOCKERHUB_TOKEN }}
  ```

## Thực Hành - Optimized Builds

### Multi-Stage Dockerfile

- [x] Review và optimize Dockerfile:
  ```dockerfile
  # Build stage
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  
  # Production stage
  FROM node:18-alpine
  WORKDIR /app
  COPY --from=builder /app/node_modules ./node_modules
  COPY . .
  USER node
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

### Build Caching

- [x] Enable GitHub Actions cache:
  ```yaml
  - name: Cache Docker layers
    uses: actions/cache@v3
    with:
      path: /tmp/.buildx-cache
      key: ${{ runner.os }}-buildx-${{ github.sha }}
      restore-keys: |
        ${{ runner.os }}-buildx-
  ```

### Test Built Image

- [x] Add step to verify image works:
  ```yaml
  - name: Test image
    run: |
      docker run -d --name test-container -p 3000:3000 ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
      sleep 5
      curl http://localhost:3000/health
      docker stop test-container
  ```

## Thực Hành - Semantic Versioning

### Git Tags và Releases

- [x] Tag commits với semantic versioning:
  ```bash
  git tag -a v1.0.0 -m "Release version 1.0.0"
  git push origin v1.0.0
  ```

- [ ] Workflow tự động tag Docker images:
    - `latest`: most recent build
    - `v1.0.0`: specific version
    - `main-sha123`: branch + commit
    - `staging`: environment tag

### Automated Release Notes

- [x] Add release notes generation:
  ```yaml
  - name: Create Release
    uses: actions/create-release@v1
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
      tag_name: ${{ github.ref }}
      release_name: Release ${{ github.ref }}
      draft: false
      prerelease: false
  ```

## Mini Project Week 2

- [x] Optimize Dockerfile cho Node.js app
- [x] GitHub Actions workflow:
    - Build Docker image on push to main
    - Tag với commit SHA và branch name
    - Push to GitHub Container Registry
    - Cache layers for faster builds
    - Test image before pushing
- [x] Add semantic versioning với Git tags
- [x] Verify images trên GitHub Packages

---

# Tuần 3: Automated Testing & Quality Gates

## Học - Testing in CI/CD

### Testing Pyramid

- [ ] Unit tests: individual functions
- [ ] Integration tests: component interactions
- [ ] E2E tests: full user workflows
- [ ] When to run each type
  [automated-testing-quality-gates.md](../docs/month3/week3/automated-testing-quality-gates.md)

### Code Quality Tools

- [x] Linters: ESLint, Prettier
- [ ] Security scanners: npm audit, Snyk
- [ ] Code coverage: Jest, Istanbul
- [ ] Static analysis: SonarQube

## Thực Hành - Comprehensive Testing Pipeline

### Unit & Integration Tests

- [ ] Add test coverage reporting:
  ```yaml
  - name: Run tests with coverage
    run: npm test -- --coverage
  
  - name: Upload coverage to Codecov
    uses: codecov/codecov-action@v3
    with:
      file: ./coverage/coverage-final.json
      fail_ci_if_error: true
  ```

### Code Quality Checks

- [x] Add linting job:
  ```yaml
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
  ```

### Security Scanning

- [ ] Add dependency vulnerability check:
  ```yaml
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  ```

## Thực Hành - Matrix Builds

### Test Multiple Node Versions

- [ ] Matrix strategy để test compatibility:
  ```yaml
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
  ```

### Multiple OS Testing

- [ ] Test trên different operating systems:
  ```yaml
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18]
    
    runs-on: ${{ matrix.os }}
  ```

## Thực Hành - Quality Gates

### Branch Protection Rules

- [ ] Navigate to Settings → Branches
- [ ] Add rule for `main` branch:
    - Require pull request reviews
    - Require status checks (CI must pass)
    - Require branches be up to date
    - Include administrators
- [ ] Test by creating PR with failing tests

### Code Review Automation

- [x] Add automatic PR comments:
  ```yaml
  - name: Comment test results
    uses: actions/github-script@v6
    if: always()
    with:
      script: |
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: '✅ All tests passed!'
        })
  ```

## Mini Project Week 3

- [ ] Comprehensive test suite:
    - Unit tests (80%+ coverage)
    - Integration tests
    - API endpoint tests
- [ ] GitHub Actions workflow:
    - Lint code (ESLint + Prettier)
    - Run tests với coverage report
    - Security audit (npm audit + Snyk)
    - Test multiple Node versions (16, 18, 20)
    - Upload coverage to Codecov
- [ ] Branch protection rules cho main
- [ ] Quality gates: CI must pass before merge

---

# Tuần 4: Automated Deployment

## Học - Deployment Strategies

### Deployment Types

- [x] Rolling deployment: gradual update
- [x] Blue-Green deployment: parallel environments
- [x] Canary deployment: partial rollout
- [x] Recreate: stop old, start new

### Environment Management

- [ ] Development
- [ ] Staging
- [ ] Production
- [ ] Environment-specific configs

## Thực Hành - Deploy to EC2

### Setup Deployment Secrets

- [ ] Add GitHub Secrets:
    - `EC2_HOST`: server IP
    - `EC2_USERNAME`: ubuntu
    - `EC2_SSH_KEY`: private SSH key
    - `DOCKERHUB_USERNAME`
    - `DOCKERHUB_TOKEN`

### SSH Deployment Workflow

- [ ] Create `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to Production
  
  on:
    push:
      branches: [ main ]
    workflow_dispatch:
  
  jobs:
    deploy:
      runs-on: ubuntu-latest
      environment: production
      
      steps:
        - name: Checkout code
          uses: actions/checkout@v3
        
        - name: Deploy to EC2
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.EC2_HOST }}
            username: ${{ secrets.EC2_USERNAME }}
            key: ${{ secrets.EC2_SSH_KEY }}
            script: |
              cd /home/ubuntu/app
              git pull origin main
              docker-compose pull
              docker-compose up -d --force-recreate
              docker system prune -f
  ```

### Docker-Based Deployment

- [ ] Alternative: deploy via Docker images:
  ```yaml
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d \
              --name myapp \
              -p 80:3000 \
              --restart unless-stopped \
              -e NODE_ENV=production \
              ${{ secrets.DOCKERHUB_USERNAME }}/myapp:latest
  ```

## Thực Hành - Multiple Environments

### Environment-Specific Workflows

- [ ] Create `.github/workflows/deploy-staging.yml`:
  ```yaml
  name: Deploy to Staging
  
  on:
    push:
      branches: [ develop ]
  
  jobs:
    deploy-staging:
      runs-on: ubuntu-latest
      environment: staging
      
      steps:
        - name: Deploy to staging server
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.STAGING_HOST }}
            username: ${{ secrets.EC2_USERNAME }}
            key: ${{ secrets.EC2_SSH_KEY }}
            script: |
              cd /home/ubuntu/app
              docker pull myapp:staging
              docker-compose -f docker-compose.staging.yml up -d
  ```

### GitHub Environments

- [ ] Navigate to Settings → Environments
- [ ] Create `staging` environment:
    - No protection rules
    - Add staging secrets
- [ ] Create `production` environment:
    - Required reviewers (yourself)
    - Deployment branches: only main
    - Add production secrets

### Manual Approval for Production

- [ ] Add approval step:
  ```yaml
  deploy-production:
    runs-on: ubuntu-latest
    environment: 
      name: production
      url: https://myapp.com
    needs: build-and-push
    
    steps:
      # Manual approval required here
      - name: Deploy to production
        # ... deployment steps
  ```

## Thực Hành - Rollback Strategy

### Versioned Deployments

- [ ] Keep multiple image versions:
  ```yaml
  - name: Deploy with version tag
    run: |
      docker pull myapp:${{ github.sha }}
      docker tag myapp:${{ github.sha }} myapp:current
      docker stop myapp-old || true
      docker rename myapp myapp-old || true
      docker run -d --name myapp myapp:current
  ```

### Manual Rollback Workflow

- [ ] Create `.github/workflows/rollback.yml`:
  ```yaml
  name: Rollback Deployment
  
  on:
    workflow_dispatch:
      inputs:
        version:
          description: 'Version to rollback to'
          required: true
  
  jobs:
    rollback:
      runs-on: ubuntu-latest
      
      steps:
        - name: Rollback to version
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.EC2_HOST }}
            username: ${{ secrets.EC2_USERNAME }}
            key: ${{ secrets.EC2_SSH_KEY }}
            script: |
              docker pull myapp:${{ github.event.inputs.version }}
              docker stop myapp
              docker rm myapp
              docker run -d --name myapp -p 80:3000 myapp:${{ github.event.inputs.version }}
  ```

## Thực Hành - Health Checks & Notifications

### Post-Deployment Verification

- [ ] Add health check after deploy:
  ```yaml
  - name: Verify deployment
    run: |
      sleep 10
      curl --fail https://myapp.com/health || exit 1
  ```

### Slack Notifications

- [ ] Add Slack webhook secret: `SLACK_WEBHOOK_URL`
- [ ] Notify on deployment:
  ```yaml
  - name: Slack notification
    uses: 8398a7/action-slack@v3
    if: always()
    with:
      status: ${{ job.status }}
      text: 'Deployment to production completed!'
      webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
  ```

## Mini Project Week 4

- [ ] Complete CI/CD pipeline:
    - **CI (on push/PR):**
        - Lint code
        - Run tests
        - Security scan
        - Build Docker image
        - Push to registry
    - **CD (on merge to main):**
        - Deploy to staging automatically
        - Run smoke tests
        - Require manual approval
        - Deploy to production
        - Health check verification
        - Slack notification
- [ ] Multiple environments: dev, staging, production
- [ ] Rollback workflow
- [ ] Environment secrets management
- [ ] Deployment history tracking

---

# CAPSTONE PROJECT: Production-Grade CI/CD Pipeline

## Objective

Build complete CI/CD pipeline cho full-stack application với automated testing, deployment, và monitoring.

## Application Stack

- [ ] Express.js REST API
- [ ] React frontend
- [ ] MongoDB database
- [ ] Docker containers
- [ ] Nginx reverse proxy

## Requirements Checklist

### [ ] 1. Source Control

- [ ] Monorepo hoặc separate repos
- [ ] Git Flow branching strategy:
    - `main`: production code
    - `develop`: development code
    - `feature/*`: feature branches
    - `hotfix/*`: urgent fixes
- [ ] Protected branches với required reviews
- [ ] Conventional Commits

### [ ] 2. Continuous Integration

**On Push/PR to any branch:**

- [ ] Install dependencies (with caching)
- [ ] Run linters (ESLint, Prettier)
- [ ] Run unit tests
- [ ] Generate coverage report
- [ ] Security audit (npm audit, Snyk)

**On Push to develop:**

- [ ] Build Docker images
- [ ] Tag with branch + SHA
- [ ] Push to staging registry
- [ ] Run integration tests

**On Push to main:**

- [ ] Build production Docker images
- [ ] Tag with version + latest
- [ ] Push to production registry
- [ ] Generate release notes

### [ ] 3. Automated Testing

- [ ] Unit tests: 80%+ coverage
- [ ] Integration tests: API endpoints
- [ ] E2E tests: critical user flows
- [ ] Performance tests: response times
- [ ] Security tests: OWASP Top 10

### [ ] 4. Multi-Environment Deployment

**Staging Environment:**

- [ ] Auto-deploy on merge to develop
- [ ] Staging-specific configs
- [ ] Smoke tests after deployment
- [ ] Accessible for QA testing

**Production Environment:**

- [ ] Manual approval required
- [ ] Deploy on merge to main
- [ ] Zero-downtime deployment
- [ ] Health checks
- [ ] Automatic rollback on failure

### [ ] 5. Docker Optimization

- [ ] Multi-stage builds
- [ ] Layer caching
- [ ] Image size < 150MB
- [ ] Security: non-root user, no secrets
- [ ] Versioned properly

### [ ] 6. Monitoring & Alerting

- [ ] Deployment notifications (Slack/Email)
- [ ] Health check endpoints
- [ ] Error tracking (Sentry optional)
- [ ] Uptime monitoring
- [ ] Failed deployment alerts

### [ ] 7. Documentation

- [ ] README with:
    - Architecture diagram
    - Setup instructions
    - CI/CD pipeline explanation
    - Deployment process
    - Rollback procedure
- [ ] CONTRIBUTING.md
- [ ] Environment variables documentation
- [ ] API documentation

### [ ] 8. Security

- [ ] No secrets in code
- [ ] Environment variables via GitHub Secrets
- [ ] Security scanning in CI
- [ ] HTTPS enabled
- [ ] Dependency updates automated (Dependabot)

## Workflow Files to Create

```
.github/
├── workflows/
│   ├── ci.yml                    # CI on all branches
│   ├── build-staging.yml         # Build & deploy to staging
│   ├── build-production.yml      # Build production images
│   ├── deploy-production.yml     # Deploy to production
│   ├── rollback.yml              # Manual rollback
│   └── security-scan.yml         # Weekly security scan
└── dependabot.yml                # Automated dependency updates
```

## Testing Checklist

### Pre-Deployment Tests

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Code coverage meets threshold
- [ ] No security vulnerabilities
- [ ] Docker images build successfully

### Post-Deployment Tests

- [ ] Health check returns 200
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Static assets load
- [ ] No console errors

## Bonus Challenges

- [ ] Blue-Green deployment strategy
- [ ] Canary deployment với gradual rollout
- [ ] Automated performance testing
- [ ] Database migrations in pipeline
- [ ] Infrastructure provisioning (Terraform preview)
- [ ] Multi-cloud deployment (AWS + DigitalOcean)
- [ ] Automated backup verification
- [ ] Chaos engineering tests

---

# Self-Assessment Checklist

After Month 3, you should be able to:

### CI/CD Fundamentals

- [ ] Explain CI/CD benefits
- [ ] Describe pipeline stages
- [ ] Choose appropriate triggers
- [ ] Design workflow dependencies

### GitHub Actions

- [ ] Write workflow files from scratch
- [ ] Use marketplace actions effectively
- [ ] Implement matrix builds
- [ ] Manage secrets securely
- [ ] Debug failed workflows

### Automated Testing

- [ ] Integrate different test types
- [ ] Generate coverage reports
- [ ] Implement quality gates
- [ ] Security scanning
- [ ] Performance testing

### Docker in CI/CD

- [ ] Build optimized images
- [ ] Implement layer caching
- [ ] Tag images properly
- [ ] Push to multiple registries
- [ ] Security scan images

### Deployment

- [ ] Deploy to multiple environments
- [ ] Implement approval workflows
- [ ] Zero-downtime deployment
- [ ] Rollback procedures
- [ ] Health checks & monitoring

---

# Resources

## Documentation

- [ ] GitHub Actions: https://docs.github.com/actions
- [ ] Docker Build: https://docs.docker.com/build/ci/github-actions/
- [ ] GitHub Environments: https://docs.github.com/actions/deployment/environments

## Learning Platforms

- [ ] GitHub Actions by Example: https://www.actionsbyexample.com
- [ ] GitHub Learning Lab: CI/CD courses
- [ ] FreeCodeCamp: GitHub Actions tutorial (YouTube)

## Tools & Services

- [ ] GitHub Container Registry (ghcr.io)
- [ ] Codecov: https://codecov.io
- [ ] Snyk: https://snyk.io
- [ ] Sentry: https://sentry.io

## Best Practices

- [ ] GitHub Actions Best Practices
- [ ] Docker Best Practices
- [ ] The Twelve-Factor App: https://12factor.net

---

# Common Issues & Solutions

## Workflow Not Triggering

- [ ] Check workflow syntax with VS Code extension
- [ ] Verify trigger conditions match your use case
- [ ] Check if workflows are enabled in repo settings

## Build Failures

- [ ] Review logs carefully
- [ ] Test commands locally first
- [ ] Check environment variables are set
- [ ] Verify dependencies are cached correctly

## Docker Build Issues

- [ ] Ensure Dockerfile is at root
- [ ] Check .dockerignore excludes correctly
- [ ] Verify build context is correct
- [ ] Use `docker build` locally first

## Deployment Failures

- [ ] Verify SSH keys are correct format
- [ ] Check server firewall rules
- [ ] Ensure target directory exists
- [ ] Test SSH connection manually
- [ ] Review server logs

---

# Next Steps (Month 4-5 Preview)

After mastering CI/CD with GitHub Actions, you'll learn:

- **Kubernetes Basics**: Container orchestration at scale
- **Helm Charts**: Package management for K8s
- **Service Mesh**: Advanced networking
- **Local K8s**: Minikube, Kind
- **K8s CI/CD**: Deploy to clusters

**Keep practicing CI/CD concepts** - they're fundamental to everything ahead!

---

# Progress Tracking

## Week 1: CI/CD Fundamentals

- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________
- Challenges: ___________

## Week 2: Building & Docker

- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________
- Challenges: ___________

## Week 3: Testing & Quality

- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________
- Challenges: ___________

## Week 4: Deployment

- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________
- Challenges: ___________

## Capstone Project

- Date Started: ___________
- Date Completed: ___________
- GitHub Repo: ___________
- Deployment URL: ___________
- Key Achievements: ___________

---

**You're building real DevOps skills! 🚀**

*Remember: CI/CD is about automation, reliability, and speed. Every manual step is an opportunity for automation!*
