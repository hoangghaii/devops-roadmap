# Lộ Trình Học DevOps 12 Tháng - Dành Cho Người Dùng macOS

> 🎯 **Mục tiêu:** Từ Node.js Developer → DevOps Engineer trong 12 tháng
> 🖥️ **Platform:** macOS (macBook/macMini)
> 📚 **Format:** Chi tiết với checkboxes để track tiến độ

---

## 📋 Tổng Quan Lộ Trình

### Giai Đoạn 1: Nền Tảng (Tháng 1-2)

**File:** `devops-month-01-02-linux-docker-git.md`

✅ **Đã hoàn thành**

- Linux/Unix fundamentals trên macOS
- Docker & Docker Compose
- Git advanced workflows
- Terminal productivity
- Shell scripting
- Local development environment

**Kết quả mong đợi:**

- Thành thạo Terminal/iTerm2
- Docker containers và images
- Git branching strategies
- Deploy app locally với Docker

---

### Giai Đoạn 2: CI/CD Cơ Bản (Tháng 3)

**File:** `devops-month-03-cicd-github-actions.md`

✅ **Đã hoàn thành**

- CI/CD concepts
- GitHub Actions workflows
- Automated testing
- Docker builds trong CI
- Automated deployment to servers
- Security scanning

**Kết quả mong đợi:**

- Viết GitHub Actions workflows
- Automated build & test
- Deploy tự động khi push code
- Quality gates và branch protection

---

### Giai Đoạn 3: Kubernetes Basics (Tháng 4-5)

**File:** `devops-month-04-05-kubernetes-basics.md`

✅ **Đã hoàn thành**

- Kubernetes fundamentals
- kubectl commands
- Deployments, Services, Ingress
- ConfigMaps & Secrets
- Persistent storage
- Helm package manager
- StatefulSets, Jobs, CronJobs

**Kết quả mong đợi:**

- Deploy apps lên Kubernetes
- Manage configurations
- Setup networking
- Use Helm charts
- Debug K8s issues

---

### Giai Đoạn 4: Advanced CI/CD & GitOps (Tháng 6-7)

**File:** `devops-month-06-07-cicd-gitops-monitoring.md`

✅ **Đã hoàn thành**

- CI/CD to Kubernetes
- GitOps với ArgoCD
- Monitoring với Prometheus & Grafana
- Logging với ELK/EFK Stack
- Alerting rules
- Observability best practices

**Kết quả mong đợi:**

- Deploy to K8s via pipelines
- GitOps workflows
- Setup monitoring stack
- Centralized logging
- Production-ready observability

---

### Giai Đoạn 5: AWS Cloud (Tháng 8-9)

**File:** `devops-month-08-09-aws-cloud-detailed.md`

✅ **Đã hoàn thành**

- AWS fundamentals & IAM
- EC2, Auto Scaling, Load Balancers
- VPC networking
- RDS & storage services (S3, EBS)
- EKS (Kubernetes on AWS)
- CloudFormation basics
- Cost optimization

**Kết quả mong đợi:**

- Design cloud architecture
- Deploy on AWS
- Manage VPC networks
- Use managed services
- EKS clusters
- Security & cost optimization

---

### Giai Đoạn 6: Kubernetes Production (Tháng 10-11)

**File:** `devops-month-10-11-kubernetes-production.md`

📝 **Nội dung:**

**Tháng 10:**

- Production K8s best practices
- RBAC & security policies
- Network policies
- Pod Security Standards
- Secrets management (Sealed Secrets, External Secrets)
- Service Mesh basics (Istio/Linkerd)
- Advanced scheduling (Affinity, Taints, Tolerations)

**Tháng 11:**

- Multi-cluster management
- Disaster recovery
- Backup & restore (Velero)
- Advanced monitoring (Prometheus Operator)
- Distributed tracing (Jaeger)
- Chaos engineering
- Production readiness checklist

**Kết quả mong đợi:**

- Production-grade K8s clusters
- Security hardening
- High availability setup
- Disaster recovery plan
- Advanced observability
- Performance optimization

---

### Giai Đoạn 7: Infrastructure as Code (Tháng 12)

**File:** `devops-month-12-terraform-iac.md`

