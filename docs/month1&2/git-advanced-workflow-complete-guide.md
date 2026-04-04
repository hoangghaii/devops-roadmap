# 🌳 Git Advanced Workflow - Complete Guide

## Mastering Git Branching Strategies and Advanced Commands

**Target Audience:** Developers who know basic Git (add, commit, push, pull) and want to level up

**What You'll Learn:**

- Professional branching strategies (Git Flow, GitHub Flow, Trunk-based)
- When to use which strategy
- Advanced Git commands for real-world scenarios
- How to fix mistakes and recover lost work
- Team collaboration best practices

**Time Required:** 3-4 hours to read and practice

---

# Part 1: Understanding Branching Strategies

## 1.1 Why Branching Strategies Matter

### The Problem Without Strategy

**Chaotic development:**

```
Team without branching strategy:
- Everyone commits to main directly
- Production breaks frequently
- Can't track what's released
- Difficult to rollback
- Merge conflicts nightmare
- No clear process
```

**Real scenario:**

```
Developer A: Pushes half-finished feature to main
Developer B: Pulls main, gets broken code
QA Team: Can't test because main keeps changing
Production: Deploys main, includes untested features
Result: 💥 System down, customers angry
```

### The Solution: Branching Strategy

**Organized development:**

```
With branching strategy:
✅ Clear separation: development vs production
✅ Code review before merging
✅ Testing environments
✅ Easy rollback
✅ Parallel feature development
✅ Controlled releases
```

---

## 1.2 The Three Main Strategies

### Quick Comparison

| Strategy        | Complexity | Team Size | Release Frequency | Best For                        |
| --------------- | ---------- | --------- | ----------------- | ------------------------------- |
| **GitHub Flow** | Low 🟢     | Small     | Continuous        | Web apps, SaaS                  |
| **Git Flow**    | High 🔴    | Large     | Scheduled         | Mobile apps, versioned releases |
| **Trunk-based** | Medium 🟡  | Any       | Very frequent     | Microservices, DevOps           |

---

# Part 2: Git Flow Model

## 2.1 Understanding Git Flow

**Creator:** Vincent Driessen (2010)

**Philosophy:** Structured branching with clear roles for each branch type

### Branch Types in Git Flow

```
┌─────────────────────────────────────────────┐
│  main (production)                          │
│  - Always stable                            │
│  - Only receives merges from release/hotfix │
│  - Tagged with version numbers              │
└─────────────────────────────────────────────┘
            ↑
┌─────────────────────────────────────────────┐
│  develop (integration)                      │
│  - Main development branch                  │
│  - Features merge here                      │
│  - Source for release branches              │
└─────────────────────────────────────────────┘
            ↑
┌─────────────────────────────────────────────┐
│  feature/* (new features)                   │
│  - Branch from: develop                     │
│  - Merge to: develop                        │
│  - Naming: feature/user-authentication      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  release/* (preparing release)              │
│  - Branch from: develop                     │
│  - Merge to: main + develop                 │
│  - Naming: release/1.2.0                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  hotfix/* (emergency fixes)                 │
│  - Branch from: main                        │
│  - Merge to: main + develop                 │
│  - Naming: hotfix/critical-security-patch   │
└─────────────────────────────────────────────┘
```

---

## 2.2 Git Flow Workflow - Step by Step

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourteam/project.git
cd project

# You should see two main branches
git branch -a
# * main
#   develop
#   remotes/origin/main
#   remotes/origin/develop
```

---

### Workflow 1: Developing a New Feature

**Step 1: Create feature branch**

```bash
# Always branch from develop (NOT main!)
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/user-login

# Naming convention:
# feature/short-description
# feature/add-payment-gateway
# feature/refactor-api-client
```

**Step 2: Develop the feature**

```bash
# Make changes
echo "login code here" > login.js
git add login.js
git commit -m "Add login functionality"

# Keep committing as you work
git add .
git commit -m "Add validation for login form"
git commit -m "Add password reset feature"

# Push to remote (backup your work)
git push origin feature/user-login
```

**Step 3: Keep feature branch updated**

```bash
# Other developers are pushing to develop
# You need to stay updated

# Option A: Merge develop into your feature
git checkout feature/user-login
git pull origin develop

# Option B: Rebase (cleaner history - advanced)
git checkout feature/user-login
git rebase develop
# (We'll cover rebase in detail later)
```

**Step 4: Create Pull Request**

```
GitHub:
1. Go to repository
2. Click "Pull requests" → "New pull request"
3. Base: develop ← Compare: feature/user-login
4. Add description, reviewers
5. Wait for code review
```

**Step 5: Merge to develop**

```bash
# After PR approval
# GitHub merge or command line:

git checkout develop
git pull origin develop
git merge --no-ff feature/user-login
# --no-ff: creates merge commit (preserves feature branch history)

git push origin develop

# Delete feature branch (cleanup)
git branch -d feature/user-login
git push origin --delete feature/user-login
```

---

### Workflow 2: Preparing a Release

**When?**

- End of sprint
- Scheduled release date
- Enough features ready

**Step 1: Create release branch**

```bash
# Branch from develop (NOT main!)
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/1.2.0

# Version naming: semantic versioning
# MAJOR.MINOR.PATCH
# 1.2.0 = Major 1, Minor 2, Patch 0
```

**Step 2: Prepare for release**

```bash
# Update version numbers
echo "version: 1.2.0" > version.txt
git add version.txt
git commit -m "Bump version to 1.2.0"

# Fix bugs found in testing (only bug fixes!)
git commit -m "Fix typo in login message"
git commit -m "Fix edge case in payment calculation"

# NO new features in release branch!
```

**Step 3: Merge to main**

```bash
# Merge to main (production)
git checkout main
git pull origin main
git merge --no-ff release/1.2.0

# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"

