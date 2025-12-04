# Tháng 8-9: AWS Cloud Platform

> **Prerequisites:** Hoàn thành Tháng 1-7 (Kubernetes, CI/CD, Monitoring)
> **Focus:** AWS services, cloud architecture, managed services
> **Main Tools:** AWS EC2, ECS, EKS, RDS, S3, VPC, IAM, CloudFormation

---

## Mục Tiêu Tháng 8-9

Sau 2 tháng này, bạn sẽ:
- [ ] Hiểu AWS core services
- [ ] Design cloud architecture
- [ ] Deploy applications trên AWS
- [ ] Manage AWS networking (VPC)
- [ ] Use managed services (RDS, ElastiCache)
- [ ] Implement security best practices
- [ ] Cost optimization strategies
- [ ] Deploy Kubernetes on EKS

---

# THÁNG 8

# Tuần 1: AWS Fundamentals & IAM

## Học - AWS Basics

### Cloud Computing Models
- [ ] IaaS (Infrastructure): EC2, VPC
- [ ] PaaS (Platform): Elastic Beanstalk, ECS
- [ ] SaaS (Software): Gmail, Salesforce
- [ ] AWS global infrastructure:
  - Regions: geographic locations
  - Availability Zones: isolated data centers
  - Edge Locations: CDN endpoints

### AWS Core Services
- [ ] **Compute:** EC2, Lambda, ECS, EKS
- [ ] **Storage:** S3, EBS, EFS
- [ ] **Database:** RDS, DynamoDB
- [ ] **Networking:** VPC, Route53, CloudFront
- [ ] **Security:** IAM, KMS, Secrets Manager

### AWS Pricing
- [ ] Pay-as-you-go
- [ ] Reserved Instances (1-3 year commitment)
- [ ] Spot Instances (unused capacity)
- [ ] Free Tier: 12 months free for many services

## Thực Hành - AWS Account Setup

### Create AWS Account
- [ ] Sign up: https://aws.amazon.com
- [ ] Verify email and phone
- [ ] Add payment method
- [ ] Choose support plan (Basic - free)
- [ ] Complete registration

### Enable MFA
- [ ] Navigate to IAM Dashboard
- [ ] Click username → Security credentials
- [ ] Assign MFA device:
  - Install Google Authenticator app
  - Scan QR code
  - Enter two consecutive codes
- [ ] Verify MFA working

### Install AWS CLI
- [ ] Install on macOS:
  ```bash
  brew install awscli
  aws --version
  ```

- [ ] Configure credentials:
  ```bash
  aws configure
  # AWS Access Key ID: YOUR_KEY
  # AWS Secret Access Key: YOUR_SECRET
  # Default region: us-east-1
  # Default output format: json
  ```

- [ ] Test connection:
  ```bash
  aws sts get-caller-identity
  ```

## Thực Hành - IAM (Identity and Access Management)

### IAM Concepts
- [ ] **Users:** individuals
- [ ] **Groups:** collections of users
- [ ] **Roles:** assumed by services/users
- [ ] **Policies:** JSON permissions documents

### Create IAM User
- [ ] Navigate to IAM → Users
- [ ] Click "Add users"
- [ ] Username: `devops-admin`
- [ ] Access type:
  - ✅ Programmatic access (Access Key)
  - ✅ AWS Management Console access
- [ ] Attach policies:
  - AdministratorAccess (for learning)
- [ ] Download credentials
- [ ] Save Access Key ID and Secret

### Create IAM Group
- [ ] Navigate to IAM → Groups
- [ ] Create group: `developers`
- [ ] Attach policies:
  - AmazonEC2FullAccess
  - AmazonS3FullAccess
  - AmazonRDSFullAccess
- [ ] Add users to group

### Create IAM Role
- [ ] Navigate to IAM → Roles
- [ ] Create role
- [ ] Trusted entity: AWS service → EC2
- [ ] Attach policies: AmazonS3ReadOnlyAccess
- [ ] Role name: `EC2-S3-ReadOnly`
- [ ] Create role