📝 **Nội dung:**

**Tuần 1-2: Terraform Fundamentals**

- Terraform basics
- HCL language
- Providers (AWS, K8s)
- State management
- Modules
- Variables & outputs

**Tuần 3: Advanced Terraform**

- Remote state (S3 + DynamoDB)
- Workspaces
- Import existing resources
- Terraform Cloud/Enterprise (optional)
- Best practices

**Tuần 4: Multi-Tool IaC**

- Ansible for configuration management
- Comparison: Terraform vs CloudFormation vs Pulumi
- When to use what
- IaC testing (Terratest)

**Kết quả mong đợi:**

- Provision infrastructure với code
- Manage multiple environments
- Team collaboration với IaC
- Version control infrastructure
- Reproducible environments

---

## 🎯 Capstone Project: End-to-End DevOps Platform

Sau 12 tháng, bạn sẽ build một complete DevOps platform:

### Infrastructure Layer

- [ ] AWS cloud infrastructure (VPC, subnets, security groups)
- [ ] Provisioned với Terraform
- [ ] Multiple environments: dev, staging, production
- [ ] Cost-optimized architecture

### Kubernetes Layer

- [ ] EKS clusters (or self-managed K8s)
- [ ] Production-grade configuration
- [ ] RBAC & security policies
- [ ] Network policies
- [ ] Service mesh (optional)

### Application Layer

- [ ] Full-stack application (Frontend + Backend + DB)
- [ ] Containerized với Docker
- [ ] Deployed via Helm charts
- [ ] Auto-scaling configured
- [ ] Health checks & liveness probes

### CI/CD Layer

- [ ] GitHub Actions workflows
- [ ] Automated testing (unit, integration, e2e)
- [ ] Security scanning
- [ ] Build & push Docker images
- [ ] GitOps với ArgoCD
- [ ] Multi-environment deployment pipeline

### Observability Layer

- [ ] Prometheus & Grafana for metrics
- [ ] ELK/EFK Stack for logging
- [ ] Distributed tracing (Jaeger)
- [ ] Custom dashboards
- [ ] Alerting rules
- [ ] On-call rotation (PagerDuty optional)

### Security Layer

- [ ] Secrets management
- [ ] Container scanning
- [ ] RBAC configured
- [ ] Network policies
- [ ] WAF (Web Application Firewall)
- [ ] Compliance monitoring

### Documentation

- [ ] Architecture diagrams
- [ ] Runbooks
- [ ] Disaster recovery procedures
- [ ] Onboarding guide
- [ ] API documentation

---

## 📚 Cách Sử Dụng Roadmap Này

### 1. Bắt Đầu Từ Đầu

```bash
# Mở file tháng 1-2
open devops-month-01-02-linux-docker-git.md
```

### 2. Track Progress

- Mỗi file có checkboxes `- [ ]`
- Check off khi hoàn thành: `- [x]`
- Track progress hàng tuần

### 3. Hands-On Practice

- **80% Practice, 20% Theory**
- Build projects sau mỗi tuần
- Document learnings
- Share progress

### 4. Community

- Join DevOps Vietnam Facebook group
- Post weekly progress
- Help others
- Ask questions

---

## 🛠️ Tools Cần Cài Đặt (macOS)

### Essential Tools

```bash
# Package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Terminal
brew install --cask iterm2

# Shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Docker
brew install --cask docker

# Kubernetes
brew install kubectl
brew install minikube
brew install helm

# Cloud
brew install awscli
brew install eksctl

# IaC
brew install terraform

# Git & Version Control
brew install git

# Development
brew install --cask visual-studio-code

# Utilities
brew install tree htop wget curl jq
brew install --cask rectangle  # window management
```

### VS Code Extensions

- Docker
- Kubernetes
- GitLens
- YAML
- Terraform
- Remote - SSH
- REST Client

---

## 📊 Progress Tracking Template

### Monthly Tracking

```markdown
## Tháng [X]: [Tên giai đoạn]
- Date Started: __________
- Expected Completion: __________

### Week 1
- [ ] Task 1
- [ ] Task 2
- Challenges: __________
- Key Learnings: __________

### Week 2
- [ ] Task 1
- [ ] Task 2
- Challenges: __________
- Key Learnings: __________

### Mini Project
- [ ] Completed
- GitHub: __________
- Demo: __________
```

