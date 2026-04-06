# ☁️ AWS EC2 Basics - Complete Guide

## Understanding Amazon Elastic Compute Cloud from Zero to Production

**Target Audience:** Developers new to AWS who need to understand EC2 fundamentals

**What You'll Learn:**

- What EC2 is and why it exists
- EC2 instance types and how to choose
- Security groups (AWS firewall)
- SSH key pairs for secure access
- Elastic IPs for static addresses
- Free tier limits and cost optimization
- Best practices for production use

**Time Required:** 2-3 hours to read and understand

---

# Part 1: Understanding EC2

## 1.1 What is EC2?

### The Simple Explanation

**EC2 = Virtual computer in the cloud**

```
Traditional Setup:
You buy physical server → Install in office → Connect to internet
├─ Cost: $1000-5000 upfront
├─ Setup time: Days/weeks
├─ Maintenance: You handle everything
└─ Scalability: Buy more servers

AWS EC2:
You rent virtual server → Running in 2 minutes → Pay by the hour
├─ Cost: $0-hundreds per month (pay as you go)
├─ Setup time: Minutes
├─ Maintenance: AWS handles hardware
└─ Scalability: Launch more instances instantly
```

---

### What Does "Elastic" Mean?

**Elastic = Flexible, Can grow or shrink**

```
Example Scenario - E-commerce site:

Normal traffic (100 users):
→ 1 small instance ($10/month)

Black Friday (10,000 users):
→ Scale to 10 large instances ($500/month)

After Black Friday:
→ Scale back to 1 instance ($10/month)

You only pay for what you use!
```

---

### EC2 vs Your Local Machine

| Feature          | Your Laptop          | EC2 Instance               |
| ---------------- | -------------------- | -------------------------- |
| **Availability** | Only when turned on  | 24/7/365                   |
| **Internet**     | Home WiFi            | AWS data center (fast!)    |
| **IP Address**   | Changes (dynamic)    | Can be static (Elastic IP) |
| **Backup**       | Manual               | Automated (snapshots)      |
| **Scaling**      | Can't add RAM easily | Click button to upgrade    |
| **Cost**         | One-time purchase    | Pay per hour               |
| **Location**     | Your home            | Worldwide (regions)        |

---

## 1.2 Core EC2 concepts

### Instance = Virtual Server

```
1 EC2 Instance = 1 Virtual Computer

Components:
├─ CPU (vCPU)          → Processing power
├─ RAM (Memory)        → Working memory
├─ Storage (EBS)       → Hard disk
├─ Network (VPC)       → Internet connection
└─ OS (AMI)            → Operating system
```

### AMI (Amazon Machine Image)

**AMI = Operating System Template**

```
Think of AMI as:
- DVD with Windows/Linux installer
- But pre-configured and ready to use

Common AMIs:
✅ Ubuntu 24.04 LTS (Most popular for web apps)
✅ Amazon Linux 2023 (AWS optimized)
✅ Windows Server 2022
✅ Red Hat Enterprise Linux
✅ Custom AMIs (your own configurations)
```

### Regions and Availability Zones

**Region = Geographic location**

```
AWS Regions (examples):
├─ us-east-1 (N. Virginia, USA)
├─ us-west-2 (Oregon, USA)
├─ eu-west-1 (Ireland, Europe)
├─ ap-southeast-1 (Singapore, Asia)
└─ ap-southeast-2 (Sydney, Australia)

Choose based on:
✅ User location (lower latency)
✅ Data regulations (GDPR, etc.)
✅ Service availability
✅ Cost (varies by region)
```

**Availability Zone = Data center within region**

```
Example: us-east-1 has 6 availability zones:
├─ us-east-1a
├─ us-east-1b
├─ us-east-1c
├─ us-east-1d
├─ us-east-1e
└─ us-east-1f

Each AZ is isolated:
- Separate building
- Separate power
- Separate network

Benefits:
✅ High availability (if 1a fails, 1b still works)
✅ Disaster recovery
```

---

# Part 2: EC2 Instance Types

## 2.1 Understanding Instance Types

### Instance Type Naming Convention

```
Format: [Family][Generation].[Size]

Example: t3.medium
         │ │  └── Size (nano, micro, small, medium, large, xlarge, 2xlarge...)
         │ └───── Generation (3 = 3rd generation)
         └──────── Family (t = Burstable performance)

More examples:
t3.micro    → Burstable, generation 3, micro size
m5.large    → General purpose, gen 5, large size
c6g.xlarge  → Compute optimized, gen 6 Graviton, xlarge
```

---

## 2.2 Instance Families

### Family 1: T (Burstable Performance)

**Best for:** Development, small websites, testing

**Models:** t2, t3, t3a, t4g

**How it works:**

```
CPU Credits System:
- Baseline performance (e.g., 20% CPU)
- Can burst to 100% CPU when needed
- Uses CPU credits during burst
- Earns credits when idle

Example: t3.micro
Baseline: 10% CPU continuously
Burst: 100% CPU for limited time

Perfect for:
✅ Web servers (mostly idle, occasional spikes)
✅ Development environments
✅ Small databases
✅ Learning/testing

Not good for:
❌ Sustained high CPU
❌ Video encoding
❌ Scientific computing
```

**Credit balance analogy:**

```
CPU Credits = Battery charge

Idle time: Charging battery (earning credits)
Busy time: Using battery (spending credits)

If battery empty: CPU throttled to baseline (10%)
If battery full: Can burst to 100%
```

**T family comparison:**

```
Instance    vCPU  RAM    Baseline  Price/month
-----------------------------------------------
t3.nano     2     0.5GB  5%        $3.80
t3.micro    2     1GB    10%       $7.59
t3.small    2     2GB    20%       $15.18
t3.medium   2     4GB    20%       $30.37
t3.large    2     8GB    30%       $60.74
t3.xlarge   4     16GB   40%       $121.47

(Prices in us-east-1, subject to change)
```

---

### Family 2: M (General Purpose)

**Best for:** Balanced workloads, production apps

**Models:** m5, m6i, m7g

**Characteristics:**

```
Balanced ratio:
├─ CPU: Good
├─ RAM: Good
├─ Network: Good
└─ Storage: Good

No CPU credits - consistent performance

Use when:
✅ Application servers (moderate load)
✅ Medium-traffic websites
✅ Small-medium databases
✅ Backend services
```

**Example: m5.large**

```
Specs:
- 2 vCPU (Intel Xeon, 100% all the time)
- 8 GB RAM
- Up to 10 Gbps network
- EBS optimized

Price: ~$70/month

vs t3.large ($60/month):
+ No CPU throttling
+ Better sustained performance
- Costs more
- Overkill if mostly idle
```

---

### Family 3: C (Compute Optimized)

**Best for:** CPU-intensive tasks

**Models:** c5, c6i, c7g

**Characteristics:**