### IAM Policies
- [ ] View policy JSON:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        "Resource": [
          "arn:aws:s3:::my-bucket",
          "arn:aws:s3:::my-bucket/*"
        ]
      }
    ]
  }
  ```

- [ ] Create custom policy:
  - IAM → Policies → Create policy
  - JSON editor
  - Paste policy
  - Name: `S3-Read-Specific-Bucket`

### IAM Best Practices
- [ ] Enable MFA for root account
- [ ] Don't use root account for daily tasks
- [ ] Create individual IAM users
- [ ] Use groups to assign permissions
- [ ] Grant least privilege
- [ ] Use roles for applications
- [ ] Rotate credentials regularly
- [ ] Enable CloudTrail logging

## Thực Hành - AWS CLI Practice

### S3 Commands
- [ ] List buckets:
  ```bash
  aws s3 ls
  ```

- [ ] Create bucket:
  ```bash
  aws s3 mb s3://my-devops-bucket-123
  ```

- [ ] Upload file:
  ```bash
  echo "Hello AWS" > test.txt
  aws s3 cp test.txt s3://my-devops-bucket-123/
  ```

- [ ] List objects:
  ```bash
  aws s3 ls s3://my-devops-bucket-123/
  ```

### EC2 Commands
- [ ] List instances:
  ```bash
  aws ec2 describe-instances
  ```

- [ ] List AMIs:
  ```bash
  aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*"
  ```

### IAM Commands
- [ ] List users:
  ```bash
  aws iam list-users
  ```

- [ ] Get user details:
  ```bash
  aws iam get-user --user-name devops-admin
  ```

## Mini Project Week 1
- [ ] AWS account với MFA enabled
- [ ] IAM structure:
  - Multiple users
  - Groups với permissions
  - Roles for services
  - Custom policies
- [ ] AWS CLI configured
- [ ] Practice CLI commands:
  - S3 operations
  - EC2 queries
  - IAM management
- [ ] Document security best practices

---

# Tuần 2: EC2 & Compute Services

## Học - EC2 Basics

### EC2 (Elastic Compute Cloud)
- [ ] Virtual servers in cloud
- [ ] Instance types:
  - **General Purpose:** t2, t3 (burstable)
  - **Compute Optimized:** c5, c6 (CPU intensive)
  - **Memory Optimized:** r5, r6 (RAM intensive)
  - **Storage Optimized:** i3, d2 (high IOPS)
- [ ] Pricing models:
  - On-Demand: pay per hour
  - Reserved: 1-3 year commitment
  - Spot: bid on unused capacity
  - Savings Plans: flexible commitment

### AMI (Amazon Machine Images)
- [ ] Pre-configured OS templates
- [ ] AWS-provided AMIs
- [ ] Community AMIs
- [ ] Custom AMIs

### Security Groups
- [ ] Virtual firewalls
- [ ] Inbound rules
- [ ] Outbound rules
- [ ] Stateful (return traffic allowed)

## Thực Hành - Launch EC2 Instance

### Via Console
- [ ] Navigate to EC2 Dashboard
- [ ] Click "Launch Instance"
- [ ] **Name:** my-web-server
- [ ] **AMI:** Ubuntu Server 22.04 LTS
- [ ] **Instance type:** t2.micro (free tier)
- [ ] **Key pair:** Create new
  - Name: my-ec2-key
  - Download .pem file
  - Save to ~/.ssh/
  - `chmod 400 ~/.ssh/my-ec2-key.pem`
- [ ] **Network settings:**
  - Create security group
  - Allow SSH (22) from My IP
  - Allow HTTP (80) from Anywhere
  - Allow HTTPS (443) from Anywhere
- [ ] **Storage:** 8 GB gp3 (free tier)
- [ ] Click "Launch instance"

### Connect to Instance
- [ ] Get public IP from EC2 console
- [ ] SSH connection:
  ```bash
  ssh -i ~/.ssh/my-ec2-key.pem ubuntu@<PUBLIC_IP>
  ```

- [ ] Update system:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

### Deploy Application
- [ ] Install Docker:
  ```bash
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker ubuntu
  # Logout and login again
  ```

- [ ] Run container:
  ```bash
  docker run -d -p 80:80 nginx
  ```

- [ ] Test: Open http://<PUBLIC_IP> in browser

## Thực Hành - EC2 User Data (Automation)

### Launch with User Data
- [ ] User data script:
  ```bash
  #!/bin/bash
  apt update
  apt install -y docker.io
  systemctl start docker
  systemctl enable docker
  usermod -aG docker ubuntu
  
  # Pull and run application
  docker pull ghcr.io/username/myapp:latest
  docker run -d -p 80:3000 --name myapp --restart unless-stopped \
    ghcr.io/username/myapp:latest
  ```

- [ ] Launch instance with user data:
  ```bash
  aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t2.micro \
    --key-name my-ec2-key \
    --security-groups my-security-group \
    --user-data file://user-data.sh
  ```

## Thực Hành - Create Custom AMI

### Prepare Instance
- [ ] Launch and configure instance:
  - Install software
  - Configure settings
  - Deploy application
  - Test everything works

### Create AMI
- [ ] Via Console:
  - Select instance
  - Actions → Image and templates → Create image
  - Name: my-app-ami
  - Description: Web app with Docker
  - Click "Create image"

- [ ] Via CLI:
  ```bash
  aws ec2 create-image \
    --instance-id i-1234567890abcdef0 \
    --name "my-app-ami" \
    --description "Web app with Docker"
  ```

### Launch from Custom AMI
- [ ] Select your AMI
- [ ] Launch instance (much faster!)
- [ ] Application already configured

## Thực Hành - Elastic Load Balancer

### Create Target Group
- [ ] Navigate to EC2 → Target Groups
- [ ] Create target group:
  - Type: Instances
  - Name: my-app-targets
  - Protocol: HTTP
  - Port: 80
  - Health check path: /health
- [ ] Register instances

### Create Application Load Balancer
- [ ] Navigate to EC2 → Load Balancers
- [ ] Create load balancer → Application Load Balancer
- [ ] **Name:** my-app-lb
- [ ] **Scheme:** Internet-facing
- [ ] **IP address type:** IPv4
- [ ] **Network mapping:**
  - VPC: default
  - Select multiple availability zones
- [ ] **Security groups:**
  - Allow HTTP (80) from anywhere
  - Allow HTTPS (443) from anywhere
- [ ] **Listeners:**
  - HTTP:80 → my-app-targets
- [ ] Create load balancer

### Test Load Balancer
- [ ] Get DNS name from load balancer
- [ ] Open in browser
- [ ] Stop one instance, verify traffic redirects

## Thực Hành - Auto Scaling Group

### Create Launch Template
- [ ] Navigate to EC2 → Launch Templates
- [ ] Create launch template:
  - Name: my-app-template
  - AMI: my-app-ami
  - Instance type: t2.micro
  - Key pair: my-ec2-key
  - Security groups: my-sg
  - User data: (if needed)

### Create Auto Scaling Group
- [ ] Navigate to EC2 → Auto Scaling Groups
- [ ] Create Auto Scaling group:
  - Name: my-app-asg
  - Launch template: my-app-template
  - VPC and subnets: select multiple AZs
  - Load balancer: attach to my-app-lb
  - Health checks: ELB
  - Group size:
    - Desired: 2
    - Minimum: 1
    - Maximum: 4
  - Scaling policies:
    - Target tracking: Average CPU 50%
  - Create

### Test Auto Scaling
- [ ] Stress test instances:
  ```bash
  # Install stress tool
  sudo apt install stress
  
  # Generate CPU load
  stress --cpu 8 --timeout 600
  ```

- [ ] Watch ASG scale up
- [ ] Stop stress, watch scale down

## Mini Project Week 2
- [ ] Production-ready EC2 setup:
  - Custom AMI với application
  - Launch template
  - Auto Scaling Group (1-4 instances)
  - Application Load Balancer
  - Health checks configured
  - Auto scaling based on CPU
- [ ] Deploy application:
  - Automated via user data
  - Deployed from Docker image
  - Accessible via ALB DNS
- [ ] Test scenarios:
  - Traffic load testing
  - Auto scaling triggers
  - Instance failure recovery
  - Zero-downtime deployment

---

# Tuần 3: VPC & Networking

## Học - VPC (Virtual Private Cloud)

### VPC Components
- [ ] **Subnets:** IP address ranges
  - Public: internet accessible
  - Private: internal only
- [ ] **Internet Gateway:** connect to internet
- [ ] **NAT Gateway:** private subnet internet access
- [ ] **Route Tables:** traffic routing
- [ ] **Security Groups:** instance-level firewall
- [ ] **Network ACLs:** subnet-level firewall

### CIDR Notation
- [ ] 10.0.0.0/16: 65,536 IPs
- [ ] 10.0.1.0/24: 256 IPs
- [ ] 10.0.1.0/28: 16 IPs

### Best Practices
- [ ] Multiple AZs for high availability
- [ ] Public subnets for load balancers
- [ ] Private subnets for applications
- [ ] Isolated subnets for databases
- [ ] Use NAT Gateway for private instances

## Thực Hành - Create Custom VPC

### Create VPC
- [ ] Navigate to VPC Dashboard
- [ ] Create VPC:
  - Name: my-app-vpc
  - IPv4 CIDR: 10.0.0.0/16
  - Tenancy: Default
  - Enable DNS hostname: Yes

### Create Subnets
- [ ] **Public Subnet 1:**
  - Name: public-subnet-1a
  - VPC: my-app-vpc
  - AZ: us-east-1a
  - CIDR: 10.0.1.0/24
  - Auto-assign public IP: Yes

- [ ] **Public Subnet 2:**
  - Name: public-subnet-1b
  - AZ: us-east-1b
  - CIDR: 10.0.2.0/24

- [ ] **Private Subnet 1:**
  - Name: private-subnet-1a
  - AZ: us-east-1a
  - CIDR: 10.0.11.0/24
  - Auto-assign public IP: No

- [ ] **Private Subnet 2:**
  - Name: private-subnet-1b
  - AZ: us-east-1b
  - CIDR: 10.0.12.0/24

### Create Internet Gateway
- [ ] VPC → Internet Gateways
- [ ] Create internet gateway:
  - Name: my-app-igw
- [ ] Attach to VPC: my-app-vpc

### Create NAT Gateway
- [ ] VPC → NAT Gateways
- [ ] Create NAT gateway:
  - Name: my-app-nat
  - Subnet: public-subnet-1a
  - Allocate Elastic IP

### Configure Route Tables
- [ ] **Public Route Table:**
  - Create route table: public-rt
  - Add route: 0.0.0.0/0 → Internet Gateway
  - Associate: public-subnet-1a, public-subnet-1b

- [ ] **Private Route Table:**
  - Create route table: private-rt
  - Add route: 0.0.0.0/0 → NAT Gateway
  - Associate: private-subnet-1a, private-subnet-1b

## Thực Hành - Security Groups & NACLs

### Create Security Groups
- [ ] **ALB Security Group:**
  - Name: alb-sg
  - Inbound:
    - HTTP (80) from 0.0.0.0/0
    - HTTPS (443) from 0.0.0.0/0
  - Outbound: All traffic

- [ ] **App Security Group:**
  - Name: app-sg
  - Inbound:
    - HTTP (3000) from alb-sg
    - SSH (22) from bastion-sg
  - Outbound: All traffic

- [ ] **DB Security Group:**
  - Name: db-sg
  - Inbound:
    - PostgreSQL (5432) from app-sg
  - Outbound: None

### Network ACLs (Optional)
- [ ] Create NACL for public subnets:
  - Allow inbound HTTP/HTTPS
  - Allow outbound ephemeral ports
- [ ] Create NACL for private subnets:
  - More restrictive rules

## Thực Hành - Bastion Host

### Launch Bastion
- [ ] Launch EC2 instance:
  - Name: bastion
  - Subnet: public-subnet-1a
  - Security group: bastion-sg
    - Allow SSH (22) from My IP
  - Assign Elastic IP

### SSH Jump
- [ ] SSH to private instance via bastion:
  ```bash
  # Add key to SSH agent
  ssh-add ~/.ssh/my-ec2-key.pem
  
  # SSH with agent forwarding
  ssh -A ubuntu@<BASTION_IP>
  
  # From bastion, SSH to private instance
  ssh ubuntu@<PRIVATE_IP>
  ```

- [ ] ProxyJump (easier):
  ```bash
  # ~/.ssh/config
  Host bastion
    HostName <BASTION_IP>
    User ubuntu
    IdentityFile ~/.ssh/my-ec2-key.pem
  
  Host private-*
    User ubuntu
    ProxyJump bastion
    IdentityFile ~/.ssh/my-ec2-key.pem
  
  # SSH directly
  ssh private-10-0-11-100
  ```

## Thực Hành - VPC Peering (Optional)

### Create Second VPC
- [ ] Create vpc-2: 172.16.0.0/16
- [ ] Create subnets
- [ ] Configure route tables

### Peer VPCs
- [ ] VPC → Peering Connections
- [ ] Create peering connection:
  - Name: vpc1-to-vpc2
  - VPC Requester: my-app-vpc
  - VPC Accepter: vpc-2
- [ ] Accept peering connection

### Update Route Tables
- [ ] In VPC-1 route table:
  - Add: 172.16.0.0/16 → peering connection
- [ ] In VPC-2 route table:
  - Add: 10.0.0.0/16 → peering connection

## Mini Project Week 3
- [ ] Complete network architecture:
  - Custom VPC với CIDR planning
  - Public subnets (2 AZs)
  - Private subnets (2 AZs)
  - Internet Gateway
  - NAT Gateway
  - Route tables configured
- [ ] Security:
  - Security groups với least privilege
  - Bastion host for SSH access
  - Network ACLs (optional)
- [ ] Deploy application:
  - ALB in public subnets
  - EC2 instances in private subnets
  - RDS in isolated subnets (preview)
- [ ] Test connectivity:
  - Internet → ALB → App
  - App → NAT → Internet
  - Bastion → App (SSH)

---

# Tuần 4: RDS & Storage Services

## Học - Storage Services

### S3 (Simple Storage Service)
- [ ] Object storage
- [ ] Unlimited storage
- [ ] 99.999999999% durability
- [ ] Storage classes:
  - Standard: frequent access
  - IA: infrequent access
  - Glacier: archival
- [ ] Use cases: backups, static websites, data lakes

### EBS (Elastic Block Store)
- [ ] Block storage for EC2
- [ ] Persistent storage
- [ ] Types: gp3, io2, st1, sc1
- [ ] Snapshots for backup

### EFS (Elastic File System)
- [ ] Network file system (NFS)
- [ ] Shared storage
- [ ] Automatic scaling
- [ ] Use case: shared application files

## Thực Hành - S3

### Create Bucket
- [ ] S3 Dashboard → Create bucket
- [ ] **Name:** my-app-assets-123 (globally unique)
- [ ] **Region:** us-east-1
- [ ] **Block Public Access:** Uncheck (for static website)
- [ ] **Versioning:** Enable
- [ ] **Encryption:** Enable
- [ ] Create bucket

### Upload Files
- [ ] Via Console: drag and drop
- [ ] Via CLI:
  ```bash
  aws s3 cp index.html s3://my-app-assets-123/
  aws s3 sync ./dist s3://my-app-assets-123/
  ```

### Configure Static Website
- [ ] Bucket → Properties → Static website hosting
- [ ] Enable
- [ ] Index document: index.html
- [ ] Error document: error.html
- [ ] Save

### Bucket Policy (Public Read)
- [ ] Bucket → Permissions → Bucket Policy:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::my-app-assets-123/*"
      }
    ]
  }
  ```