# Push
git push origin main
git push origin v1.2.0
```

**Step 4: Merge back to develop**

```bash
# Important! Merge back to develop
# So develop has bug fixes from release

git checkout develop
git pull origin develop
git merge --no-ff release/1.2.0
git push origin develop

# Delete release branch
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```

---

### Workflow 3: Hotfix (Emergency Fix)

**When?**

- Critical bug in production
- Security vulnerability
- Data corruption issue

**Step 1: Create hotfix branch**

```bash
# Branch from main (production)
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/fix-payment-bug
```

**Step 2: Fix the bug**

```bash
# Fix the critical issue
git add payment.js
git commit -m "Fix critical payment processing bug"

# Test thoroughly!
```

**Step 3: Merge to main**

```bash
# Deploy fix to production immediately
git checkout main
git merge --no-ff hotfix/fix-payment-bug

# Tag with patch version
git tag -a v1.2.1 -m "Hotfix: payment bug"

git push origin main
git push origin v1.2.1
```

**Step 4: Merge to develop**

```bash
# Critical! Also merge to develop
# Otherwise develop won't have the fix

git checkout develop
git merge --no-ff hotfix/fix-payment-bug
git push origin develop

# Delete hotfix branch
git branch -d hotfix/fix-payment-bug
git push origin --delete hotfix/fix-payment-bug
```

---

## 2.3 Git Flow Advantages and Disadvantages

### Advantages ✅

**1. Clear structure**

```
Everyone knows:
- Where to branch from
- Where to merge to
- What each branch means
```

**2. Parallel development**

```
Team can work on:
- Multiple features simultaneously
- Release preparation while developing next features
- Hotfixes without stopping feature work
```

**3. Version control**

```
- Clear version tags (v1.2.0, v1.2.1)
- Easy to rollback to specific version
- Audit trail of releases
```

**4. Production safety**

```
- main always stable
- Features tested in develop first
- Release branch for final testing
```

### Disadvantages ❌

**1. Complex**

```
- Many branch types to remember
- Merge conflicts more likely
- Overhead for small teams
```

**2. Slow**

```
- Feature → develop → release → main
- Multiple merge steps
- Not suitable for continuous deployment
```

**3. Merge hell**

```
Long-lived branches = more conflicts
feature/old-feature (2 months old)
+ develop (changed a lot)
= Merge conflict nightmare
```

---

## 2.4 When to Use Git Flow

### ✅ Use Git Flow When:

**1. Scheduled releases**

```
Mobile apps:
- Release every 2 weeks
- Need testing period
- App store approval process

Enterprise software:
- Quarterly releases
- Extensive QA
- Client approval needed
```

**2. Version support**

```
Need to maintain multiple versions:
- v1.x (stable, bug fixes only)
- v2.x (current)
- v3.x (development)
```

**3. Large teams**

```
10+ developers:
- Need coordination
- Clear process required
- Multiple features in parallel
```

### ❌ Don't Use Git Flow When:

**1. Continuous deployment**

```
SaaS web apps:
- Deploy multiple times per day
- No "release day"
- Too much overhead
```

**2. Small team**

```
1-3 developers:
- Overkill
- Simpler workflow better
- More time managing branches than coding
```

---

# Part 3: GitHub Flow

## 3.1 Understanding GitHub Flow

**Creator:** GitHub team (2011)

**Philosophy:** Simplicity. Anything in main is deployable.

### GitHub Flow Structure

```
┌─────────────────────────────────────────────┐
│  main (production)                          │
│  - Always deployable                        │
│  - Deploy from here                         │
│  - Protected branch (requires PR)           │
└─────────────────────────────────────────────┘
            ↑
            │ Pull Request
            │