```
High CPU-to-RAM ratio:
More vCPU, less RAM compared to M family

Example: c5.large
- 2 vCPU (powerful)
- 4 GB RAM (half of m5.large)

Use cases:
✅ Video encoding/transcoding
✅ Batch processing
✅ Scientific modeling
✅ Machine learning inference
✅ Gaming servers
✅ High-traffic web servers
```

---

### Family 4: R (Memory Optimized)

**Best for:** RAM-intensive tasks

**Models:** r5, r6i, r7g

**Characteristics:**

```
High RAM-to-CPU ratio:
Less vCPU, more RAM compared to M family

Example: r5.large
- 2 vCPU
- 16 GB RAM (double m5.large)

Use cases:
✅ Large databases (Redis, Elasticsearch)
✅ In-memory caching
✅ Big data analytics
✅ Real-time processing
```

---

### Family 5: G (GPU Instances)

**Best for:** Graphics, ML training

**Models:** g4, g5, p3, p4

**Characteristics:**

```
Has GPU (Graphics Processing Unit)

Use cases:
✅ Machine learning training
✅ Deep learning
✅ Video rendering
✅ 3D visualization
✅ Gaming streaming

Warning: Expensive!
g4dn.xlarge: ~$390/month
```

---

### Family 6: T4g, M7g, C7g (ARM-based Graviton)

**AWS Graviton = ARM processors (like Apple M1/M2)**

**Benefits:**

```
vs Intel/AMD instances:
✅ 40% better price-performance
✅ 60% less energy
✅ Same or better performance

Example: t4g.micro vs t3.micro
- Same specs (2 vCPU, 1GB RAM)
- 20% cheaper ($6.07 vs $7.59/month)

Limitation:
⚠️ ARM architecture (not x86)
⚠️ Some software may not work
⚠️ Docker images must be ARM-compatible

Good for:
✅ New applications
✅ Docker/containerized apps
✅ Open source software

Not good for:
❌ Legacy software (x86 only)
❌ Windows applications
❌ Proprietary software
```

---

## 2.3 How to Choose Instance Type

### Decision Framework

```
Step 1: What's your workload?
├─ Web app (occasional traffic) → T family
├─ Web app (consistent traffic) → M family
├─ API server (CPU heavy) → C family
├─ Database (RAM heavy) → R family
├─ ML training → G family
└─ Not sure → Start with t3.micro

Step 2: How much traffic?
├─ <100 users/day → t3.micro/small
├─ 100-1000 users/day → t3.medium/large
├─ 1000-10000 users/day → m5.large/xlarge
└─ >10000 users/day → Multiple instances + load balancer

Step 3: What's your budget?
├─ Learning/testing → t3.micro (free tier)
├─ Small project → t3.small/medium ($15-30/month)
├─ Production app → m5.large ($70/month)
└─ High performance → As needed (monitor and adjust)
```

---

### Real-World Examples

**Example 1: Blog/Portfolio Site**

```
Traffic: 50 visitors/day
Database: PostgreSQL (small)
Files: Static assets on S3

Best choice: t3.micro
- 2 vCPU, 1GB RAM
- Free tier (first year)
- CPU burst handles traffic spikes
- Cost: $0-7/month
```

**Example 2: Startup SaaS App**

```
Traffic: 500 users/day
Database: RDS (separate)
Backend: Node.js API

Best choice: t3.medium (start) → m5.large (grow)
- Start small, scale up as needed
- Monitor CPU credit balance
- Upgrade when consistently hitting limits
- Cost: $30-70/month
```

**Example 3: E-commerce Site**

```
Traffic: 5000 users/day
Database: RDS r5.large (separate)
Backend: Multiple services
Peak hours: Evenings

Best choice: m5.large (2+ instances) + Auto Scaling
- Consistent performance needed
- Scale out during peak
- Load balancer
- Cost: $150-500/month
```

**Example 4: Video Processing**

```
Task: Convert uploaded videos
Pattern: Batch processing
CPU: Heavy use during processing

Best choice: c5.large (spot instances)
- Only run when needed
- Terminate when idle
- Use Spot for 70% discount
- Cost: Variable ($50-200/month)
```

---

## 2.4 Instance Size Comparison

### T3 Family (Most Common for Beginners)

```
┌──────────────┬──────┬────────┬──────────┬─────────┬────────────┐
│ Instance     │ vCPU │ Memory │ Baseline │ Price/mo│ Use Case   │
├──────────────┼──────┼────────┼──────────┼─────────┼────────────┤
│ t3.nano      │  2   │ 0.5 GB │    5%    │  $3.80  │ Testing    │
│ t3.micro ✅  │  2   │ 1 GB   │   10%    │  $7.59  │ Small app  │
│ t3.small     │  2   │ 2 GB   │   20%    │ $15.18  │ Medium app │
│ t3.medium    │  2   │ 4 GB   │   20%    │ $30.37  │ Prod app   │
│ t3.large     │  2   │ 8 GB   │   30%    │ $60.74  │ Busy app   │
│ t3.xlarge    │  4   │ 16 GB  │   40%    │$121.47  │ Heavy app  │
│ t3.2xlarge   │  8   │ 32 GB  │   40%    │$242.93  │ Very heavy │
└──────────────┴──────┴────────┴──────────┴─────────┴────────────┘

✅ = Free tier eligible (750 hours/month, first 12 months)
```

### How Much RAM Do You Need?

```
Application Type          Recommended RAM
------------------------------------------------
Static website            512 MB - 1 GB
Node.js/Python API        1 - 2 GB
WordPress                 2 - 4 GB
Small database            4 - 8 GB
Medium Rails app          4 - 8 GB
Docker (multiple)         8 - 16 GB
Large database            16+ GB

Rule of thumb:
OS (Ubuntu): ~500 MB
Your app: depends
Buffer: 25-50% extra
```

---

# Part 3: Security Groups

## 3.1 What Are Security Groups?

### The Firewall Analogy

```
Security Group = Firewall for your EC2 instance

Think of it as:
Your house = EC2 instance
Security Group = Locked door with specific keys

Rules define:
- Who can enter (IP addresses)
- Which doors are open (ports)
- What they can do (protocols)
```

---

### How Security Groups Work

```
Internet
    ↓
    │ Request to 54.123.456.789:80 (HTTP)
    ↓
┌───────────────────────────────────────┐
│     Security Group Rules              │
│                                       │
│  Inbound:                             │
│  ✅ HTTP (80) from 0.0.0.0/0         │
│  ✅ HTTPS (443) from 0.0.0.0/0       │
│  ✅ SSH (22) from My IP only         │
│  ❌ Everything else DENIED           │
└───────────────────────────────────────┘
    ↓
    │ Allowed requests pass through
    ↓
┌───────────────────────────────────────┐
│        EC2 Instance                   │
│        (Your server)                  │
└───────────────────────────────────────┘
```

---

## 3.2 Inbound vs Outbound Rules

### Inbound Rules (Incoming Traffic)

**Controls who can CONNECT TO your instance**

