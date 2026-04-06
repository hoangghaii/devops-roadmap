# 🚀 Complete Guide to GitHub CI/CD, Workflows & Actions

**From Fundamentals to Production-Ready Pipelines**

*A comprehensive learning guide for developers with Git experience learning CI/CD from scratch*

---

## 📚 Table of Contents

**Part 1: CI/CD Foundations**
- [What is CI/CD?](#what-is-cicd)
- [The Problems CI/CD Solves](#the-problems-cicd-solves)
- [Key Concepts & Terminology](#key-concepts--terminology)
- [How CI/CD Connects to Git](#how-cicd-connects-to-git)

**Part 2: GitHub Actions Basics**
- [Introduction to GitHub Actions](#introduction-to-github-actions)
- [Anatomy of a Workflow](#anatomy-of-a-workflow)
- [YAML Syntax Essentials](#yaml-syntax-essentials)
- [Triggers and Events](#triggers-and-events)

**Part 3: Hands-On Tutorials**
- [Tutorial 1: Your First Workflow](#tutorial-1-your-first-workflow)
- [Tutorial 2: Automated Testing](#tutorial-2-automated-testing)
- [Tutorial 3: Linting & Code Quality](#tutorial-3-linting--code-quality)
- [Tutorial 4: Building Docker Images](#tutorial-4-building-docker-images)
- [Tutorial 5: Complete CI/CD Pipeline](#tutorial-5-complete-cicd-pipeline)

**Part 4: Advanced Concepts**
- [Secrets & Environment Variables](#secrets--environment-variables)
- [Matrix Builds](#matrix-builds)
- [Caching for Speed](#caching-for-speed)
- [Deployment Strategies](#deployment-strategies)

**Part 5: Real-World Examples**
- [React + Vite CI/CD](#react--vite-cicd)
- [Node.js API CI/CD](#nodejs-api-cicd)
- [Docker Multi-Stage Build](#docker-multi-stage-build)
- [Production Deployment](#production-deployment)

---

# Part 1: CI/CD Foundations

## What is CI/CD?

### 🎯 Simple Definition

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment/Delivery**

Think of it as an **automated assembly line** for your code:

```
You write code → Push to Git → Automated tests run → Build app → Deploy to production
                                     ↑                    ↑              ↑
                              Continuous Integration   |      Continuous Deployment
                                                        |
                                               Continuous Delivery
```

### 📖 Detailed Breakdown

#### **Continuous Integration (CI)**
Automatically testing and validating code changes

**What it does:**
```
Developer pushes code
        ↓
CI automatically:
1. Runs all tests
2. Checks code quality
3. Builds the application
4. Reports results
        ↓
If successful: ✅ Code is ready to merge
If failed: ❌ Developer gets notified
```

#### **Continuous Delivery (CD)**
Code is always in a deployable state

**What it does:**
```
Code passes CI
        ↓
CD automatically:
1. Builds deployment packages
2. Creates Docker images
3. Runs integration tests
4. Stages in pre-production
        ↓
Ready to deploy (manual button press)
```

#### **Continuous Deployment (CD)**
Automatically deploy to production

**What it does:**
```
Code passes all checks
        ↓
Automatically deploys to production
        ↓
Users get new features immediately
```

---

## The Problems CI/CD Solves

### ❌ Without CI/CD (Traditional Development)

**Scenario:** You're on a team building a React app

```
Monday:
- Alice: Works on login feature, commits to branch
- Bob: Works on profile page, commits to branch
- You: Works on settings page, commits to branch

Friday:
- Time to merge! 🤞
- Alice merges → ✅ Works
- Bob merges → ❌ BREAKS! Conflicts with Alice's code
- You merge → ❌ BREAKS! Tests fail
- Weekend ruined debugging... 😰

Deploy to production:
- Manual checklist: 50 steps
- "Did you run the tests?" "Oops, forgot!"
- "Did you update the database?" "Oh no..."
- Production is down! 🔥
```

**Problems:**
1. ❌ Integration issues discovered late
2. ❌ Manual testing is slow and error-prone
3. ❌ Deployment is risky and stressful
4. ❌ Can't deploy on Friday (too risky!)
5. ❌ "It works on my machine" syndrome

---

### ✅ With CI/CD (Modern Development)

**Same Scenario:** Building a React app with CI/CD

```
Monday:
- Alice: Commits login feature → CI runs automatically
  ✅ Tests pass
  ✅ Code quality good
  ✅ Builds successfully
  → Safe to continue

- Bob: Commits profile page → CI runs
  ✅ All checks pass
  → Safe to continue

- You: Commit settings page → CI runs
  ❌ Tests fail!
  → Get notified immediately
  → Fix it in 10 minutes
  → Push again → ✅ All green

Friday:
- Alice merges → CI runs on main branch → ✅
- Bob merges → CI runs → ✅
- You merge → CI runs → ✅
- Deploy button → Automatic deployment → ✅
- Go home early! 🎉
```

**Benefits:**
1. ✅ Catch bugs immediately (not on Friday)
2. ✅ Automated testing (never forget)
3. ✅ Safe deployments (automated checklist)
4. ✅ Deploy anytime (even Friday!)
5. ✅ Faster development
6. ✅ Better code quality

---

## Key Concepts & Terminology

### 🔑 Essential Terms

#### **1. Workflow**
A automated process defined in YAML file

**Analogy:** Like a recipe
```yaml
# Recipe for "Deploy React App"
name: Deploy React App
on: [push]
jobs:
  build:
    steps:
      - Test the code
      - Build the app
      - Deploy to server
```

#### **2. Job**
A set of steps that run on the same machine

**Analogy:** One cook doing a part of the recipe
```yaml
jobs:
  test:      # Job 1: Testing
    steps:
      - Run unit tests
      - Run e2e tests
  
  build:     # Job 2: Building
    steps:
      - Build app
      - Create Docker image
```

#### **3. Step**
Individual task within a job

**Analogy:** One instruction in the recipe
```yaml
steps:
  - name: Install dependencies  # Step 1
    run: npm install
  
  - name: Run tests             # Step 2
    run: npm test
```

#### **4. Action**
Reusable command/script

**Analogy:** Pre-made ingredient (don't make from scratch)
```yaml
steps:
  - uses: actions/checkout@v3   # Action: Get your code
  - uses: actions/setup-node@v3 # Action: Install Node.js
```

#### **5. Runner**
Server that runs your workflows

**Analogy:** The kitchen where cooking happens
```
GitHub-hosted runners:
- Ubuntu Linux
- Windows
- macOS

Self-hosted runners:
- Your own servers
```

#### **6. Trigger/Event**
What starts the workflow

**Analogy:** When to start cooking
```yaml
on:
  push:              # When code is pushed
  pull_request:      # When PR is created
  schedule:          # On a schedule (cron)
  workflow_dispatch: # Manual trigger
```

---

### 📊 Visual: How It All Connects

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  .github/workflows/ci.yml  ← WORKFLOW FILE             │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ on: push           ← TRIGGER/EVENT                │ │
│  │                                                   │ │
│  │ jobs:                                             │ │
│  │   test:            ← JOB 1                        │ │
│  │     runs-on: ubuntu-latest  ← RUNNER             │ │
│  │     steps:                                        │ │
│  │       - uses: actions/checkout@v3  ← ACTION      │ │
│  │       - run: npm test              ← STEP        │ │
│  │                                                   │ │
│  │   build:           ← JOB 2                        │ │
│  │     steps:                                        │ │
│  │       - run: npm run build         ← STEP        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

When you: git push
        ↓
Trigger: "push" event
        ↓
GitHub starts: Workflow
        ↓
Spins up: Runner (Ubuntu VM)
        ↓
Executes: Jobs (in parallel or sequence)
        ↓
Each job: Runs steps
        ↓
Result: ✅ Success or ❌ Failure
```

---

## How CI/CD Connects to Git

### 🔗 Your Git Knowledge + CI/CD

You already know Git commands. CI/CD **builds on top of that**!

#### **Git Workflow (What You Know):**
```bash
git checkout -b feature/login
# ... write code ...
git add .
git commit -m "Add login feature"
git push origin feature/login
# Create pull request on GitHub
# Code review
git checkout main
git merge feature/login
```

#### **Git + CI/CD Workflow (What You'll Learn):**
```bash
git checkout -b feature/login
# ... write code ...
git add .
git commit -m "Add login feature"
git push origin feature/login
        ↓
┌─────────────────────────────────────┐
│  GitHub Actions (Automatic!)       │
│  1. Run tests                      │
│  2. Run linter                     │
│  3. Build app                      │
│  4. Report results on PR           │
└─────────────────────────────────────┘
        ↓
# Create pull request
# ✅ All checks passed (shown on PR)
# Code review
# Merge button only enabled if CI passes!
git checkout main
git merge feature/login
        ↓
┌─────────────────────────────────────┐
│  GitHub Actions (Automatic!)       │
│  1. Run full test suite            │
│  2. Build production app           │
│  3. Deploy to production           │
└─────────────────────────────────────┘
        ↓
# Users see your changes! 🎉
```

### 📊 Git Events That Trigger CI/CD

| Git Action | What You Do | CI/CD Trigger | Example Use |
|------------|-------------|---------------|-------------|
| `git push` | Push commits | `on: push` | Run tests on every commit |
| Create PR | Open pull request | `on: pull_request` | Validate PR before merge |
| Merge to main | Merge PR | `on: push` (main branch) | Deploy to production |
| Create tag | `git tag v1.0.0` | `on: push` (tags) | Create release |
| Schedule | N/A | `on: schedule` | Nightly builds, backups |

---

# Part 2: GitHub Actions Basics

## Introduction to GitHub Actions

### 🎯 What is GitHub Actions?

GitHub Actions is GitHub's built-in **CI/CD platform**

**Key Features:**
- ✅ Free for public repos (2,000 minutes/month for private)
- ✅ Runs directly on GitHub
- ✅ Integrated with pull requests
- ✅ Marketplace with 1000+ pre-built actions
- ✅ Matrix builds (test on multiple versions)

### 📁 Where Workflows Live

```
your-repo/
├── .github/
│   └── workflows/
│       ├── ci.yml           ← Your workflow files
│       ├── deploy.yml
│       └── release.yml
├── src/
├── package.json
└── README.md
```

**Important:** Must be in `.github/workflows/` folder!

---

## Anatomy of a Workflow

### 📝 Basic Structure

```yaml
name: CI                    # 1. Workflow name (shows in GitHub UI)

on: [push, pull_request]   # 2. When to run (triggers)

jobs:                       # 3. Jobs to run
  test:                     # Job ID
    runs-on: ubuntu-latest  # 4. What OS to use
    
    steps:                  # 5. Steps to execute
      - name: Checkout code       # Step name
        uses: actions/checkout@v3 # Use an action
      
      - name: Install dependencies
        run: npm install          # Run a command
      
      - name: Run tests
        run: npm test
```

### 🔍 Line-by-Line Breakdown

#### **1. Workflow Name**
```yaml
name: CI
```
- Shows up in GitHub's "Actions" tab
- Make it descriptive: "Test and Deploy", "Docker Build", etc.

#### **2. Triggers**
```yaml
on: [push, pull_request]
```
**Options:**
```yaml
# Simple: Any push
on: push

# Multiple events
on: [push, pull_request]

# Specific branches
on:
  push:
    branches:
      - main
      - develop

# Specific paths
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
```

#### **3. Jobs**
```yaml
jobs:
  test:     # Job 1
    # ...
  build:    # Job 2
    # ...
```
- Jobs run in **parallel** by default
- Can make sequential with `needs:`

#### **4. Runner**
```yaml
runs-on: ubuntu-latest
```
**Options:**
- `ubuntu-latest` (Linux - most common)
- `windows-latest` (Windows)
- `macos-latest` (macOS)

#### **5. Steps**
```yaml
steps:
  - uses: actions/checkout@v3   # Use an action
  - run: npm install            # Run shell command
```

---

## YAML Syntax Essentials

### 📖 Quick YAML Guide for GitHub Actions

**YAML = "YAML Ain't Markup Language"**
Simple data format using indentation

#### **Key-Value Pairs**
```yaml
name: My Workflow
version: 1.0
```

#### **Lists**
```yaml
# Inline
on: [push, pull_request]

# Multi-line
on:
  - push
  - pull_request
```

#### **Nested Objects**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test
        run: npm test
```

#### **Multi-line Strings**
```yaml
# Preserve newlines (|)
script: |
  echo "Line 1"
  echo "Line 2"
  npm test

# Fold newlines (>)
description: >
  This is a long
  description that
  gets folded into
  one line
```

#### **Comments**
```yaml
# This is a comment
name: CI  # Inline comment
```

#### **Environment Variables**
```yaml
env:
  NODE_VERSION: 20
  API_URL: https://api.example.com

steps:
  - run: echo $NODE_VERSION  # Access with $
```

#### **Common Mistakes**
```yaml
# ❌ Wrong: Inconsistent indentation
jobs:
  test:
  runs-on: ubuntu-latest

# ✅ Correct: Consistent 2-space indentation
jobs:
  test:
    runs-on: ubuntu-latest

# ❌ Wrong: Missing quotes for special characters
name: CI: Test & Deploy

# ✅ Correct: Quoted strings
name: "CI: Test & Deploy"

# ❌ Wrong: Tabs instead of spaces
jobs:
→test:  # Tab character

# ✅ Correct: Spaces only
jobs:
  test:  # 2 spaces
```

---

## Triggers and Events

### 🎯 Common Triggers

#### **1. Push Event**
```yaml
# Any push to any branch
on: push

# Specific branches only
on:
  push:
    branches:
      - main
      - develop
      - 'release/**'  # Pattern: release/v1, release/v2

# Exclude branches
on:
  push:
    branches-ignore:
      - 'temp/**'

# Specific files
on:
  push:
    paths:
      - 'src/**'
      - '**.js'
      - 'package.json'

# Exclude files
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

#### **2. Pull Request Event**
```yaml
# Any PR
on: pull_request

# Specific PR actions
on:
  pull_request:
    types:
      - opened        # PR is created
      - synchronize   # New commits pushed
      - reopened      # PR is reopened
    
    branches:
      - main         # PRs targeting main only
```

#### **3. Schedule (Cron)**
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
    - cron: '0 */6 * * *'  # Every 6 hours
```

**Cron Syntax:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday - Saturday)
│ │ │ │ │
0 0 * * *  # Every day at midnight
```

Examples:
```yaml
'0 9 * * 1'    # 9 AM every Monday
'*/15 * * * *' # Every 15 minutes
'0 0 1 * *'    # First day of every month
```

#### **4. Manual Trigger**
```yaml
on: workflow_dispatch

# With inputs
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
```

#### **5. Multiple Triggers**
```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

#### **6. Tag Events**
```yaml
on:
  push:
    tags:
      - 'v*'        # v1.0.0, v2.0.0
      - 'release-*' # release-1, release-2
```

---

# Part 3: Hands-On Tutorials

## Tutorial 1: Your First Workflow

### 🎯 Goal
Create a simple "Hello World" workflow that runs when you push code

### 📝 Step-by-Step

#### **Step 1: Create the Workflow File**

```bash
# In your repository
mkdir -p .github/workflows
cd .github/workflows
touch hello-world.yml
```

#### **Step 2: Write the Workflow**

```yaml
# .github/workflows/hello-world.yml
name: Hello World

# Run on every push
on: push

jobs:
  greet:
    # Use Ubuntu
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Print a message
      - name: Say Hello
        run: echo "Hello, GitHub Actions!"
      
      # Step 2: Print date
      - name: Print Date
        run: date
      
      # Step 3: List files
      - name: List Files
        run: ls -la
      
      # Step 4: Show environment
      - name: Show Environment
        run: |
          echo "GitHub Actor: ${{ github.actor }}"
          echo "Repository: ${{ github.repository }}"
          echo "Branch: ${{ github.ref }}"
```

#### **Step 3: Commit and Push**

```bash
git add .github/workflows/hello-world.yml
git commit -m "Add first workflow"
git push origin main
```

#### **Step 4: Check Results**

1. Go to your GitHub repository
2. Click "Actions" tab
3. See your workflow running! 🎉

**You should see:**
```
✅ Hello World
   └─ greet
      ├─ Say Hello
      ├─ Print Date
      ├─ List Files
      └─ Show Environment
```

### 🎓 What You Learned

- ✅ Created workflow file in `.github/workflows/`
- ✅ Used `on: push` trigger
- ✅ Defined a job with multiple steps
- ✅ Used `run:` to execute shell commands
- ✅ Accessed GitHub context variables

---

## Tutorial 2: Automated Testing

### 🎯 Goal
Automatically run tests every time you push code

### 📋 Prerequisites
```bash
# You need a project with tests
npm init -y
npm install --save-dev vitest
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 📝 Step-by-Step

#### **Step 1: Create Test File**

```javascript
// src/math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```javascript
// src/math.test.js
import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math Functions', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
```

#### **Step 2: Create Workflow**

```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Get the code
      - name: Checkout code
        uses: actions/checkout@v3
      
      # 2. Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci
      
      # 4. Run tests
      - name: Run tests
        run: npm test
```

#### **Step 3: Test It**

```bash
# Make a change to trigger workflow
echo "// test" >> src/math.js
git add .
git commit -m "Test CI workflow"
git push
```

#### **Step 4: Verify**

Go to Actions tab → See tests running! ✅

### 🎓 What You Learned

- ✅ Used `actions/checkout@v3` to get code
- ✅ Used `actions/setup-node@v3` to install Node.js
- ✅ Used `npm ci` for clean install
- ✅ Ran tests automatically on push

---

## Tutorial 3: Linting & Code Quality

### 🎯 Goal
Add ESLint and Prettier checks to ensure code quality

### 📋 Prerequisites

```bash
npm install --save-dev eslint prettier
npx eslint --init
```

### 📝 Step-by-Step

#### **Step 1: Setup ESLint and Prettier**

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "lint": "eslint . --ext .js,.jsx",
    "format": "prettier --write \"src/**/*.{js,jsx}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx}\""
  }
}
```

#### **Step 2: Create Workflow**

```yaml
# .github/workflows/quality.yml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      # Linting
      - name: Run ESLint
        run: npm run lint
      
      # Format checking
      - name: Check Prettier
        run: npm run format:check
      
      # Tests
      - name: Run tests
        run: npm test
```

#### **Step 3: Test with Bad Code**

```javascript
// src/bad-code.js
const x=1+2  // Missing semicolon, bad spacing
console.log( x )
```

```bash
git add src/bad-code.js
git commit -m "Add bad code"
git push
```

**Result:** CI should FAIL! ❌

#### **Step 4: Fix and Retry**

```bash
npm run format
npm run lint -- --fix
git add .
git commit -m "Fix linting issues"
git push
```

**Result:** CI should PASS! ✅

### 🎓 What You Learned

- ✅ Added linting to CI pipeline
- ✅ Added format checking
- ✅ Combined multiple quality checks
- ✅ CI catches bad code before merge!

---

## Tutorial 4: Building Docker Images

### 🎯 Goal
Build and push Docker images on every release

### 📝 Step-by-Step

#### **Step 1: Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

#### **Step 2: Create Workflow**

```yaml
# .github/workflows/docker.yml
name: Build Docker Image

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      # Docker BuildX (for better builds)
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      # Login to Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      # Build and push
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            myusername/myapp:latest
            myusername/myapp:${{ github.sha }}
```

#### **Step 3: Add Secrets**

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password/token

#### **Step 4: Push and Build**

```bash
git add .
git commit -m "Add Docker build workflow"
git push
```

**Result:** Docker image built and pushed! 🐳

### 🎓 What You Learned

- ✅ Used Docker actions
- ✅ Worked with GitHub secrets
- ✅ Built and pushed Docker images
- ✅ Tagged images with commit SHA

---

## Tutorial 5: Complete CI/CD Pipeline

### 🎯 Goal
Build a production-ready pipeline for Vite React app

### 📝 Complete Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============================================================================
  # JOB 1: Code Quality & Testing
  # ============================================================================
  test:
    name: Test & Quality Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check Prettier
        run: npm run format:check
      
      - name: Run unit tests
        run: npm test
      
      - name: Run test coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  # ============================================================================
  # JOB 2: Build Application
  # ============================================================================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test  # Wait for tests to pass
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  # ============================================================================
  # JOB 3: Build Docker Image
  # ============================================================================
  docker:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to GitHub Container Registry
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
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ============================================================================
  # JOB 4: Deploy to Production
  # ============================================================================
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main'
    
    environment:
      name: production
      url: https://myapp.com
    
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/myapp
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### 📊 Pipeline Visualization

```
git push
    ↓
┌─────────────────────────────────────────┐
│ JOB 1: Test                             │
│ ✅ ESLint                               │
│ ✅ Prettier                             │
│ ✅ Unit tests                           │
│ ✅ Coverage                             │
└─────────────────────────────────────────┘
    ↓ (if success)
┌─────────────────────────────────────────┐
│ JOB 2: Build                            │
│ ✅ npm run build                        │
│ ✅ Upload artifacts                     │
└─────────────────────────────────────────┘
    ↓ (if success + main branch)
┌─────────────────────────────────────────┐
│ JOB 3: Docker                           │
│ ✅ Build image                          │
│ ✅ Push to registry                     │
└─────────────────────────────────────────┘
    ↓ (if success + main branch)
┌─────────────────────────────────────────┐
│ JOB 4: Deploy                           │
│ ✅ SSH to server                        │
│ ✅ Pull new image                       │
│ ✅ Restart containers                   │
└─────────────────────────────────────────┘
    ↓
🎉 Live on production!
```

### 🎓 What You Learned

- ✅ Multi-job pipeline with dependencies
- ✅ Conditional execution (main branch only)
- ✅ Artifact upload/download
- ✅ Environment protection
- ✅ Complete end-to-end automation

---

# Part 4: Advanced Concepts

## Secrets & Environment Variables

### 🔐 Managing Secrets

#### **Types of Secrets**

1. **Repository Secrets** (one repo)
2. **Organization Secrets** (all repos)
3. **Environment Secrets** (specific environment)

#### **Adding Secrets**

**Via GitHub UI:**
```
Repository → Settings → Secrets and variables → Actions
→ New repository secret
```

**Common Secrets:**
```
DOCKER_USERNAME
DOCKER_PASSWORD
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
API_KEY
SSH_PRIVATE_KEY
```

#### **Using Secrets**

```yaml
steps:
  - name: Use secret
    run: echo "API Key is ${{ secrets.API_KEY }}"
    # GitHub masks secrets in logs automatically!
  
  - name: Login to Docker Hub
    uses: docker/login-action@v2
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}
```

#### **Environment Variables**

```yaml
# Workflow-level
env:
  NODE_VERSION: '20'
  API_URL: https://api.example.com

jobs:
  build:
    # Job-level
    env:
      BUILD_ENV: production
    
    steps:
      # Step-level
      - name: Build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
        run: npm run build
```

**Access in scripts:**
```yaml
- name: Print env
  run: |
    echo "Node version: $NODE_VERSION"
    echo "API URL: $API_URL"
```

---

## Matrix Builds

### 🎯 Test on Multiple Versions/OS

#### **Basic Matrix**

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 21]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      
      - run: npm ci
      - run: npm test
```

**This creates 9 jobs:**
```
ubuntu + node 18
ubuntu + node 20
ubuntu + node 21
windows + node 18
windows + node 20
windows + node 21
macos + node 18
macos + node 20
macos + node 21
```

#### **Matrix with Includes/Excludes**

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    include:
      # Add specific combination
      - os: macos-latest
        node: 20
    exclude:
      # Remove specific combination
      - os: windows-latest
        node: 18
```

**Results in:**
```
✅ ubuntu + node 18
✅ ubuntu + node 20
❌ windows + node 18  (excluded)
✅ windows + node 20
✅ macos + node 20    (included)
```

#### **Real-World Example**

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false  # Don't cancel other jobs if one fails
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20]
        include:
          - os: ubuntu-latest
            node: 20
            coverage: true
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      
      - run: npm ci
      - run: npm test
      
      # Only run coverage on ubuntu + node 20
      - name: Coverage
        if: matrix.coverage
        run: npm run test:coverage
```

---

## Caching for Speed

### ⚡ Speed Up Workflows

#### **npm Cache**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '20'
    cache: 'npm'  # ✅ Automatic caching!

- run: npm ci  # Uses cache if package-lock.json unchanged
```

**Speed improvement:**
```
Without cache: npm ci takes 60 seconds
With cache:    npm ci takes 10 seconds
```

#### **Manual Cache**

```yaml
- name: Cache node_modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci
```

#### **Docker Layer Cache**

```yaml
- name: Build Docker image
  uses: docker/build-push-action@v4
  with:
    context: .
    push: true
    cache-from: type=gha      # ✅ Use GitHub Actions cache
    cache-to: type=gha,mode=max
```

---

## Deployment Strategies

### 🚀 Different Deployment Approaches

#### **1. Direct SSH Deployment**

```yaml
deploy:
  runs-on: ubuntu-latest
  
  steps:
    - name: Deploy via SSH
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /opt/myapp
          git pull
          npm install
          pm2 restart myapp
```

#### **2. Docker Deployment**

```yaml
deploy:
  runs-on: ubuntu-latest
  
  steps:
    - name: Deploy Docker container
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          docker pull myapp:latest
          docker-compose up -d
```

#### **3. Cloud Platform Deployment**

**Vercel:**
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**AWS:**
```yaml
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- run: aws s3 sync dist/ s3://my-bucket
```

#### **4. Environment Protection**

```yaml
deploy:
  runs-on: ubuntu-latest
  
  environment:
    name: production
    url: https://myapp.com
  
  steps:
    - name: Deploy
      run: ./deploy.sh
```

**Features:**
- ✅ Manual approval required
- ✅ Environment-specific secrets
- ✅ Deployment history
- ✅ Rollback capability

---

# Part 5: Real-World Examples

## React + Vite CI/CD

### 📦 Complete Vite React Workflow

```yaml
# .github/workflows/vite-react.yml
name: Vite React CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # Quality checks
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: E2E tests
        run: npm run test:e2e

  # Build
  build:
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  # Deploy
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: dist
```

---

## Node.js API CI/CD

### 🔧 Complete Node.js API Workflow

```yaml
# .github/workflows/nodejs-api.yml
name: Node.js API CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
        run: npm test
      
      - name: Test coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-and-deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            myusername/api:latest
            myusername/api:${{ github.sha }}
      
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myusername/api:latest
            docker-compose up -d
```

---

## Docker Multi-Stage Build

### 🐳 Optimized Docker Build Workflow

```yaml
# .github/workflows/docker-multi-stage.yml
name: Docker Multi-Stage Build

on:
  push:
    branches: [main]
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to GitHub Container Registry
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
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha
      
      # Build and test
      - name: Build test image
        uses: docker/build-push-action@v4
        with:
          context: .
          target: tester
          load: true
          tags: test-image
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Run tests in Docker
        run: docker run --rm test-image
      
      # Build production
      - name: Build and push production
        uses: docker/build-push-action@v4
        with:
          context: .
          target: production
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## Production Deployment

### 🚀 Zero-Downtime Deployment

```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    environment:
      name: production
      url: https://myapp.com
    
    steps:
      - uses: actions/checkout@v3
      
      # Build
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.ref_name }} .
          docker tag myapp:${{ github.ref_name }} myapp:latest
      
      # Push to registry
      - name: Login to registry
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Push images
        run: |
          docker push myapp:${{ github.ref_name }}
          docker push myapp:latest
      
      # Deploy with zero downtime
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Pull new image
            docker pull myapp:latest
            
            # Start new containers
            docker-compose up -d --no-deps --scale web=2 web
            
            # Wait for health check
            sleep 30
            
            # Remove old containers
            docker-compose up -d --no-deps --scale web=1 --remove-orphans web
            
            # Clean up
            docker system prune -f
      
      # Notify
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployed ${{ github.ref_name }} to production'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📚 Useful Actions from Marketplace

### 🎯 Essential Actions

```yaml
# Checkout code
- uses: actions/checkout@v3

# Setup languages
- uses: actions/setup-node@v3
- uses: actions/setup-python@v4
- uses: actions/setup-go@v4

# Docker
- uses: docker/setup-buildx-action@v2
- uses: docker/login-action@v2
- uses: docker/build-push-action@v4
- uses: docker/metadata-action@v4

# Deployment
- uses: appleboy/ssh-action@master
- uses: aws-actions/configure-aws-credentials@v2

# Artifacts
- uses: actions/upload-artifact@v3
- uses: actions/download-artifact@v3

# Cache
- uses: actions/cache@v3

# Testing
- uses: codecov/codecov-action@v3

# Notifications
- uses: 8398a7/action-slack@v3
```

---

## 🎓 Best Practices Checklist

### ✅ Do's

- ✅ Use specific action versions (`@v3`, not `@main`)
- ✅ Cache dependencies for speed
- ✅ Use matrix builds for multiple versions
- ✅ Fail fast in PRs, not in main
- ✅ Use environments for deployment protection
- ✅ Add status badges to README
- ✅ Use secrets for sensitive data
- ✅ Clean up artifacts regularly
- ✅ Use concurrency control
- ✅ Add timeout limits

### ❌ Don'ts

- ❌ Don't commit secrets to code
- ❌ Don't use `latest` tag for actions
- ❌ Don't run unnecessary jobs on every push
- ❌ Don't install dependencies twice
- ❌ Don't skip tests
- ❌ Don't deploy without approval
- ❌ Don't ignore security alerts

---

## 🔧 Troubleshooting

### Common Issues

#### **1. Workflow not triggering**

**Check:**
- File is in `.github/workflows/`
- YAML syntax is valid
- Trigger matches event (push, PR, etc.)
- Branch name is correct

#### **2. Tests failing in CI but pass locally**

**Common causes:**
- Missing environment variables
- Different Node version
- Clean `node_modules` (use `npm ci`)
- Timezone differences

**Solution:**
```yaml
- name: Debug environment
  run: |
    node --version
    npm --version
    env | sort
```

#### **3. Slow builds**

**Solutions:**
- Add caching
- Use matrix strategically
- Parallelize jobs
- Use smaller Docker images

#### **4. Out of minutes**

**Solutions:**
- Optimize workflows
- Use caching
- Self-hosted runners
- Reduce matrix size

---

## 📊 Status Badges

Add to your README:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Deploy](https://github.com/username/repo/workflows/Deploy/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

---

## 🎯 Next Steps

1. ✅ **Practice:** Create your first workflow
2. ✅ **Experiment:** Try different triggers
3. ✅ **Build:** Add testing to your projects
4. ✅ **Deploy:** Automate deployments
5. ✅ **Optimize:** Add caching and matrix builds
6. ✅ **Share:** Show your CI/CD to the team!

---

## 📚 Additional Resources

**Official Documentation:**
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

**Learning:**
- [GitHub Learning Lab](https://lab.github.com/)
- [Awesome Actions](https://github.com/sdras/awesome-actions)

---

**🎉 Congratulations! You now have a solid foundation in GitHub CI/CD!**

Start with Tutorial 1 and work your way through. Each tutorial builds on the previous one. Don't try to learn everything at once - practice makes perfect!

Good luck on your CI/CD journey! 🚀