┌─────────────────────────────────────────────┐
│  feature/user-profile                       │
│  - Branch from main                         │
│  - Merge to main (via PR)                   │
│  - Short-lived (days, not weeks)            │
└─────────────────────────────────────────────┘
```

**That's it!** Only two types of branches:

- `main` (production)
- `feature/*` (everything else)

---

## 3.2 GitHub Flow Workflow

### Step 1: Create feature branch from main

```bash
# Always start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/add-user-profile

# Or bug fix
git checkout -b fix/login-error

# Or experiment
git checkout -b experiment/new-ui-design
```

### Step 2: Make commits

```bash
# Develop the feature
git add profile.js
git commit -m "Add user profile component"

# Keep committing
git add profile.css
git commit -m "Style user profile page"

# Push often (backup + show progress)
git push origin feature/add-user-profile
```

### Step 3: Open Pull Request early

```
GitHub:
1. Even if not finished, open PR
2. Mark as "Draft" or "WIP" (Work In Progress)
3. Get early feedback
4. Show team what you're working on

Benefits:
- Early code review
- Discuss approach before going too far
- Avoid duplicate work
```

### Step 4: Discuss and review

```bash
# Team gives feedback
# Make changes based on feedback

git add profile.js
git commit -m "Address review comments: add validation"
git push origin feature/add-user-profile

# GitHub automatically updates PR
```

### Step 5: Deploy and test

```
Before merging to main:
1. Deploy feature branch to staging
2. Test thoroughly
3. Run automated tests
4. Get QA approval

Some teams deploy every PR to preview environment
```

### Step 6: Merge to main

```bash
# After approval
# Merge via GitHub UI (Squash and merge recommended)

# Or command line:
git checkout main
git pull origin main
git merge --no-ff feature/add-user-profile
git push origin main

# Delete feature branch
git branch -d feature/add-user-profile
git push origin --delete feature/add-user-profile
```

### Step 7: Deploy to production

```
After merge to main:
1. Automated CI/CD deploys
2. Monitor production
3. If issues → rollback or hotfix
```

---

## 3.3 GitHub Flow Principles

### Principle 1: main is always deployable

```
Every commit in main should be:
✅ Tested
✅ Reviewed
✅ Ready for production

How to ensure:
- Branch protection (require PR)
- Automated tests (CI)
- Code review (2+ approvals)
- Deploy automatically on merge
```

### Principle 2: Descriptive branch names

```
Good:
✅ feature/user-authentication
✅ fix/payment-processing-bug
✅ refactor/database-queries
✅ docs/api-documentation

Bad:
❌ fix-bug
❌ new-feature
❌ john-branch
❌ test
```

### Principle 3: Commit often, push often

```
Local commits: Every logical change
git commit -m "Add login form"
git commit -m "Add validation"
git commit -m "Style login form"

Push to remote: At least daily
git push origin feature/user-login

Why:
- Backup your work
- Show progress to team
- Enable collaboration
```

### Principle 4: Open PR when ready for feedback

```
Don't wait until "perfect"

Open PR:
- When you want feedback
- When approach is unclear
- When stuck on a problem

Mark as draft if not ready for merge
```

### Principle 5: Deploy immediately after merge

```
main merged → CI/CD → Production
(usually automated)

Quick feedback loop:
- See changes in production fast
- Catch issues early
- Small changes = easier to debug
```

---

## 3.4 GitHub Flow Advantages and Disadvantages

### Advantages ✅

**1. Simple**

```
Only one rule: main is deployable
Easy to learn and follow
```

**2. Fast**

```
feature → main (one step)
No intermediate branches
Deploy multiple times per day
```

**3. Continuous deployment friendly**

```
Perfect for:
- Web applications
- SaaS products
- Microservices
```

**4. Focus on code review**

```
Everything goes through PR
Team sees all changes
Knowledge sharing
```

### Disadvantages ❌

**1. No release preparation phase**

```
Can't "polish" before release
Everything goes to production immediately
Need very good testing
```

**2. Versioning unclear**

```
No release branches
Hard to maintain old versions
Tags help but not as structured
```

**3. Requires discipline**

```
Team must ensure main is always deployable
One bad merge = production down
```

---

## 3.5 When to Use GitHub Flow

### ✅ Use GitHub Flow When:

**1. Continuous deployment**

```
Web apps deployed multiple times daily:
- SaaS products
- Internal tools
- APIs
```

**2. Small to medium teams**

```
1-10 developers:
- Simple is better
- Fast iteration
- Clear process
```

**3. Single production version**

```
No need to support old versions:
- Everyone uses latest
- No mobile app store delays
```

### Example: Typical GitHub Flow Team

```
SaaS Startup (5 developers):

Monday:
- Developer A: feature/payment-integration → PR → Review → Merge → Deploy
- Developer B: fix/signup-bug → PR → Merge → Deploy

Tuesday:
- Developer A: feature/email-notifications → PR → Review
- Developer C: refactor/api-client → PR → Review → Merge → Deploy

Wednesday:
- Developer A: Merge email-notifications → Deploy
- Developer B: feature/admin-dashboard → PR

Total: 5-10 deploys per week
All on main branch
Simple and fast
```

---

# Part 4: Trunk-Based Development

## 4.1 Understanding Trunk-Based Development

**Philosophy:** Everyone commits to main (trunk) frequently. Short-lived branches (hours/days, not weeks).

### Trunk-Based Structure

```
┌─────────────────────────────────────────────┐
│  main (trunk)                               │
│  - Everyone commits here                    │
│  - Multiple commits per day per developer   │
│  - Always in deployable state               │
└─────────────────────────────────────────────┘
      ↑ ↑ ↑ ↑ ↑
      │ │ │ │ │ (Very short-lived branches)
      │ │ │ │ └─ feature (2 hours)
      │ │ │ └─── fix (1 hour)
      │ │ └───── feature (4 hours)
      │ └─────── fix (30 min)
      └───────── feature (1 day max)
```

---

## 4.2 Two Variants of Trunk-Based Development

### Variant 1: Direct Commits to Main (Rare)

**Only for very small, experienced teams**

```bash
# Everyone commits directly to main
git checkout main
git pull origin main

# Make small change
git add feature.js
git commit -m "Add login validation"
git push origin main

# Deployed automatically
```

**Requirements:**

```
✅ Very strong CI/CD
✅ Comprehensive automated tests
✅ Feature flags
✅ Experienced team (trust)
✅ Pair programming
```

### Variant 2: Short-Lived Branches (Common)

**Most teams use this**

```bash
# Create branch for small change
git checkout -b quick-fix-typo

# Fix
git add readme.md
git commit -m "Fix typo in readme"
git push origin quick-fix-typo

# Create PR (fast review, <1 hour)
# Merge to main
# Delete branch immediately

# Branch lifetime: hours, not days
```

---

## 4.3 Key Practices in Trunk-Based Development

### Practice 1: Feature Flags

**Problem:** Feature not ready but need to merge to main

**Solution:** Feature flags (feature toggles)

```javascript
// In code
if (featureFlags.isEnabled('newCheckoutFlow')) {
  return <NewCheckoutFlow />;
} else {
  return <OldCheckoutFlow />;
}

// In config
featureFlags = {
  newCheckoutFlow: false, // Off in production, on in development
};

// When ready
featureFlags = {
  newCheckoutFlow: true, // Turn on for everyone
};
```

**Benefits:**

```
✅ Merge incomplete features
✅ Test in production safely
✅ Gradual rollout (5% → 25% → 100%)
✅ Instant rollback (toggle off)
```

### Practice 2: Small Commits

```
Traditional:
- Work 1 week
- 50 files changed
- Huge PR

Trunk-based:
- Commit multiple times per day
- 1-5 files changed
- Tiny PR (5 minutes to review)
```

**How to make small commits:**

```bash
# Instead of:
# ❌ One big commit: "Add user system"
# (100 files, 2000 lines changed)

# Do:
# ✅ Small commits:
git commit -m "Add User model"  # 1 file
git commit -m "Add user database migration"  # 1 file
git commit -m "Add user API endpoint"  # 1 file
git commit -m "Add user validation"  # 1 file
git commit -m "Add user tests"  # 1 file
```

### Practice 3: Continuous Integration

**Every commit triggers:**

```yaml
1. Automated tests
   - Unit tests
   - Integration tests
   - E2E tests

2. Code quality checks
   - Linting
   - Code coverage
   - Security scan

3. Build
   - Compile
   - Package

4. Deploy to staging
   - Automatic deployment
   - Smoke tests

Result: Know immediately if something broke
```

### Practice 4: No Code Freeze

```
Traditional:
Week 1-3: Development
Week 4: Code freeze (no new commits)
Week 5: Release

Trunk-based:
Every day: Development + Deploy
No freeze period
```

---

## 4.4 Trunk-Based Advantages and Disadvantages

### Advantages ✅

**1. Maximum collaboration**

```
Everyone working on same branch
See each other's changes immediately
No merge conflicts hell
```

**2. Fastest feedback**

```
Commit → Test → Deploy (minutes)
Issues caught early
Small changes = easy to fix
```

**3. Forces good practices**

```
Must have good tests (safety net)
Must have feature flags
Must have CI/CD
Results in higher quality overall
```

**4. DevOps/CD friendly**

```
Perfect for microservices
Deploy 10+ times per day
True continuous delivery
```

### Disadvantages ❌

**1. High requirements**

```
❌ Need strong CI/CD
❌ Need comprehensive tests
❌ Need experienced team
❌ Need feature flags system
```

**2. Risky without safeguards**

```
Bad commit can break production
Need quick rollback
Need monitoring
```

**3. Cultural change**

```
Team needs to change habits
Trust required
Continuous learning
```

---

## 4.5 When to Use Trunk-Based Development

### ✅ Use Trunk-Based When:

**1. Mature DevOps team**

```
✅ Strong CI/CD pipeline
✅ Automated testing (>80% coverage)
✅ Monitoring and alerts
✅ Feature flags system
```

**2. Microservices architecture**

```
Many small services:
- Deploy independently
- Fast iteration
- Small changes
```

**3. Experienced developers**

```
Team that:
- Writes good tests
- Commits often
- Communicates well
```

### Example: Google's Development

```
Google uses trunk-based development:
- 25,000+ developers
- All commit to main
- 40,000+ commits per day
- Deploy multiple times per day

How?
- Automated tests (100,000+ tests)
- Code review (Gerrit)
- Feature flags everywhere
- Incremental rollout
```

---

# Part 5: Comparison and Choosing Strategy

## 5.1 Side-by-Side Comparison

| Feature              | Git Flow         | GitHub Flow     | Trunk-Based             |
| -------------------- | ---------------- | --------------- | ----------------------- |
| **Branches**         | 5 types          | 2 types         | 1 main + short features |
| **Complexity**       | High 🔴          | Low 🟢          | Medium 🟡               |
| **Learning Curve**   | Steep            | Easy            | Medium                  |
| **Deploy Frequency** | Weekly/Monthly   | Daily           | Multiple/day            |
| **Release Planning** | Structured       | Ad-hoc          | Continuous              |
| **Team Size**        | 10+              | 2-10            | Any                     |
| **Code Review**      | Before merge     | Pull Request    | Pull Request            |
| **Rollback**         | Previous version | Previous commit | Feature flag            |
| **Best For**         | Mobile apps      | Web apps        | Microservices           |

---

## 5.2 Decision Tree

```
Start: Choose branching strategy
    ↓
Q1: How often do you deploy?
    ├─ Multiple times per day → Trunk-Based
    ├─ Daily → GitHub Flow
    └─ Weekly/Monthly → Git Flow

Q2: What type of application?
    ├─ Mobile app → Git Flow
    ├─ Web app → GitHub Flow
    └─ Microservices → Trunk-Based

Q3: Team experience?
    ├─ Beginners → GitHub Flow
    ├─ Intermediate → GitHub Flow or Git Flow
    └─ Advanced → Trunk-Based

Q4: Need version support?
    ├─ Yes (v1, v2 parallel) → Git Flow
    └─ No (only latest) → GitHub Flow or Trunk-Based
```

---

## 5.3 Real-World Examples

### Scenario 1: Mobile App Development

```
Company: Mobile game company
Team: 15 developers
Release: Every 2 weeks (App Store approval)

Best Strategy: Git Flow

Why:
✅ Scheduled releases
✅ Need release preparation
✅ Version support (v1.2, v1.3)
✅ Testing period before release
✅ Large team needs structure
```

### Scenario 2: SaaS Startup

```
Company: Project management SaaS
Team: 5 developers
Release: Multiple times per day

Best Strategy: GitHub Flow

Why:
✅ Continuous deployment
✅ Small team
✅ Fast iteration
✅ Simple process
✅ One production version
```

### Scenario 3: Large Tech Company

```
Company: Google, Facebook scale
Team: 1000+ developers
Release: Continuous

Best Strategy: Trunk-Based

Why:
✅ Mature CI/CD
✅ Microservices
✅ Very frequent deploys
✅ Strong testing culture
✅ Feature flags everywhere
```

---

# Part 6: Advanced Git Commands

## 6.1 Interactive Rebase

### What is Rebase?

**Simple explanation:**

```
Rebase = "Change the base of your branch"

Before rebase:
main:     A---B---C
              \
feature:       D---E

After rebase:
main:     A---B---C
                  \
feature:           D'---E'
```

**Why rebase?**

- Clean linear history
- Easier to understand commits
- No "merge commit" clutter

---

### Interactive Rebase - Clean Up Commits

**Scenario:** You made messy commits while developing

```bash
# Your commit history
git log --oneline

abc123 Fix typo
def456 Add feature
ghi789 WIP
jkl012 Fix bug
mno345 Add tests
```

**You want:**

- Combine related commits
- Reword commit messages
- Reorder commits

**Solution: Interactive rebase**

```bash
# Rebase last 5 commits
git rebase -i HEAD~5

# Opens editor:
pick abc123 Fix typo
pick def456 Add feature
pick ghi789 WIP
pick jkl012 Fix bug
pick mno345 Add tests

# Rebase commands:
# p, pick = use commit
# r, reword = use commit, but edit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous
# f, fixup = like squash, but discard message
# d, drop = remove commit
```

**Example: Clean up**

```bash
# Change to:
pick def456 Add feature
squash ghi789 WIP
squash abc123 Fix typo
pick mno345 Add tests
pick jkl012 Fix bug

# Save and exit

# Result: 3 commits instead of 5
# "Add feature" (includes WIP and typo fix)
# "Add tests"
# "Fix bug"
```

---

### Rebase vs Merge

**Merge creates merge commit:**

```bash
# Merge develop into feature
git checkout feature
git merge develop

# History:
*   Merge branch 'develop' into feature
|\
| * Commit from develop
* | Commit from feature
|/
* Previous commit
```

**Rebase replays commits:**

```bash
# Rebase feature onto develop
git checkout feature
git rebase develop

# History:
* Commit from feature (replayed)
* Commit from develop
* Previous commit

# Clean, linear history!
```

**When to use which?**

```
Use MERGE when:
✅ Merging feature to main (preserve history)
✅ Public branches
✅ Collaborative branches

Use REBASE when:
✅ Update your feature branch
✅ Clean up local commits
✅ Before creating PR (clean history)

⚠️ NEVER rebase public/shared branches!
```

---

### Rebase Example - Update Feature Branch

```bash
# Scenario: You're working on feature
# Other team members pushed to develop
# You want latest develop changes

# Option 1: Merge (creates merge commit)
git checkout feature
git merge develop

# Option 2: Rebase (cleaner)
git checkout feature
git rebase develop

# If conflicts:
# 1. Fix conflicts in files
# 2. git add <fixed-files>
# 3. git rebase --continue

# Abort if things go wrong:
git rebase --abort
```

---

## 6.2 Cherry-Pick

### What is Cherry-Pick?

**Pick specific commits from one branch to another**

```
main:     A---B---C
               \
feature:        D---E---F---G

Want: Only commit F in main

Cherry-pick F:
main:     A---B---C---F'
```

---

### Cherry-Pick Usage

**Scenario 1: Bug fix in feature branch**

```bash
# You fixed a bug in feature branch
# Need same fix in main immediately

# Step 1: Find commit hash
git log feature
# commit abc123def456 (feature)
# "Fix critical security bug"

# Step 2: Cherry-pick to main
git checkout main
git cherry-pick abc123def456

# Now main has the bug fix
# Without merging entire feature
```

**Scenario 2: Selective commits**

```bash
# Feature branch has 10 commits
# Only want commits 3, 5, 7

# Cherry-pick multiple commits
git checkout main
git cherry-pick abc123 def456 ghi789

# Or range (inclusive)
git cherry-pick abc123..ghi789
```

---

### Cherry-Pick Best Practices

```
✅ Good uses:
- Hotfixes
- Backporting fixes to old versions
- Selective feature inclusion

❌ Avoid:
- Cherry-picking many commits (use merge)
- Cherry-picking commits that depend on others
- As regular workflow (indicates bad branching)
```

**Example: Hotfix scenario**

```bash
# Bug found in production (main)
# Already fixed in develop

# Find the fix
git log develop
# commit xyz789 "Fix payment bug"

# Apply to main
git checkout main
git cherry-pick xyz789

# Tag and deploy
git tag -a v1.2.1 -m "Hotfix payment"
git push origin main --tags
```

---

## 6.3 Git Stash

### What is Stash?

**Temporary storage for uncommitted changes**

```
Scenario:
- Working on feature
- Not ready to commit
- Need to switch branches urgently

Solution: Stash
```

---

### Basic Stash Usage

```bash
# You're working on feature
# Modified 3 files

git status
# modified: file1.js
# modified: file2.js
# modified: file3.js

# Need to switch to main urgently
# But don't want to lose work

# Stash changes
git stash save "WIP: user profile feature"

# Working directory is now clean
git status
# nothing to commit, working tree clean

# Switch to main
git checkout main
# Fix urgent bug
git add hotfix.js
git commit -m "Fix critical bug"

# Go back to feature
git checkout feature

# Restore stashed changes
git stash pop
# Changes are back!
```

---

### Stash Commands

```bash
# Save with message
git stash save "Work in progress on login"

# Save including untracked files
git stash save -u "Include new files"

# List all stashes
git stash list
# stash@{0}: WIP: user profile
# stash@{1}: WIP: login feature
# stash@{2}: Bug fix attempt

# Show stash content
git stash show stash@{0}

# Apply specific stash (keep in list)
git stash apply stash@{1}

# Apply and remove from list
git stash pop

# Remove specific stash
git stash drop stash@{0}

# Remove all stashes
git stash clear
```

---

### Stash Advanced Usage

**Create branch from stash:**

```bash
# Stash has lots of changes
# Want to work on it in new branch

git stash save "Experimental feature"
git stash branch feature/experiment stash@{0}

# Creates new branch with stash applied
```

**Stash specific files:**

```bash
# Only stash file1.js
git stash push -m "Just file1" file1.js

# Stash everything except file2.js
git stash push -m "All but file2" -- . ':!file2.js'
```

---

### Stash Best Practices

```
✅ Use stash for:
- Temporary storage
- Switching context quickly
- Experimenting without committing

❌ Don't use stash as:
- Long-term storage (commit instead)
- Backup (push to remote instead)
- Sharing with team (use branches)

💡 Pro tip:
Always add descriptive message
git stash save "WIP: payment integration API"
(Not just "git stash" with default message)
```

---

## 6.4 Git Reflog

### What is Reflog?

**Git's safety net - records all reference changes**

```
Reflog tracks:
✅ Every commit
✅ Every branch switch
✅ Every reset
✅ Every rebase
✅ Even deleted commits!

Duration: 90 days (default)
```

---

### Viewing Reflog

```bash
# View reflog
git reflog

# Output:
abc123 (HEAD -> main) HEAD@{0}: commit: Add feature
def456 HEAD@{1}: checkout: moving from feature to main
ghi789 HEAD@{2}: commit: WIP
jkl012 HEAD@{3}: rebase: Fix bug
```

---

### Recovering Lost Commits

**Scenario 1: Accidental reset**

```bash
# You did:
git reset --hard HEAD~3
# Oops! Lost 3 commits

# Panic! But reflog saves you

# Check reflog
git reflog
# abc123 HEAD@{0}: reset: moving to HEAD~3
# def456 HEAD@{1}: commit: Important work
# ghi789 HEAD@{2}: commit: More work
# jkl012 HEAD@{3}: commit: Critical fix

# Recover commits
git reset --hard def456
# Or
git reset --hard HEAD@{1}

# All commits are back! 🎉
```

**Scenario 2: Deleted branch**

```bash
# Deleted branch by accident
git branch -D feature/important
# Oh no! Had uncommitted work

# Check reflog
git reflog
# abc123 HEAD@{1}: commit: Last commit on feature

# Recreate branch
git checkout -b feature/important abc123
# Branch restored!
```

**Scenario 3: Bad rebase**

```bash
# Rebase went wrong
git rebase main
# Conflicts everywhere, gave up

git rebase --abort
# But still feels wrong

# Check reflog
git reflog
# abc123 HEAD@{1}: rebase: before rebase

# Go back to before rebase
git reset --hard HEAD@{1}
# Like rebase never happened
```

---

### Reflog Best Practices

```
✅ Check reflog when:
- Accidentally deleted commits
- Reset went wrong
- Rebase made a mess
- Branch deleted by mistake

💡 Reflog is local only:
- Each repository has own reflog
- Not pushed to remote
- Not shared with team

⚠️ Reflog expires:
- Default: 90 days
- After that, commits truly gone
- Use git gc to clean up earlier
```

---

## 6.5 Git Reset vs Git Revert

### Understanding the Difference

**Reset = Rewind time (destructive)**
**Revert = Create opposite commit (safe)**

```
Original:
A---B---C---D (main)

Reset to B:
A---B (main)
# C and D gone!

Revert D:
A---B---C---D---D' (main)
# D' = opposite of D
# History preserved
```

---

### Git Reset

**Three modes of reset:**

```bash
# 1. --soft (keep changes in staging)
git reset --soft HEAD~1
# Uncommits last commit
# Changes still staged
# Ready to commit again

# 2. --mixed (default - keep changes unstaged)
git reset HEAD~1
# or
git reset --mixed HEAD~1
# Uncommits last commit
# Changes unstaged
# Need to git add again

# 3. --hard (discard changes)
git reset --hard HEAD~1
# Uncommits last commit
# Deletes all changes
# ⚠️ DANGEROUS!
```

---

### Reset Examples

**Scenario 1: Undo last commit (keep changes)**

```bash
# Just committed
git commit -m "Add feature"

# Oops, forgot to include file
git reset --soft HEAD~1

# Add forgotten file
git add forgotten.js

# Commit again
git commit -m "Add feature (complete)"
```

**Scenario 2: Unstage files**

```bash
# Staged files
git add file1.js file2.js file3.js

# Oops, don't want file3
git reset file3.js
# or
git reset HEAD file3.js

# file3 unstaged, file1 and file2 still staged
```

**Scenario 3: Discard all local changes**

```bash
# Modified lots of files
# Want to start fresh

git reset --hard HEAD
# All changes discarded
# Back to last commit

# ⚠️ WARNING: Can't undo this
# (Unless you use reflog)
```

---

### Git Revert

**Create opposite commit:**

```bash
# Want to undo commit abc123
git revert abc123

# Opens editor for commit message
# Default: "Revert 'original message'"

# Creates new commit that undoes changes
```

---

### Revert Examples

**Scenario 1: Undo pushed commit**

```bash
# Pushed bad commit to main
git log
# abc123 "Add broken feature" (HEAD)
# def456 "Previous commit"

# Can't reset (others pulled already)
# Use revert instead
git revert abc123

# Creates new commit:
# ghi789 "Revert 'Add broken feature'"

# Push
git push origin main

# Everyone gets the fix
```

**Scenario 2: Revert multiple commits**

```bash
# Want to undo last 3 commits
git revert HEAD~3..HEAD

# Creates 3 revert commits
# One for each original commit
```

**Scenario 3: Revert without committing**

```bash
# Want to review before committing
git revert --no-commit abc123

# Changes applied but not committed
git status
# modified: file1.js (reverted)

# Review, then commit
git commit -m "Revert feature XYZ"
```

---

### Reset vs Revert - When to Use

```
Use RESET when:
✅ Local commits only (not pushed)
✅ Cleaning up commit history
✅ Uncommitting to make changes
✅ Personal branches

Use REVERT when:
✅ Commits already pushed
✅ Shared/public branches
✅ Need to keep history
✅ Production fixes

🚨 NEVER reset public branches!
```

**Example Decision Tree:**

```
Need to undo commit?
    ↓
Is it pushed to remote?
    ├─ Yes → Use REVERT
    └─ No → Can use RESET
        ↓
        Want to keep changes?
            ├─ Yes → git reset --soft
            └─ No → git reset --hard
```

---

## 6.6 Amend Commit

### What is Amend?

**Fix the last commit without creating new commit**

```
Use cases:
- Forgot to include file
- Typo in commit message
- Want to add more changes to last commit
```

---

### Amend Examples

**Scenario 1: Fix commit message**

```bash
# Just committed with typo
git commit -m "Add paymont feature"
# Oops! "paymont" → "payment"

# Fix message
git commit --amend -m "Add payment feature"

# Commit message updated!
```

**Scenario 2: Add forgotten file**

```bash
# Committed feature
git commit -m "Add login feature"

# Oops! Forgot to add login.css
git add login.css

# Amend last commit
git commit --amend --no-edit
# --no-edit: keep same message

# login.css now included in last commit
```

**Scenario 3: Amend and change message**

```bash
# Last commit needs more files + new message
git add newfile.js
git commit --amend -m "Complete login feature with styling"

# Opens editor if you omit -m
git commit --amend
```

---

### Amend Best Practices

```
✅ Use amend for:
- Fixing last commit
- Before pushing
- Personal branches

❌ Don't amend if:
- Commit already pushed
- Others have pulled
- Shared branches

⚠️ Amending changes commit hash:
Old: abc123
After amend: def456
(Technically new commit)
```

**If accidentally amended pushed commit:**

```bash
# You amended and pushed with --force
git push --force origin feature

# Team members need to:
git fetch origin
git reset --hard origin/feature

# Or:
git pull --rebase
```

---

# Part 7: Practical Examples and Workflows

## 7.1 Complete Feature Development (GitHub Flow)

**Scenario:** Add user profile page to web app

```bash
# Day 1: Start feature
git checkout main
git pull origin main
git checkout -b feature/user-profile

# Develop
# ... edit files ...
git add profile.js profile.css
git commit -m "Add user profile component"
git push origin feature/user-profile

# Open draft PR on GitHub
# Title: "WIP: User profile page"

# Day 2: Continue development
git add profile-api.js
git commit -m "Add API integration for profile"
git push origin feature/user-profile

# Day 3: Address review comments
git add profile.js
git commit -m "Fix validation logic per review"

# Clean up commits before final merge
git rebase -i HEAD~5
# Squash related commits
git push --force-with-lease origin feature/user-profile

# Day 4: Merge
# PR approved → Squash and merge on GitHub
# Delete branch

# Feature complete! ✅
```

---

## 7.2 Emergency Hotfix (Git Flow)

**Scenario:** Critical payment bug in production

```bash
# Production is broken!
# Start hotfix
git checkout main
git pull origin main
git checkout -b hotfix/payment-calculation

# Fix the bug (30 minutes)
git add payment.js
git commit -m "Fix rounding error in payment calculation"

# Test thoroughly!
npm test

# Merge to main
git checkout main
git merge --no-ff hotfix/payment-calculation
git tag -a v1.2.1 -m "Hotfix: payment calculation"
git push origin main v1.2.1

# Deploy to production immediately
# Monitor

# Merge to develop
git checkout develop
git merge --no-ff hotfix/payment-calculation
git push origin develop

# Cleanup
git branch -d hotfix/payment-calculation
git push origin --delete hotfix/payment-calculation

# Crisis averted! ✅
```

---

## 7.3 Recovering from Mistakes

**Scenario:** Accidentally committed secrets

```bash
# Oh no! Committed API keys
git log
# abc123 "Add payment integration"  ← Contains secrets!

# Option 1: Amend (if not pushed)
git reset --soft HEAD~1
# Remove secrets from files
git add payment.js
git commit -m "Add payment integration"

# Option 2: Revert (if already pushed)
git revert abc123
# Manually remove secrets
git add payment.js
git commit -m "Remove exposed secrets"
git push origin main

# Rotate exposed secrets immediately!

# Option 3: Rewrite history (last resort)
git filter-branch --tree-filter 'rm -f config/secrets.yml' HEAD
git push --force origin main
# ⚠️ Breaks everyone's checkout!
```

---

## 7.4 Syncing Fork with Upstream

**Scenario:** Contributing to open source

```bash
# Forked repository
git clone https://github.com/yourname/project.git
cd project

# Add upstream (original repo)
git remote add upstream https://github.com/original/project.git

# Get latest from upstream
git fetch upstream

# Update your main
git checkout main
git merge upstream/main
git push origin main

# Create feature branch
git checkout -b feature/new-contribution

# Develop and push
git add feature.js
git commit -m "Add new feature"
git push origin feature/new-contribution

# Create PR on GitHub
# From: yourname/project/feature/new-contribution
# To: original/project/main
```

---

# Part 8: Best Practices and Tips

## 8.1 Commit Messages

### Good Commit Messages

```
Structure:
<type>: <subject>

<body>

<footer>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Add tests
- chore: Maintenance
```

**Examples:**

```bash
# Good ✅
git commit -m "feat: add user authentication with JWT"

git commit -m "fix: resolve memory leak in image processor

The image processor was not releasing memory after processing.
Added explicit cleanup in the finally block.

Fixes #123"

# Bad ❌
git commit -m "fix stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
git commit -m "Updated files"
```

---

## 8.2 Branch Naming

```
Pattern: <type>/<short-description>

Types:
- feature/  (new feature)
- fix/      (bug fix)
- hotfix/   (emergency fix)
- refactor/ (code restructure)
- test/     (add tests)
- docs/     (documentation)
- chore/    (maintenance)

Examples:
✅ feature/user-authentication
✅ fix/payment-calculation-error
✅ hotfix/security-vulnerability
✅ refactor/database-queries
✅ docs/api-documentation

❌ my-branch
❌ test
❌ new-stuff
❌ john-dev
```

---

## 8.3 Safety Rules

```
🚨 NEVER:
❌ git push --force origin main
   (Breaks everyone's work)

❌ git reset --hard (on shared branches)
   (Loses commits)

❌ Commit secrets/passwords
   (Security risk)

❌ Rebase public branches
   (Creates conflicts)

✅ ALWAYS:
✅ Pull before push
✅ Create backups (git push)
✅ Test before committing
✅ Review before merging
✅ Use .gitignore
```

---

## 8.4 Git Aliases (Time Savers)

```bash
# Add to ~/.gitconfig

[alias]
    # Status
    s = status
    st = status -sb

    # Commit
    c = commit
    cm = commit -m
    ca = commit --amend

    # Checkout
    co = checkout
    cob = checkout -b

    # Branch
    br = branch
    brd = branch -d

    # Log
    lg = log --oneline --graph --decorate --all
    last = log -1 HEAD

    # Diff
    d = diff
    ds = diff --staged

    # Pull/Push
    pl = pull
    ps = push

    # Stash
    st = stash
    stp = stash pop
    stl = stash list

# Usage:
git s         # instead of git status
git cm "msg"  # instead of git commit -m "msg"
git lg        # beautiful log graph
```

---

# Part 9: Troubleshooting

## 9.1 Common Errors and Solutions

### Error: "fatal: refusing to merge unrelated histories"

```bash
# Situation: Trying to pull from new remote

# Solution:
git pull origin main --allow-unrelated-histories
```

### Error: Merge conflict

```bash
# During merge/rebase
git status
# both modified: file.js

# Open file.js
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Resolve conflict (keep one or combine)
# Remove conflict markers

git add file.js
git commit  # (if merging)
# or
git rebase --continue  # (if rebasing)
```

### Error: Detached HEAD

```bash
# You did: git checkout abc123 (commit hash)
# Now in detached HEAD state

# To save work:
git checkout -b new-branch-name

# To discard and go back:
git checkout main
```

---

## 9.2 Undoing Mistakes

### Undo last commit (keep changes)

```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes)

```bash
git reset --hard HEAD~1
```

### Undo git add

```bash
git reset file.js
# or all files
git reset
```

### Recover deleted branch

```bash
git reflog
git checkout -b branch-name abc123
```

---

# Part 10: Cheat Sheet

## Quick Reference

```bash
# === Setup ===
git init
git clone <url>
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# === Basic ===
git status
git add <file>
git add .
git commit -m "message"
git commit --amend
git push origin <branch>
git pull origin <branch>

# === Branching ===
git branch                    # list branches
git branch <name>             # create branch
git checkout <branch>         # switch branch
git checkout -b <branch>      # create and switch
git branch -d <branch>        # delete branch
git merge <branch>            # merge branch

# === Stash ===
git stash save "message"
git stash list
git stash pop
git stash apply stash@{0}
git stash drop stash@{0}
git stash clear

# === Rebase ===
git rebase <branch>
git rebase -i HEAD~3
git rebase --continue
git rebase --abort

# === Reset/Revert ===
git reset --soft HEAD~1       # undo commit, keep changes staged
git reset HEAD~1              # undo commit, unstage changes
git reset --hard HEAD~1       # undo commit, discard changes
git revert <commit>           # create opposite commit

# === Cherry-pick ===
git cherry-pick <commit>

# === Reflog ===
git reflog
git reset --hard HEAD@{1}

# === Remote ===
git remote -v
git remote add <name> <url>
git fetch <remote>
git push --force-with-lease   # safer than --force

# === Log ===
git log
git log --oneline
git log --graph --oneline --all
git log -p                    # show diff

# === Diff ===
git diff
git diff --staged
git diff <branch1>..<branch2>

# === Tags ===
git tag
git tag -a v1.0.0 -m "message"
git push origin v1.0.0
git push origin --tags
```

---

# Conclusion

## What You've Learned

```
✅ Branching Strategies:
   - Git Flow (structured, large teams)
   - GitHub Flow (simple, web apps)
   - Trunk-based (advanced, continuous delivery)

✅ When to use which strategy

✅ Advanced Git commands:
   - Interactive rebase
   - Cherry-pick
   - Stash
   - Reflog
   - Reset vs Revert
   - Amend

✅ Real-world workflows

✅ Best practices

✅ Troubleshooting
```

---

## Next Steps

### Practice Exercises

**Exercise 1: Git Flow Practice**

```
1. Create repository
2. Setup main and develop branches
3. Create feature branch
4. Merge to develop
5. Create release branch
6. Merge to main
7. Create hotfix
```

**Exercise 2: Interactive Rebase**

```
1. Make 5 messy commits
2. Use interactive rebase to clean up
3. Squash related commits
4. Reword commit messages
```

**Exercise 3: Recover Lost Work**

```
1. Commit something
2. Reset --hard
3. Use reflog to recover
```

---

## Resources

**Official Documentation:**

- Git Book: https://git-scm.com/book/en/v2
- GitHub Docs: https://docs.github.com
- Atlassian Git Tutorial: https://www.atlassian.com/git

**Interactive Learning:**

- Learn Git Branching: https://learngitbranching.js.org/
- Git Immersion: https://gitimmersion.com/

**Tools:**

- GitKraken (GUI)
- SourceTree (GUI)
- Git Graph (VS Code extension)

---

## Final Tips

```
💡 Remember:
1. Commit early, commit often
2. Write clear commit messages
3. Test before committing
4. Review your own PR first
5. Keep branches short-lived
6. Use .gitignore
7. Never commit secrets
8. Backup (push) your work

🎯 Master these gradually:
- Week 1-2: Basic branching (GitHub Flow)
- Week 3-4: Advanced commands (rebase, stash)
- Month 2: Git Flow for complex projects
- Month 3+: Trunk-based development

🚀 Keep practicing!
The best way to learn Git is to use it daily.
```

---

**Good luck with your Git journey!** 🌟