```
Example: Web server security group

Rule 1: Allow HTTP
- Type: HTTP
- Protocol: TCP
- Port: 80
- Source: 0.0.0.0/0 (anywhere)
- Purpose: Let users access website

Rule 2: Allow HTTPS
- Type: HTTPS
- Protocol: TCP
- Port: 443
- Source: 0.0.0.0/0 (anywhere)
- Purpose: Let users access website securely

Rule 3: Allow SSH
- Type: SSH
- Protocol: TCP
- Port: 22
- Source: Your IP (e.g., 123.45.67.89/32)
- Purpose: Let YOU manage server

Everything else: DENIED by default
```

### Outbound Rules (Outgoing Traffic)

**Controls what your instance can CONNECT TO**

```
Default: Allow all outbound
- Instance can access internet
- Instance can update packages
- Instance can call APIs

Usually you DON'T need to change this

Exception: High-security environments
- Restrict outbound to specific IPs
- Block certain ports
- Audit all external connections
```

---

## 3.3 Common Security Group Configurations

### Configuration 1: Web Server (Public)

```yaml
Name: web-server-sg

Inbound Rules:
  - Type: SSH
    Port: 22
    Source: My IP (123.45.67.89/32)
    Description: 'SSH access from office'

  - Type: HTTP
    Port: 80
    Source: 0.0.0.0/0 (anywhere)
    Description: 'Public web access'

  - Type: HTTPS
    Port: 443
    Source: 0.0.0.0/0 (anywhere)
    Description: 'Public HTTPS access'

Outbound Rules:
  - Type: All traffic
    Destination: 0.0.0.0/0 (anywhere)
    Description: 'Allow all outbound'
```

**Use case:** Blog, company website, public API

---

### Configuration 2: Database Server (Private)

```yaml
Name: database-sg

Inbound Rules:
  - Type: PostgreSQL
    Port: 5432
    Source: sg-123456 (web-server-sg)
    Description: 'Database access from web servers only'

  - Type: SSH
    Port: 22
    Source: 10.0.1.0/24 (VPC subnet)
    Description: 'SSH from within VPC'

Outbound Rules:
  - Type: HTTPS
    Port: 443
    Destination: 0.0.0.0/0
    Description: 'Package updates only'
```

**Use case:** Production database, not directly accessible from internet

---

### Configuration 3: Application Server (Internal)

```yaml
Name: app-server-sg

Inbound Rules:
  - Type: Custom TCP
    Port: 3000
    Source: sg-789012 (load-balancer-sg)
    Description: 'Node.js API from load balancer'

  - Type: SSH
    Port: 22
    Source: sg-345678 (bastion-sg)
    Description: 'SSH through bastion host'

Outbound Rules:
  - Type: PostgreSQL
    Port: 5432
    Destination: sg-123456 (database-sg)
    Description: 'Connect to database'

  - Type: HTTPS
    Port: 443
    Destination: 0.0.0.0/0
    Description: 'External API calls'
```

**Use case:** Backend API, accessed through load balancer only

---

## 3.4 Source Types Explained

### 1. CIDR Block (IP Ranges)

```
Format: IP/Subnet

Examples:
0.0.0.0/0        → Entire internet (anywhere)
123.45.67.89/32  → Single IP (your computer)
10.0.0.0/16      → IP range (10.0.0.0 to 10.0.255.255)
192.168.1.0/24   → Local network (192.168.1.0 to 192.168.1.255)

/32 = Exactly one IP (most specific)
/0 = All IPs (least specific)
```

**Example usage:**

```yaml
# Allow only your office
Source: 203.45.67.0/24

# Allow only your home
Source: 123.45.67.89/32

# Allow anyone (public website)
Source: 0.0.0.0/0
```

---

### 2. Security Group (Reference Another SG)

```
Instead of IP, reference another security group

Example:
Inbound rule on database-sg:
- Source: web-server-sg

Means: Allow any instance with web-server-sg to connect

Benefits:
✅ Dynamic (IPs can change, SG stays same)
✅ Cleaner (no IP management)
✅ Flexible (add/remove instances easily)
```

**Real scenario:**

```
You have:
- 3 web servers (all have web-server-sg)
- 1 database server (has database-sg)

Database security group:
Inbound: PostgreSQL from web-server-sg

Result:
- All 3 web servers can connect to database
- Add 4th web server → automatically gets access
- No need to update firewall rules
```

---

### 3. Prefix List (Managed IP Lists)

```
Prefix List = Named collection of CIDR blocks

AWS Managed:
- S3 prefix list
- CloudFront prefix list
- DynamoDB prefix list

Custom:
- Office locations
- Partner networks
- CDN providers

Example:
Allow: pl-12345678 (S3 in us-east-1)
```

---

## 3.5 Security Group Best Practices

### ✅ DO: Principle of Least Privilege

```
Only open ports you need
Only from sources you need

Bad:
- All ports open (0-65535)
- All from anywhere (0.0.0.0/0)

Good:
- Port 80, 443 from anywhere (public web)
- Port 22 from your IP only (SSH)
- Port 5432 from app servers only (database)
```

---

### ✅ DO: Use Descriptive Names

```
Bad names:
- sg-12345
- test-sg
- my-security-group

Good names:
- prod-web-server-sg
- staging-database-sg
- dev-api-server-sg
- bastion-host-ssh-sg
```

---

### ✅ DO: Use Descriptions

```
Rule without description:
- Port 8080 from 0.0.0.0/0

Rule with description:
- Port 8080 from 0.0.0.0/0
  Description: "Tomcat application server - public access"

Why:
- Team members understand purpose
- Audit trail
- Easy to review
```

---

### ❌ DON'T: Use 0.0.0.0/0 for SSH

```
Bad:
SSH (22) from 0.0.0.0/0

Why bad:
- Attackers scan for open SSH
- Brute force attempts
- Security risk

Good:
SSH (22) from Your IP/32

Even better:
- Use Bastion host
- Use AWS Session Manager (no SSH port needed)
- Use VPN
```

---

### ❌ DON'T: Have Too Many Rules

```
If security group has 50+ rules:
- Hard to manage
- Hard to audit
- Probably doing something wrong

Better:
- Split into multiple security groups
- Use layered approach
- Group by function
```

---

### ❌ DON'T: Forget to Review Regularly

```
Security drift happens:

Month 1: 5 rules (minimal)
Month 6: 15 rules (added for debugging)
Month 12: 30 rules (some unused)

Solution:
- Quarterly review
- Remove unused rules
- Document all changes
- Use tagging
```

---

## 3.6 Common Ports Reference