### Lifecycle Policies
- [ ] Bucket → Management → Lifecycle rules
- [ ] Create rule:
  - Transition to IA after 30 days
  - Transition to Glacier after 90 days
  - Expire after 365 days

## Học - RDS (Relational Database Service)

### RDS Features
- [ ] Managed database service
- [ ] Automated backups
- [ ] Automated patching
- [ ] Multi-AZ for high availability
- [ ] Read replicas for scaling

### Supported Engines
- [ ] MySQL
- [ ] PostgreSQL
- [ ] MariaDB
- [ ] Oracle
- [ ] SQL Server
- [ ] Amazon Aurora

## Thực Hành - Launch RDS Instance

### Create DB Subnet Group
- [ ] RDS → Subnet groups
- [ ] Create subnet group:
  - Name: my-db-subnet-group
  - VPC: my-app-vpc
  - Add subnets: private-subnet-1a, private-subnet-1b

### Create Security Group
- [ ] EC2 → Security Groups
- [ ] Create: db-sg
- [ ] Inbound: PostgreSQL (5432) from app-sg

### Launch RDS Instance
- [ ] RDS → Databases → Create database
- [ ] **Engine:** PostgreSQL
- [ ] **Version:** Latest
- [ ] **Templates:** Free tier
- [ ] **DB instance identifier:** myapp-db
- [ ] **Master username:** postgres
- [ ] **Master password:** (set secure password)
- [ ] **Instance class:** db.t3.micro
- [ ] **Storage:** 20 GB gp3
- [ ] **VPC:** my-app-vpc
- [ ] **Subnet group:** my-db-subnet-group
- [ ] **Public access:** No
- [ ] **Security group:** db-sg
- [ ] **Database name:** myappdb
- [ ] **Backup retention:** 7 days
- [ ] **Multi-AZ:** No (for free tier)
- [ ] Create database