---

## 🎓 Learning Tips

### Daily Habits

1. **Practice Terminal Commands** (30 mins)
   - Use terminal for everything
   - Learn keyboard shortcuts
   - Write small scripts

2. **Build Something** (1-2 hours)
   - Follow tutorials
   - Build projects
   - Break things and fix them

3. **Read Documentation** (30 mins)
   - Official docs are best
   - Read error messages carefully
   - Google efficiently

4. **Share & Document** (15 mins)
   - Write blog posts
   - Share on LinkedIn/Twitter
   - Document learnings

### Weekly Goals

- [ ] Complete assigned week tasks
- [ ] Build mini project
- [ ] Document key learnings
- [ ] Help someone in community

### Monthly Goals

- [ ] Complete monthly capstone project
- [ ] Update resume/LinkedIn
- [ ] Write technical blog post
- [ ] Contribute to open-source (optional)

---

## 🚀 Career Path

### After 3 Months

**Junior DevOps Engineer**

- Can deploy applications
- Understand CI/CD
- Basic Docker & K8s

### After 6 Months

**DevOps Engineer**

- Production deployments
- Monitoring & logging
- Cloud platforms (AWS)
- Troubleshooting skills

### After 9 Months

**Senior DevOps Engineer**

- Design architecture
- Security best practices
- Cost optimization
- Mentor others

### After 12 Months

**DevOps/SRE Lead**

- Lead projects
- Design platforms
- Implement best practices
- Interview & hire

---

## 📖 Additional Resources

### Books

- "The Phoenix Project" - Gene Kim
- "The DevOps Handbook" - Gene Kim
- "Site Reliability Engineering" - Google
- "Kubernetes Up & Running" - O'Reilly

### Online Platforms

- [ ] Linux Academy / A Cloud Guru
- [ ] Udemy (Mumshad Kubernetes courses)
- [ ] Coursera (Google Cloud, AWS)
- [ ] FreeCodeCamp (YouTube)
- [ ] KodeKloud

### Communities

- [ ] DevOps Vietnam (Facebook)
- [ ] r/devops (Reddit)
- [ ] CNCF Slack
- [ ] Kubernetes Slack
- [ ] DevOps Discord servers

### Blogs & Newsletters

- [ ] DevOps Weekly
- [ ] SRE Weekly
- [ ] AWS Blog
- [ ] Kubernetes Blog
- [ ] Medium #devops

### Certifications (Optional but Recommended)

- **Month 3-6:**
  - [ ] Docker Certified Associate
  - [ ] Certified Kubernetes Administrator (CKA)

- **Month 6-9:**
  - [ ] AWS Certified Solutions Architect
  - [ ] AWS Certified DevOps Engineer

- **Month 9-12:**
  - [ ] Certified Kubernetes Application Developer (CKAD)
  - [ ] Terraform Associate

---

## ⚠️ Important Notes

### Pace Yourself

- This is a **marathon, not a sprint**
- It's okay to take longer on difficult topics
- Quality > Speed

### Practice is Key

- **You learn by doing**
- Build projects, not just tutorials
- Break things and fix them

### Community Support

- Don't learn alone
- Ask questions
- Help others
- Share progress

### Stay Updated

- DevOps tools evolve quickly
- Follow latest trends
- Read release notes
- Experiment with new tools

---

## 🎉 Getting Started

1. **Clone or download all roadmap files**
2. **Start with Month 1-2**
3. **Set up your macOS environment**
4. **Join DevOps communities**
5. **Track your progress**
6. **Build, break, fix, repeat!**

---

## 📧 Questions?

- Review the specific month's file for details
- Check Resources section
- Ask in DevOps Vietnam group
- Google is your friend
- Read documentation

---

**Remember:** Every DevOps expert started where you are now. The journey of 1000 miles begins with a single step. You've got this! 🚀

**Chúc bạn học tốt và thành công! Good luck! 💪**

---

*Last updated: December 2024*
*Roadmap Version: 1.0*