```
┌────────────────┬─────────┬──────────────────────────────┐
│ Service        │ Port    │ Purpose                      │
├────────────────┼─────────┼──────────────────────────────┤
│ HTTP           │ 80      │ Web traffic (unencrypted)    │
│ HTTPS          │ 443     │ Web traffic (encrypted)      │
│ SSH            │ 22      │ Remote server access         │
│ FTP            │ 21      │ File transfer (avoid!)       │
│ FTPS           │ 990     │ Secure file transfer         │
│ SFTP           │ 22      │ SSH file transfer            │
│ MySQL          │ 3306    │ MySQL database               │
│ PostgreSQL     │ 5432    │ PostgreSQL database          │
│ MongoDB        │ 27017   │ MongoDB database             │
│ Redis          │ 6379    │ Redis cache                  │
│ Elasticsearch  │ 9200    │ Elasticsearch                │
│ RDP            │ 3389    │ Windows remote desktop       │
│ SMTP           │ 25      │ Email (outgoing)             │
│ SMTPS          │ 587     │ Email (secure outgoing)      │
│ POP3           │ 110     │ Email (incoming)             │
│ IMAP           │ 143     │ Email (incoming)             │
│ DNS            │ 53      │ Domain name resolution       │
│ NTP            │ 123     │ Time synchronization         │
└────────────────┴─────────┴──────────────────────────────┘

Custom application ports:
- Node.js: Often 3000, 8080
- React dev: 3000, 5173 (Vite)
- Python Flask: 5000
- Ruby Rails: 3000
- Java Tomcat: 8080
- Docker: 2375, 2376
```

---

# Part 4: SSH Key Pairs

## 4.1 Understanding SSH Keys

### What Are SSH Keys?

```
SSH Key = Secure way to login to servers

Old way (password):
ssh user@server
Password: *******

Problems:
❌ Can be guessed
❌ Can be intercepted
❌ Hard to rotate
❌ Can't audit who logged in

New way (SSH key):
ssh -i key.pem user@server
(No password needed)

Benefits:
✅ Mathematically secure
✅ Can't be guessed
✅ Easy to rotate
✅ Can track individual users
```

---

### Public Key vs Private Key

**Key Pair = Two related keys**

```
┌─────────────────────────────────────────────┐
│          Key Pair                           │
├─────────────────────────────────────────────┤
│                                             │
│  Public Key (Lock)                          │
│  - Can be shared                            │
│  - Stored on EC2 server                     │
│  - Like a padlock                           │
│                                             │
│  Private Key (Key)                          │
│  - MUST be kept secret                      │
│  - Stored on your computer                  │
│  - Like the key to padlock                  │
│                                             │
│  Only matching pair works together!         │
└─────────────────────────────────────────────┘
```

**Analogy:**

```
Public Key = Mailbox
- Anyone can put letter in (encrypt)
- Only you can open with key (private key)

Private Key = Mailbox key
- Only owner has it
- Opens the mailbox
- Must keep it safe
```

---

## 4.2 Creating SSH Key Pairs

### Method 1: AWS Console (Recommended for Beginners)

```
Steps:
1. EC2 Console → Key Pairs → Create key pair

2. Settings:
   Name: myapp-production-key
   Key pair type: RSA
   Private key format: .pem (Mac/Linux) or .ppk (Windows/PuTTY)

3. Click "Create key pair"
   → File downloads: myapp-production-key.pem

4. IMPORTANT: Move to safe location

   Mac/Linux:
   mkdir -p ~/.ssh
   mv ~/Downloads/myapp-production-key.pem ~/.ssh/
   chmod 400 ~/.ssh/myapp-production-key.pem

   Windows:
   Move to: C:\Users\YourName\.ssh\
   Set permissions: Right-click → Properties → Security
```

---

### Method 2: Generate Locally (Advanced)

```bash
# Mac/Linux
ssh-keygen -t rsa -b 4096 -C "myapp-production"

# Prompts:
# Enter file: ~/.ssh/myapp-production
# Enter passphrase: (optional but recommended)

# Creates two files:
# ~/.ssh/myapp-production (private key)
# ~/.ssh/myapp-production.pub (public key)

# Import public key to AWS:
# EC2 → Key Pairs → Import key pair
# Paste content of .pub file
```

**Why generate locally?**

```
✅ You control key generation
✅ Can use passphrase
✅ Can create backups before importing
✅ Can use same key on multiple clouds

AWS method:
✅ Simpler
✅ AWS generates strong key
✅ One-click process
❌ Can't recreate if lost
```

---

## 4.3 Using SSH Keys

### Basic SSH Connection

```bash
# Format:
ssh -i /path/to/key.pem username@ip-address

# Example:
ssh -i ~/.ssh/myapp-production-key.pem ubuntu@54.123.456.789

# Username depends on AMI:
# - Ubuntu: ubuntu
# - Amazon Linux: ec2-user
# - Red Hat: ec2-user
# - Debian: admin
# - CentOS: centos
```

---

### First Connection

```bash
# First time SSH
ssh -i ~/.ssh/myapp-production-key.pem ubuntu@54.123.456.789

# Prompt:
The authenticity of host '54.123.456.789' can't be established.
ECDSA key fingerprint is SHA256:abc123...xyz789.
Are you sure you want to continue connecting (yes/no)?

# Type: yes

# Adds to known_hosts:
~/.ssh/known_hosts

# Next time: No prompt
```

---

### SSH Config (Time Saver)

**Instead of typing long command:**

```bash
# Create config file
nano ~/.ssh/config

# Add:
Host myapp-prod
    HostName 54.123.456.789
    User ubuntu
    IdentityFile ~/.ssh/myapp-production-key.pem

Host myapp-staging
    HostName 54.111.222.333
    User ubuntu
    IdentityFile ~/.ssh/myapp-staging-key.pem

# Save and exit

# Now simply:
ssh myapp-prod
ssh myapp-staging

# Much easier!
```

---

## 4.4 SSH Key Security

### ✅ DO: Protect Private Key

```bash
# Correct permissions: 400 (read-only by owner)
chmod 400 ~/.ssh/myapp-production-key.pem

# Why?
# SSH refuses to use keys with wrong permissions
# "Permissions 0644 for 'key.pem' are too open"

# Mac/Linux:
chmod 400 ~/.ssh/*.pem

# Windows:
# Right-click → Properties → Security
# Remove all users except yourself
# Set to Read-only
```

---

### ✅ DO: Use Passphrase

```
Private key without passphrase:
- If stolen → immediate access

Private key with passphrase:
- If stolen → attacker needs passphrase too
- Like password-protected zip file

Create with passphrase:
ssh-keygen -t rsa -b 4096 -C "myapp"
Enter passphrase: ********

Using with passphrase:
ssh -i key.pem user@server
Enter passphrase: ******** (each time)

Avoid typing each time:
Use ssh-agent (stores passphrase in memory)
```

---

### ✅ DO: Backup Safely

```
Backup locations:
✅ Encrypted USB drive
✅ Password manager (1Password, LastPass)
✅ Encrypted cloud storage
✅ Hardware security key

Never:
❌ Email to yourself
❌ Unencrypted cloud storage
❌ Shared folders
❌ Version control (Git)
```

---

### ✅ DO: Rotate Keys Regularly

```
Best practice: Rotate every 90 days

Process:
1. Generate new key pair
2. Add new public key to server:
   ~/.ssh/authorized_keys
3. Test new key works
4. Remove old public key
5. Delete old private key
6. Update team documentation

AWS method:
1. Create new key pair in AWS
2. Launch new instance with new key
3. Migrate traffic
4. Terminate old instance
5. Delete old key pair
```