### Connect to RDS
- [ ] Get endpoint from RDS console
- [ ] From EC2 instance in private subnet:
  ```bash
  sudo apt install postgresql-client
  
  psql -h myapp-db.xxxx.us-east-1.rds.amazonaws.com \
       -U postgres \
       -d myappdb
  ```

- [ ] From application:
  ```javascript
  const { Pool } = require('pg');
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    database: 'myappdb',
    user: 'postgres',
    password: process.env.DB_PASSWORD
  });
  ```

## Thực Hành - RDS Backups & Snapshots

### Automated Backups
- [ ] RDS automatically backs up daily
- [ ] Retention: 1-35 days
- [ ] Point-in-time recovery
- [ ] View: RDS → Automated backups

### Manual Snapshots
- [ ] Select database
- [ ] Actions → Take snapshot
- [ ] Name: myapp-db-snapshot-2024-12
- [ ] Create snapshot

### Restore from Snapshot
- [ ] Snapshots → Select snapshot
- [ ] Actions → Restore snapshot
- [ ] Configure new instance
- [ ] Restore

## Thực Hành - ElastiCache (Redis)

### Launch Redis Cluster
- [ ] ElastiCache → Redis clusters
- [ ] Create cluster:
  - Name: myapp-cache
  - Engine: Redis
  - Node type: cache.t3.micro
  - Number of replicas: 0 (for testing)
  - VPC: my-app-vpc
  - Subnet group: create new
  - Security group: cache-sg (allow 6379 from app-sg)