---

### ❌ DON'T: Share Private Keys

```
Bad:
- Same key for all team members
- Send key via Slack/email
- "Can you send me the prod key?"

Good:
- Each person has own key pair
- Add all public keys to server
- Audit who logs in

Server setup:
~/.ssh/authorized_keys contains multiple public keys:
ssh-rsa AAAAB3... alice@company.com
ssh-rsa AAAAB3... bob@company.com
ssh-rsa AAAAB3... charlie@company.com

Each person uses their own private key
```

---

### ❌ DON'T: Commit to Git

```
.gitignore should include:
*.pem
*.ppk
*.key
.ssh/
id_rsa
id_rsa.pub

If accidentally committed:
1. Immediately rotate key
2. Remove from Git history:
   git filter-branch --tree-filter 'rm -f key.pem' HEAD
3. Force push (breaks others' checkouts!)
4. Inform team
```

---

## 4.5 SSH Troubleshooting

### Error: "Permission denied (publickey)"

```bash
Causes:
1. Wrong key file
2. Wrong username
3. Key not in authorized_keys
4. Wrong permissions

Solutions:

# Check username (Ubuntu vs ec2-user)
ssh -i key.pem ubuntu@ip
ssh -i key.pem ec2-user@ip

# Verify key permissions
ls -l ~/.ssh/key.pem
# Should be: -r-------- (400)

chmod 400 ~/.ssh/key.pem

# Use verbose mode to debug
ssh -vvv -i key.pem ubuntu@ip
```

---

### Error: "Connection timed out"

```bash
Causes:
1. Security group doesn't allow SSH (port 22)
2. Instance not running
3. Wrong IP address
4. Network issues

Solutions:

# Check instance state
AWS Console → EC2 → Instances
State should be: Running

# Check security group
Inbound rules should have:
Type: SSH
Port: 22
Source: Your IP or 0.0.0.0/0

# Check IP address
Use Public IPv4 address (not private)

# Check network
ping 54.123.456.789
```

---

### Error: "Host key verification failed"

```bash
Cause:
IP address was reused
Server was rebuilt
Man-in-the-middle attack (rare)

Solution:

# Remove old host key
ssh-keygen -R 54.123.456.789

# Or edit known_hosts
nano ~/.ssh/known_hosts
# Delete line with that IP

# Connect again
ssh -i key.pem ubuntu@54.123.456.789
# Type: yes
```

---

# Part 5: Elastic IPs

## 5.1 Understanding Elastic IPs

### Public IP vs Elastic IP

**Standard Public IP:**

```
When you launch EC2:
→ Gets public IP: 54.123.456.789

When you stop and start EC2:
→ Gets NEW public IP: 54.111.222.333

Problem:
- IP changes every stop/start
- DNS records must be updated
- Clients lose connection
```

**Elastic IP:**

```
Allocate Elastic IP: 54.200.100.50
Associate with EC2

Stop and start EC2:
→ SAME Elastic IP: 54.200.100.50

Benefits:
✅ Static (never changes)
✅ Can move between instances
✅ No DNS updates needed
```

---

### How Elastic IPs Work

```
┌─────────────────────────────────────────┐
│    Your Elastic IP Pool                 │
│    54.200.100.50 (allocated)            │
└─────────────────────────────────────────┘
            ↓ Associate
┌─────────────────────────────────────────┐
│    EC2 Instance (i-12345678)            │
│    Private IP: 10.0.1.100               │
│    Public IP: 54.200.100.50 ←           │
└─────────────────────────────────────────┘

Can disassociate and reassociate:
54.200.100.50 → Instance A
(Disassociate)
54.200.100.50 → Instance B

Like a phone number you can transfer between phones
```

---

## 5.2 When to Use Elastic IPs

### ✅ Use Elastic IP When:

**1. Running services that need static IP**

```
Examples:
- Whitelisted API access
- VPN server
- Mail server
- FTP server

Client requires: "Allow access from 54.200.100.50"
→ Use Elastic IP so it never changes
```

**2. Quick failover needed**

```
Scenario:
Instance A fails
→ Disassociate EIP from A
→ Associate EIP with standby Instance B
→ Service resumes with same IP

Downtime: 2-3 minutes (just IP reassociation)
```

**3. DNS propagation is slow**

```
With normal IP:
Instance gets new IP → Update DNS → Wait 24-48 hours for propagation

With Elastic IP:
IP never changes → No DNS update needed
```

---

### ❌ Don't Use Elastic IP When:

**1. Using Load Balancer**

```
Load Balancer already has static DNS:
myapp-lb-123456.us-east-1.elb.amazonaws.com

No need for Elastic IP on instances behind LB
```

**2. Cost-sensitive project**

```
Elastic IP costs:
- FREE if associated with running instance
- $0.005/hour if NOT associated (~ $3.60/month)
- $0.005/hour if associated with stopped instance

Idle Elastic IPs cost money!
```

**3. Using domain name**

```
If you have domain:
myapp.com → CNAME → myapp.amazonaws.com

Better than:
myapp.com → A record → 54.200.100.50

Why?
- Can use CloudFront
- Can use multiple instances
- More flexible
```

---

## 5.3 Managing Elastic IPs

### Allocate Elastic IP

```
AWS Console:
1. EC2 → Elastic IPs → Allocate Elastic IP address
2. Amazon's pool of IPv4 addresses
3. Click "Allocate"
4. You now have: 54.200.100.50

AWS CLI:
aws ec2 allocate-address --region us-east-1

Cost:
- $0 while associated with running instance
- $3.60/month if unassociated
```

---

### Associate with Instance

```
AWS Console:
1. Select Elastic IP
2. Actions → Associate Elastic IP address
3. Select instance
4. Click "Associate"

AWS CLI:
aws ec2 associate-address \
  --instance-id i-1234567890abcdef0 \
  --allocation-id eipalloc-12345678

Result:
Instance now has:
- Private IP: 10.0.1.100 (internal)
- Public IP: 54.200.100.50 (Elastic IP)
```

---

### Disassociate and Release

```
Disassociate (keep the IP):
1. Select Elastic IP
2. Actions → Disassociate Elastic IP address
3. Confirm

Result: IP reserved but not used ($3.60/month)

Release (give back to AWS):
1. Select Elastic IP
2. Actions → Release Elastic IP addresses
3. Confirm

Result: IP returned to AWS pool (no charge)

⚠️ Can't get same IP back once released!
```

---

## 5.4 Elastic IP Limits and Costs

### AWS Limits

```
Default limits per region:
- 5 Elastic IPs

Why limited?
- IPv4 addresses are scarce
- Prevent hoarding
- Encourage proper architecture

Need more?
Request limit increase:
AWS Console → Service Quotas → EC2 → Elastic IP addresses
```

---

### Cost Breakdown

```
Scenario 1: EIP with running instance
Cost: $0 (FREE!)

Scenario 2: EIP not associated
Allocated but not attached
Cost: $0.005/hour = $3.60/month

Scenario 3: EIP with stopped instance
Instance stopped but EIP still attached
Cost: $0.005/hour = $3.60/month

Scenario 4: Multiple EIPs on one instance
Only 1st EIP is free
2nd EIP: $0.005/hour = $3.60/month
3rd EIP: $0.005/hour = $3.60/month

Best practice: Release unused EIPs!
```

---

### Cost Optimization

```
✅ Release EIP when not needed
❌ Keep idle EIPs "just in case"

Example calculation:
5 idle Elastic IPs × $3.60/month = $18/month wasted

Over a year: $216 for nothing!

Solution:
Regular audit:
aws ec2 describe-addresses --region us-east-1 \
  --query 'Addresses[?AssociationId==null]'

Release unassociated IPs:
aws ec2 release-address --allocation-id eipalloc-12345678
```

---

## 5.5 Elastic IP Best Practices

### ✅ DO: Use for specific purposes only

```
Good uses:
✅ Bastion host (SSH gateway)
✅ NAT instance (if not using NAT Gateway)
✅ Whitelisted API server
✅ VPN server

Don't use for:
❌ Web servers (use Load Balancer)
❌ Auto-scaling instances
❌ Development/testing
```

---

### ✅ DO: Document your Elastic IPs

```
Tag your Elastic IPs:

Name: prod-bastion-host
Environment: production
Purpose: SSH access to private instances
Owner: devops-team
Created: 2024-01-15
```

---

### ❌ DON'T: Associate with Auto-scaled instances

```
Bad:
Auto Scaling Group with Elastic IP
→ Can't work (EIP can only attach to 1 instance)

Good:
Auto Scaling Group → Load Balancer → Instances
Use Load Balancer DNS instead
```

---

# Part 6: Free Tier Limits

## 6.1 Understanding AWS Free Tier

### Three Types of Free Tier

**1. Always Free**

```
Services free forever:
- AWS Lambda: 1 million requests/month
- DynamoDB: 25 GB storage
- CloudWatch: 10 metrics
- SNS: 1 million requests

EC2-related always free:
- CloudWatch monitoring (basic)
- Data transfer: 100 GB/month out to internet
```

**2. 12 Months Free**

```
Starting from account creation:
- EC2: 750 hours/month t2.micro or t3.micro
- EBS: 30 GB storage
- Elastic Load Balancer: 750 hours/month
- RDS: 750 hours/month db.t2.micro
- S3: 5 GB storage

Most important for us: EC2 750 hours
```

**3. Trials**

```
Limited time offers:
- Amazon SageMaker: 2 months
- Amazon Redshift: 2 months
- Various new services
```

---

## 6.2 EC2 Free Tier Details

### What's Included

```
┌─────────────────────────────────────────────────┐
│   EC2 Free Tier (First 12 months)               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Compute:                                       │
│  ✅ 750 hours/month t2.micro or t3.micro         │
│  ✅ Linux or Windows                             │
│  ✅ Any AWS region                               │
│                                                 │
│  Storage:                                       │
│  ✅ 30 GB EBS General Purpose (SSD) or Magnetic  │
│  ✅ 2 million I/O operations                    │
│  ✅ 1 GB snapshot storage                       │
│                                                 │
│  Data Transfer:                                 │
│  ✅ 100 GB/month out to internet                │
│  ✅ Unlimited in from internet                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Calculating 750 Hours

```
1 month ≈ 730-744 hours

750 hours = ?

Option 1: One instance 24/7
1 t3.micro running all month
= 744 hours (within limit) ✅

Option 2: Two instances part-time
2 t3.micro × 12 hours/day × 31 days
= 744 hours (within limit) ✅

Option 3: Multiple instances
3 t3.micro × 8 hours/day × 31 days
= 744 hours (within limit) ✅

Exceeding limit:
2 t3.micro × 24 hours × 31 days
= 1,488 hours
Charged for: 1,488 - 750 = 738 hours
Cost: 738 × $0.0104/hour ≈ $7.68
```

---

### What Counts Toward Free Tier

```
Eligible instances (pick one):
✅ t2.micro (older generation)
✅ t3.micro (newer, better)

Any of these regions:
✅ us-east-1 (N. Virginia)
✅ us-west-2 (Oregon)
✅ eu-west-1 (Ireland)
✅ ap-southeast-1 (Singapore)
✅ ... (all regions)

Any operating system:
✅ Amazon Linux 2023
✅ Ubuntu 24.04
✅ Windows Server 2022
✅ Red Hat Enterprise Linux

NOT eligible:
❌ t3.small (too big)
❌ t3.medium (too big)
❌ m5.large (wrong family)
❌ Any non-t2/t3 micro
```

---

## 6.3 Monitoring Free Tier Usage

### AWS Billing Dashboard

```
Check usage:
1. AWS Console → Billing
2. Free Tier usage → View details

Shows:
- Current month usage
- Percentage of limit used
- Forecasted usage
- Alerts when approaching limit

Example:
EC2: 350 / 750 hours (47%)
EBS: 15 / 30 GB (50%)
Data transfer: 25 / 100 GB (25%)
```

---

### Set Up Billing Alerts

```
Step 1: Enable billing alerts
1. Billing → Billing Preferences
2. ✅ Receive Free Tier Usage Alerts
3. Email: your@email.com

Step 2: Create CloudWatch alarm
1. CloudWatch → Billing → Create alarm
2. Threshold: $5
3. Email when exceeded

Step 3: Create budget
1. Billing → Budgets → Create budget
2. Monthly budget: $10
3. Alert at: 80% ($8)
```

---

## 6.4 Staying Within Free Tier

### ✅ DO: Use t3.micro only

```
# Check instance type before launching
Instance type: t3.micro ✅

Not:
Instance type: t3.small ❌ (costs money immediately)
```

---

### ✅ DO: Stop instances when not using

```
Development server:
- Start: 9 AM
- Stop: 6 PM
- Running: 9 hours/day

9 hours × 30 days = 270 hours/month
Well within 750 hours! ✅

Stopped instances don't count toward hours
(But EBS storage still counts toward 30 GB)
```

---

### ✅ DO: Use 1 instance initially

```
Learning/testing:
- 1 t3.micro running 24/7
- 744 hours/month
- Within free tier ✅

Later when needed:
- Add staging instance (stopped most of time)
- Add production instance
- Monitor total hours
```

---

### ❌ DON'T: Accidentally launch multiple instances

```
Common mistake:
Launch instance → Forget about it
Launch another → Forgot to terminate first
Now: 2 instances running!

2 × 744 hours = 1,488 hours
Over limit by: 738 hours
Cost: ~$7.68/month

Solution:
- Check EC2 dashboard regularly
- Terminate unused instances
- Name instances clearly
```

---

### ❌ DON'T: Upgrade instance type

```
Started with t3.micro (free tier)
App gets slower
Upgrade to t3.small

Problem:
- t3.small NOT in free tier
- Costs: ~$15/month