### Connect from Application
- [ ] Get endpoint from ElastiCache console
- [ ] Use in Node.js:
  ```javascript
  const redis = require('redis');
  
  const client = redis.createClient({
    host: 'myapp-cache.xxxx.cache.amazonaws.com',
    port: 6379
  });
  
  client.on('connect', () => {
    console.log('Redis connected');
  });
  ```

## Mini Project Week 4
- [ ] Complete three-tier architecture:
  - **Frontend:** S3 static website + CloudFront
  - **Backend:** EC2 in private subnets + ALB
  - **Database:** RDS PostgreSQL in isolated subnets
  - **Cache:** ElastiCache Redis
- [ ] Storage setup:
  - S3 bucket for static assets
  - S3 bucket for backups
  - Lifecycle policies configured
- [ ] Database:
  - RDS with automated backups
  - Read replica (optional)
  - Connection from application
- [ ] Security:
  - Proper security groups
  - No public database access
  - Encrypted storage
- [ ] Test full application flow

---

# THÁNG 9

# Tuần 1: EKS (Elastic Kubernetes Service)

## Học - EKS Basics

### What is EKS?
- [ ] Managed Kubernetes service
- [ ] AWS handles control plane
- [ ] You manage worker nodes
- [ ] Integrates with AWS services

### EKS Components
- [ ] Control Plane: managed by AWS
- [ ] Worker Nodes: EC2 instances
- [ ] Fargate: serverless compute
- [ ] VPC networking
- [ ] IAM authentication