Better:
- Optimize application first
- Use caching
- Optimize database queries
- Only upgrade if really needed
```

---

### ❌ DON'T: Ignore storage limits

```
Free tier: 30 GB EBS

If you:
- 20 GB root volume
- 15 GB data volume
Total: 35 GB (over limit by 5 GB)

Cost: 5 GB × $0.10/GB = $0.50/month

Solution:
- Stay within 30 GB total
- Delete unused snapshots
- Use S3 for large files (5 GB free)
```

---

## 6.5 What Happens After Free Tier

### 12-Month Countdown

```
Free tier starts: Day you create AWS account
Free tier ends: Same day, 12 months later

Example:
Account created: January 15, 2024
Free tier ends: January 15, 2025

On January 16, 2025:
- t3.micro starts costing money
- Same usage patterns
- New monthly costs
```

---

### Expected Costs After Free Tier

```
Typical small project:

Before (free tier):
- 1 t3.micro instance: $0
- 20 GB EBS: $0
- Data transfer: $0
Total: $0/month

After (month 13+):
- 1 t3.micro: $7.59/month
- 20 GB EBS: $2.00/month
- Data transfer: $1-5/month
Total: ~$10-15/month

Still very affordable!
```

---

### Strategies After Free Tier

**Strategy 1: Continue paying**

```
If project is profitable or learning:
$10-15/month is reasonable
Continue with same setup
```

**Strategy 2: Optimize to reduce costs**

```
Options:
- Stop instance when not using (9 PM - 9 AM)
  → Save ~50% (744 → 360 hours)
  → Cost: ~$5/month

- Use Lightsail instead
  → $3.50/month for similar specs
  → Simpler billing

- Use reserved instances (1-year commit)
  → 30-40% discount
  → Good for production
```

**Strategy 3: Migrate to cheaper alternative**

```
Options:
- DigitalOcean Droplet: $4/month
- Linode: $5/month
- Vultr: $2.50/month
- Hetzner: €4.51/month

Trade-offs:
- Less features than AWS
- Different interface to learn
- May be sufficient for simple apps
```

**Strategy 4: Create new AWS account (Not recommended)**

```
⚠️ Against AWS ToS to create multiple accounts for free tier

AWS may:
- Detect and close accounts
- Charge back fees
- Ban from AWS

Only create new account if:
- Different business entity
- Different project ownership
- Legitimate business reason
```

---

# Part 7: Cost Optimization

## 7.1 Understanding EC2 Costs

### Cost Components

```
Total EC2 Cost =
  Instance cost
+ Storage cost (EBS)
+ Data transfer cost
+ Elastic IP cost (if unassociated)
+ Snapshot cost
+ Load Balancer cost (if used)
```

---

### Instance Cost Breakdown

```
t3.micro pricing (us-east-1):

On-Demand: $0.0104/hour
- No commitment
- Pay as you go
- Can stop anytime

Reserved (1-year, no upfront):
- $0.0062/hour
- 40% cheaper
- Must commit to 1 year

Spot Instance:
- $0.0031/hour (70% cheaper!)
- Can be terminated by AWS
- Good for batch processing
- Not for production web servers

Savings Plan:
- Commit to $/hour spend
- 1 or 3 years
- Flexible (can change instance types)
```

---

## 7.2 Cost Optimization Strategies

### Strategy 1: Right-sizing

```
Problem:
Running t3.medium ($30/month)
CPU usage: 10%
RAM usage: 20%

Solution:
Downgrade to t3.small ($15/month)
Still have headroom
Save: $15/month (50%)

How to check:
CloudWatch → Metrics → EC2 → Per-Instance Metrics
- CPUUtilization
- MemoryUtilization (need CloudWatch agent)

Rule:
If consistently below 40% → can downsize
If consistently above 80% → should upsize
```

---

### Strategy 2: Stop when not using

```
Development server:
Work hours: 9 AM - 6 PM (9 hours)
Not working: 6 PM - 9 AM (15 hours)

Weekends: 48 hours not working

Monthly running time:
(9 hours × 5 days × 4 weeks) + (24 hours × 4 weekends)
= 180 + 96 = 276 hours

vs 24/7: 744 hours

Savings: 63%!

Implementation:
- Manual: Stop in console
- Automated: Lambda function with scheduler
- Instance Scheduler (AWS solution)
```

---

### Strategy 3: Use Spot Instances

```
Perfect for:
✅ Batch processing
✅ Data analysis
✅ CI/CD runners
✅ Video encoding
✅ Development/testing

Not for:
❌ Production web servers
❌ Databases
❌ Real-time applications

Example:
Video processing pipeline:
On-Demand c5.xlarge: $0.17/hour
Spot c5.xlarge: $0.051/hour

Process 1000 hours of video:
On-Demand: $170
Spot: $51
Savings: $119 (70%!)

Risk: Job interrupted
Solution: Checkpoint progress, resume when spot available
```

---

### Strategy 4: Reserved Instances

```
When to buy:
- Stable, predictable workload
- Running 24/7
- 1-3 year commitment okay

Example:
Production t3.medium:

On-Demand: $30.37/month ($364/year)

1-Year Reserved: $18.25/month ($219/year)
Savings: $145/year (40%)

3-Year Reserved: $12.17/month ($146/year)
Savings: $218/year (60%)

Break-even: 7-8 months
If you know you'll run >8 months → buy Reserved
```

---

### Strategy 5: Savings Plans

```
More flexible than Reserved Instances:

Compute Savings Plan:
- Commit to $/hour (e.g., $10/hour)
- Applies to any instance type
- Can change instance family
- 1 or 3 years
- Up to 66% discount

Example:
Current: 3 × t3.medium = $30/hour × 744 hours = $22,320/year

Savings Plan: $10/hour commitment
Discount: 40%
New cost: $13,392/year
Savings: $8,928/year

Flexibility:
Can switch to 5 × t3.small if needed
Commitment stays $10/hour
```

---

### Strategy 6: Use Auto Scaling

```
Website traffic pattern:
Low (night): 100 users → 1 instance
Medium (day): 500 users → 2 instances
High (evening): 2000 users → 5 instances

Without auto scaling:
- Always run 5 instances (for peak)
- Cost: 5 × $30 × 24 hours = $3,600/month

With auto scaling:
- Scale based on demand
- Average: 2 instances
- Cost: 2 × $30 × 24 hours = $1,440/month
- Savings: $2,160/month (60%)!

Setup:
Auto Scaling Group
- Min: 1 instance
- Max: 5 instances
- Target: 70% CPU utilization
```

---

## 7.3 Cost Monitoring Tools

### AWS Cost Explorer

```
View costs:
1. Billing → Cost Explorer
2. Monthly costs graph
3. Filter by service (EC2)
4. Group by instance type

Shows:
- Historical spending
- Forecast next month
- Trends
- Anomalies
```

---

### AWS Budgets

```
Create budget:
1. Billing → Budgets → Create budget
2. Monthly budget: $50
3. Alert at: 80% ($40)
4. Email notification