### EKS Benefits
- [ ] Fully managed K8s
- [ ] High availability
- [ ] Security patching
- [ ] AWS integrations
- [ ] Scalability

## Thực Hành - Install Tools

### eksctl
- [ ] Install:
  ```bash
  brew install eksctl
  eksctl version
  ```

### kubectl
- [ ] Already installed from Month 4-5
- [ ] Update if needed:
  ```bash
  brew upgrade kubectl
  ```

### AWS IAM Authenticator
- [ ] Install:
  ```bash
  brew install aws-iam-authenticator
  aws-iam-authenticator version
  ```

## Thực Hành - Create EKS Cluster

### Using eksctl (Easiest)
- [ ] Create cluster:
  ```bash
  eksctl create cluster \
    --name my-eks-cluster \
    --region us-east-1 \
    --nodegroup-name my-nodes \
    --node-type t3.medium \
    --nodes 2 \
    --nodes-min 1 \
    --nodes-max 4 \
    --managed
  ```

- [ ] This creates:
  - EKS cluster
  - VPC with subnets
  - Security groups
  - IAM roles
  - Node group (2 nodes)

- [ ] Wait 15-20 minutes for completion

### Verify Cluster
- [ ] Check cluster:
  ```bash
  eksctl get cluster
  kubectl get nodes
  kubectl get pods --all-namespaces
  ```

- [ ] View kubeconfig:
  ```bash
  cat ~/.kube/config
  ```

## Thực Hành - Deploy Application to EKS

### Simple Deployment
- [ ] Create deployment:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: nginx
    template:
      metadata:
        labels:
          app: nginx
      spec:
        containers:
        - name: nginx
          image: nginx:latest
          ports:
          - containerPort: 80
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: nginx
  spec:
    type: LoadBalancer
    selector:
      app: nginx
    ports:
    - port: 80
      targetPort: 80
  ```

- [ ] Apply:
  ```bash
  kubectl apply -f nginx-deployment.yaml
  kubectl get svc nginx --watch
  ```

- [ ] Get LoadBalancer URL:
  ```bash
  kubectl get svc nginx
  # Wait for EXTERNAL-IP
  curl http://<EXTERNAL-IP>
  ```

### Deploy Full Application
- [ ] Use Helm chart from Month 5
- [ ] Deploy:
  ```bash
  helm install myapp ./charts/myapp \
    --set service.type=LoadBalancer
  ```

## Thực Hành - EKS Networking

### AWS Load Balancer Controller
- [ ] Install:
  ```bash
  helm repo add eks https://aws.github.io/eks-charts
  helm repo update
  
  helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
    -n kube-system \
    --set clusterName=my-eks-cluster \
    --set serviceAccount.create=false \
    --set serviceAccount.name=aws-load-balancer-controller
  ```

### Ingress with ALB
- [ ] Create Ingress:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myapp-ingress
    annotations:
      kubernetes.io/ingress.class: alb
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/target-type: ip
  spec:
    rules:
    - http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: myapp
              port:
                number: 80
  ```