Benefits:
✅ Proactive alerts
✅ Prevent bill shock
✅ Track spending trends
```

---

### Third-party Tools

```
CloudHealth (by VMware):
- Multi-cloud cost management
- Optimization recommendations
- Rightsizing suggestions

CloudCheckr:
- Cost optimization
- Security compliance
- Resource utilization

Native tools (free):
- AWS Cost Anomaly Detection
- AWS Trusted Advisor
- AWS Compute Optimizer
```

---

# Part 8: Best Practices Summary

## 8.1 Security Best Practices

```
✅ Security Groups:
- Least privilege (only open needed ports)
- Restrict SSH to your IP
- Use descriptive names and tags
- Regular audits

✅ SSH Keys:
- One key per person
- Protect private keys (chmod 400)
- Use passphrase
- Rotate regularly (every 90 days)
- Never commit to Git

✅ IAM:
- Use IAM roles (not root account)
- Enable MFA
- Principle of least privilege
- Regular access reviews

✅ Updates:
- Regular security patches
- Automated updates for critical patches
- Test in staging first
```

---

## 8.2 Cost Optimization Best Practices

```
✅ Right-sizing:
- Monitor CPU/RAM usage
- Downsize if underutilized
- Start small, scale up

✅ Stop unused instances:
- Development: stop after hours
- Testing: stop on weekends
- Use automation

✅ Use appropriate pricing:
- On-Demand: testing, variable workloads
- Reserved: production, 24/7 servers
- Spot: batch processing, fault-tolerant

✅ Monitor costs:
- Set up billing alerts
- Review monthly
- Use Cost Explorer
- Create budgets
```

---

## 8.3 High Availability Best Practices

```
✅ Multi-AZ deployment:
- Deploy in 2+ availability zones
- Use Load Balancer
- Automatic failover

✅ Backups:
- Regular snapshots
- Test restoration
- 3-2-1 rule (3 copies, 2 media, 1 offsite)

✅ Monitoring:
- CloudWatch alarms
- Health checks
- Log aggregation
- Alerting (PagerDuty, OpsGenie)

✅ Auto Scaling:
- Handle traffic spikes
- Replace unhealthy instances
- Cost optimization
```

---

## 8.4 Operations Best Practices

```
✅ Tagging:
- Name: prod-web-server-01
- Environment: production
- Owner: devops-team
- Cost-Center: engineering
- Backup: daily

✅ Documentation:
- Document architecture
- Runbooks for common tasks
- Disaster recovery procedures
- Contact information

✅ Change Management:
- Test in staging first
- Schedule maintenance windows
- Communicate changes
- Have rollback plan

✅ Automation:
- Infrastructure as Code (Terraform)
- Configuration Management (Ansible)
- CI/CD pipelines
- Automated backups
```

---

# Part 9: Quick Reference

## 9.1 Instance Type Cheat Sheet

```
┌──────────┬──────────────┬─────────────────────────┐
│ Family   │ Purpose      │ Use Cases               │
├──────────┼──────────────┼─────────────────────────┤
│ T        │ Burstable    │ Web, dev, small apps    │
│ M        │ General      │ App servers, backends   │
│ C        │ Compute      │ Encoding, batch jobs    │
│ R        │ Memory       │ Databases, caching      │
│ G        │ GPU          │ ML training, rendering  │
│ I        │ Storage      │ NoSQL, data warehouse   │
│ X        │ High memory  │ SAP HANA, big data      │
└──────────┴──────────────┴─────────────────────────┘
```

---

## 9.2 Common Ports

```
22   - SSH (server access)
80   - HTTP (web traffic)
443  - HTTPS (secure web)
3306 - MySQL
5432 - PostgreSQL
6379 - Redis
27017 - MongoDB
3000 - Node.js (common)
8080 - Tomcat/alternative HTTP
```

---

## 9.3 Useful Commands

```bash
# SSH to instance
ssh -i key.pem ubuntu@ip-address

# Copy file to instance
scp -i key.pem file.txt ubuntu@ip:~/

# Copy from instance
scp -i key.pem ubuntu@ip:~/file.txt ./

# Check instance metadata
curl http://169.254.169.254/latest/meta-data/

# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id

# AWS CLI: List instances
aws ec2 describe-instances

# AWS CLI: Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# AWS CLI: Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0
```

---

## 9.4 Troubleshooting Checklist

```
Can't SSH:
□ Security group allows port 22
□ Using correct key file
□ Using correct username (ubuntu/ec2-user)
□ Key permissions are 400
□ Instance is running
□ Using public IP (not private)

High costs:
□ Check running instances
□ Check unassociated Elastic IPs
□ Check EBS snapshots
□ Check data transfer
□ Review Cost Explorer

Slow performance:
□ Check CPU usage (CloudWatch)
□ Check memory usage
□ Check disk I/O
□ Check network bandwidth
□ Consider instance upgrade

Instance won't start:
□ Check service limits
□ Check instance state
□ Check AWS status page
□ Review system logs
□ Check root volume
```

---

# Conclusion

## What You've Learned

```
✅ EC2 Fundamentals:
   - What EC2 is and why it's useful
   - Regions and Availability Zones
   - AMIs and instance metadata

✅ Instance Types:
   - T (Burstable) - for variable workloads
   - M (General) - for balanced workloads
   - C (Compute) - for CPU-intensive tasks
   - R (Memory) - for RAM-intensive tasks
   - How to choose the right type

✅ Security Groups:
   - Inbound and outbound rules
   - How to configure firewall
   - Best practices for security

✅ SSH Key Pairs:
   - Public vs private keys
   - How to create and use
   - Security best practices

✅ Elastic IPs:
   - Static IP addresses
   - When to use (and not use)
   - Cost optimization

✅ Free Tier:
   - 750 hours/month limits
   - How to stay within limits
   - What happens after 12 months

✅ Cost Optimization:
   - Right-sizing instances
   - Stopping unused instances
   - Reserved instances and Spot
   - Monitoring costs
```

---

## Next Steps

**Practice:**

1. Launch your first EC2 instance (t3.micro)
2. Configure security group
3. SSH into instance
4. Install web server
5. Access from browser

**Learn More:**

- Load Balancing (distribute traffic)
- Auto Scaling (handle traffic spikes)
- CloudWatch (monitoring)
- VPC (networking)
- RDS (managed databases)

**Build Projects:**

- Deploy Node.js app
- Set up WordPress
- Create development environment
- Implement CI/CD pipeline

---

## Resources

**Official AWS:**

- EC2 User Guide: https://docs.aws.amazon.com/ec2/
- Free Tier: https://aws.amazon.com/free/
- Pricing Calculator: https://calculator.aws/

**Learning:**

- AWS Training: https://aws.amazon.com/training/
- AWS re:Invent Videos (YouTube)
- A Cloud Guru
- Linux Academy

**Community:**

- AWS Forums: https://forums.aws.amazon.com/
- Reddit: r/aws
- Stack Overflow: [amazon-ec2] tag

---

**Good luck with AWS EC2!** ☁️🚀