- [ ] Apply and get ALB URL:
  ```bash
  kubectl apply -f ingress.yaml
  kubectl get ingress myapp-ingress
  ```

## Thực Hành - EBS CSI Driver (Storage)

### Install EBS CSI Driver
- [ ] Create IAM role
- [ ] Install driver:
  ```bash
  kubectl apply -k "github.com/kubernetes-sigs/aws-ebs-csi-driver/deploy/kubernetes/overlays/stable/?ref=release-1.20"
  ```

### Use EBS Volumes
- [ ] Create StorageClass:
  ```yaml
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: ebs-sc
  provisioner: ebs.csi.aws.com
  volumeBindingMode: WaitForFirstConsumer
  parameters:
    type: gp3
  ```

- [ ] Create PVC:
  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: ebs-claim
  spec:
    accessModes:
      - ReadWriteOnce
    storageClassName: ebs-sc
    resources:
      requests:
        storage: 10Gi
  ```

## Mini Project Week 1
- [ ] EKS cluster running
- [ ] Application deployed:
  - Multiple replicas
  - LoadBalancer service
  - Ingress with ALB
  - Persistent storage với EBS
- [ ] Monitoring:
  - CloudWatch Container Insights
  - Kubectl top nodes/pods
- [ ] Cost tracking:
  - Check AWS Cost Explorer
  - Identify expensive resources

---

# Tuần 2-4: Continued in next section...

(Due to length, I'll create a summary for weeks 2-4)

## Week 2: CloudFormation & Infrastructure as Code
- [ ] Learn CloudFormation basics
- [ ] Create stacks for VPC, EC2, RDS
- [ ] Nested stacks
- [ ] Change sets

## Week 3: CI/CD Integration with AWS
- [ ] GitHub Actions to EKS
- [ ] ECR for Docker images
- [ ] CodePipeline (optional)
- [ ] Automated deployments

## Week 4: Cost Optimization & Best Practices
- [ ] Cost Explorer
- [ ] Reserved Instances
- [ ] Spot Instances
- [ ] Auto Scaling
- [ ] Tagging strategy
- [ ] AWS Well-Architected Framework

---

# CAPSTONE PROJECT: Production AWS Infrastructure

## Requirements
- [ ] Multi-tier VPC architecture
- [ ] EKS cluster with managed nodes
- [ ] RDS Multi-AZ database
- [ ] ElastiCache cluster
- [ ] S3 for static assets
- [ ] CloudFront CDN
- [ ] Application Load Balancer
- [ ] Auto Scaling Groups
- [ ] CloudWatch monitoring
- [ ] AWS Backup configured
- [ ] Cost optimized
- [ ] Security best practices
- [ ] Infrastructure as Code (CloudFormation)
- [ ] CI/CD pipeline to AWS

---

# Self-Assessment

After Month 8-9, you should:
- [ ] Understand AWS core services
- [ ] Design VPC networks
- [ ] Deploy applications on EC2/EKS
- [ ] Use managed databases (RDS)
- [ ] Implement security (IAM, Security Groups)
- [ ] Cost optimization strategies
- [ ] Infrastructure as Code basics

---

# Resources
- [ ] AWS Documentation
- [ ] AWS Well-Architected Framework
- [ ] AWS Skill Builder (free courses)
- [ ] A Cloud Guru / Linux Academy

---

**You're cloud-ready! ☁️**
