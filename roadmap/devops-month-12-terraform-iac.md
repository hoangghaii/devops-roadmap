# Tháng 12: Terraform & Infrastructure as Code

> **Prerequisites:** Hoàn thành Tháng 1-11 (All DevOps fundamentals)
> **Focus:** Infrastructure as Code, Terraform, Automation, Best Practices
> **Main Tools:** Terraform, Ansible, Terragrunt, Atlantis

---

## Mục Tiêu Tháng 12

Sau tháng này, bạn sẽ:
- [ ] Master Terraform fundamentals
- [ ] Provision infrastructure với code
- [ ] Manage multiple environments
- [ ] Team collaboration với IaC
- [ ] Implement CI/CD for infrastructure
- [ ] Ansible for configuration management
- [ ] Testing infrastructure code
- [ ] Best practices và patterns

---

# Tuần 1: Terraform Fundamentals

## Học - Infrastructure as Code

### What is IaC?
- [ ] Infrastructure defined as code
- [ ] Version controlled
- [ ] Repeatable and consistent
- [ ] Automated provisioning
- [ ] Self-documenting

### IaC Benefits
- [ ] **Speed:** automate provisioning
- [ ] **Consistency:** eliminate drift
- [ ] **Reusability:** DRY principle
- [ ] **Collaboration:** code reviews
- [ ] **Disaster Recovery:** rebuild quickly

### IaC Tools
- [ ] **Terraform:** multi-cloud, declarative
- [ ] **CloudFormation:** AWS only
- [ ] **Pulumi:** general-purpose programming languages
- [ ] **Ansible:** configuration management + provisioning

## Thực Hành - Install Terraform

### Install on macOS
- [ ] Install via Homebrew:
  ```bash
  brew tap hashicorp/tap
  brew install hashicorp/tap/terraform
  terraform version
  ```

- [ ] Enable tab completion:
  ```bash
  terraform -install-autocomplete
  ```

### Basic Terraform Workflow
- [ ] **Write:** define resources
- [ ] **Init:** initialize providers
- [ ] **Plan:** preview changes
- [ ] **Apply:** create resources
- [ ] **Destroy:** tear down

## Thực Hành - First Terraform Configuration

### Create AWS Resources
- [ ] Create `main.tf`:
  ```hcl
  # Provider configuration
  terraform {
    required_providers {
      aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
      }
    }
    required_version = ">= 1.6"
  }
  
  provider "aws" {
    region = "us-east-1"
  }
  
  # VPC
  resource "aws_vpc" "main" {
    cidr_block           = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support   = true
    
    tags = {
      Name = "my-vpc"
      Environment = "dev"
    }
  }
  
  # Subnet
  resource "aws_subnet" "public" {
    vpc_id                  = aws_vpc.main.id
    cidr_block              = "10.0.1.0/24"
    availability_zone       = "us-east-1a"
    map_public_ip_on_launch = true
    
    tags = {
      Name = "public-subnet"
    }
  }
  
  # Internet Gateway
  resource "aws_internet_gateway" "main" {
    vpc_id = aws_vpc.main.id
    
    tags = {
      Name = "main-igw"
    }
  }
  ```

### Terraform Commands
- [ ] Initialize:
  ```bash
  terraform init
  ```

- [ ] Format code:
  ```bash
  terraform fmt
  ```

- [ ] Validate configuration:
  ```bash
  terraform validate
  ```

- [ ] Plan changes:
  ```bash
  terraform plan
  ```

- [ ] Apply changes:
  ```bash
  terraform apply
  ```

- [ ] Show current state:
  ```bash
  terraform show
  ```

- [ ] Destroy resources:
  ```bash
  terraform destroy
  ```

## Học - HCL (HashiCorp Configuration Language)

### Basic Syntax
- [ ] Blocks:
  ```hcl
  resource "aws_instance" "example" {
    ami           = "ami-123456"
    instance_type = "t2.micro"
  }
  ```

- [ ] Arguments:
  ```hcl
  name = "my-instance"
  count = 3
  ```

- [ ] Expressions:
  ```hcl
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "example"
  }
  ```

### Data Types
- [ ] **String:** `"hello"`
- [ ] **Number:** `42`, `3.14`
- [ ] **Bool:** `true`, `false`
- [ ] **List:** `["a", "b", "c"]`
- [ ] **Map:** `{key = "value"}`
- [ ] **Object:** complex structures

## Thực Hành - Variables & Outputs

### Define Variables
- [ ] Create `variables.tf`:
  ```hcl
  variable "region" {
    description = "AWS region"
    type        = string
    default     = "us-east-1"
  }
  
  variable "vpc_cidr" {
    description = "VPC CIDR block"
    type        = string
    default     = "10.0.0.0/16"
  }
  
  variable "environment" {
    description = "Environment name"
    type        = string
    validation {
      condition     = contains(["dev", "staging", "prod"], var.environment)
      error_message = "Environment must be dev, staging, or prod."
    }
  }
  
  variable "instance_count" {
    description = "Number of instances"
    type        = number
    default     = 2
  }
  ```

### Use Variables
- [ ] Reference in `main.tf`:
  ```hcl
  provider "aws" {
    region = var.region
  }
  
  resource "aws_vpc" "main" {
    cidr_block = var.vpc_cidr
    
    tags = {
      Environment = var.environment
    }
  }
  ```

### Variable Files
- [ ] Create `terraform.tfvars`:
  ```hcl
  region      = "us-west-2"
  vpc_cidr    = "172.16.0.0/16"
  environment = "production"
  ```

- [ ] Environment-specific:
  ```bash
  # dev.tfvars
  environment = "dev"
  instance_count = 1
  
  # prod.tfvars
  environment = "prod"
  instance_count = 3
  ```

- [ ] Use specific vars file:
  ```bash
  terraform apply -var-file="prod.tfvars"
  ```

### Define Outputs
- [ ] Create `outputs.tf`:
  ```hcl
  output "vpc_id" {
    description = "VPC ID"
    value       = aws_vpc.main.id
  }
  
  output "public_subnet_id" {
    description = "Public subnet ID"
    value       = aws_subnet.public.id
  }
  
  output "vpc_cidr" {
    description = "VPC CIDR block"
    value       = aws_vpc.main.cidr_block
  }
  ```

- [ ] View outputs:
  ```bash
  terraform output
  terraform output vpc_id
  terraform output -json
  ```

## Thực Hành - Data Sources

### Query Existing Resources
- [ ] Get latest AMI:
  ```hcl
  data "aws_ami" "ubuntu" {
    most_recent = true
    owners      = ["099720109477"] # Canonical
    
    filter {
      name   = "name"
      values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
    }
  }
  
  resource "aws_instance" "web" {
    ami           = data.aws_ami.ubuntu.id
    instance_type = "t2.micro"
  }
  ```

- [ ] Get availability zones:
  ```hcl
  data "aws_availability_zones" "available" {
    state = "available"
  }
  
  resource "aws_subnet" "example" {
    count             = 2
    availability_zone = data.aws_availability_zones.available.names[count.index]
    # ...
  }
  ```

## Mini Project Week 1
- [ ] Terraform project structure:
  ```
  terraform-project/
  ├── main.tf           # Main resources
  ├── variables.tf      # Input variables
  ├── outputs.tf        # Output values
  ├── terraform.tfvars  # Variable values
  ├── dev.tfvars        # Dev environment
  ├── prod.tfvars       # Prod environment
  └── README.md         # Documentation
  ```

- [ ] AWS infrastructure:
  - VPC with public/private subnets
  - Internet Gateway
  - NAT Gateway
  - Route tables
  - Security groups
  - EC2 instances
  - RDS database

- [ ] Variables:
  - Environment name
  - Region
  - CIDR blocks
  - Instance counts
  - Instance types

- [ ] Outputs:
  - VPC ID
  - Subnet IDs
  - Instance IPs
  - Database endpoint

- [ ] Test:
  - Plan for dev
  - Apply for dev
  - Plan for prod
  - Apply for prod

---

# Tuần 2: State Management & Modules

## Học - Terraform State

### What is State?
- [ ] Tracks real-world resources
- [ ] Maps configuration to reality
- [ ] Metadata and dependencies
- [ ] Performance optimization

### State File (`terraform.tfstate`)
- [ ] JSON format
- [ ] Contains sensitive data
- [ ] Must be protected
- [ ] Enables collaboration

### Local vs Remote State
- [ ] **Local:** file on disk (not for teams)
- [ ] **Remote:** S3, Terraform Cloud (for teams)

## Thực Hành - Remote State with S3

### Create S3 Backend
- [ ] Create S3 bucket and DynamoDB table:
  ```hcl
  # backend-setup.tf (run once)
  resource "aws_s3_bucket" "terraform_state" {
    bucket = "my-terraform-state-bucket"
    
    lifecycle {
      prevent_destroy = true
    }
  }
  
  resource "aws_s3_bucket_versioning" "terraform_state" {
    bucket = aws_s3_bucket.terraform_state.id
    
    versioning_configuration {
      status = "Enabled"
    }
  }
  
  resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
    bucket = aws_s3_bucket.terraform_state.id
    
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  resource "aws_dynamodb_table" "terraform_locks" {
    name         = "terraform-locks"
    billing_mode = "PAY_PER_REQUEST"
    hash_key     = "LockID"
    
    attribute {
      name = "LockID"
      type = "S"
    }
  }
  ```

### Configure Backend
- [ ] Add to `main.tf`:
  ```hcl
  terraform {
    backend "s3" {
      bucket         = "my-terraform-state-bucket"
      key            = "dev/terraform.tfstate"
      region         = "us-east-1"
      encrypt        = true
      dynamodb_table = "terraform-locks"
    }
  }
  ```

- [ ] Initialize with backend:
  ```bash
  terraform init -backend-config="key=dev/terraform.tfstate"
  ```

### State Commands
- [ ] List resources:
  ```bash
  terraform state list
  ```

- [ ] Show resource:
  ```bash
  terraform state show aws_vpc.main
  ```

- [ ] Move resource:
  ```bash
  terraform state mv aws_instance.old aws_instance.new
  ```

- [ ] Remove resource:
  ```bash
  terraform state rm aws_instance.example
  ```

- [ ] Pull state:
  ```bash
  terraform state pull
  ```

## Học - Terraform Modules

### What are Modules?
- [ ] Reusable Terraform configurations
- [ ] Encapsulation
- [ ] Abstraction
- [ ] DRY principle

### Module Structure
```
module/
├── main.tf           # Resources
├── variables.tf      # Input variables
├── outputs.tf        # Output values
└── README.md         # Documentation
```

## Thực Hành - Create Module

### VPC Module
- [ ] Create `modules/vpc/main.tf`:
  ```hcl
  resource "aws_vpc" "this" {
    cidr_block           = var.vpc_cidr
    enable_dns_hostnames = true
    enable_dns_support   = true
    
    tags = merge(
      var.tags,
      {
        Name = var.name
      }
    )
  }
  
  resource "aws_subnet" "public" {
    count                   = length(var.public_subnets)
    vpc_id                  = aws_vpc.this.id
    cidr_block              = var.public_subnets[count.index]
    availability_zone       = var.azs[count.index]
    map_public_ip_on_launch = true
    
    tags = merge(
      var.tags,
      {
        Name = "${var.name}-public-${count.index + 1}"
      }
    )
  }
  
  resource "aws_subnet" "private" {
    count             = length(var.private_subnets)
    vpc_id            = aws_vpc.this.id
    cidr_block        = var.private_subnets[count.index]
    availability_zone = var.azs[count.index]
    
    tags = merge(
      var.tags,
      {
        Name = "${var.name}-private-${count.index + 1}"
      }
    )
  }
  
  resource "aws_internet_gateway" "this" {
    vpc_id = aws_vpc.this.id
    
    tags = merge(
      var.tags,
      {
        Name = var.name
      }
    )
  }
  ```

- [ ] Create `modules/vpc/variables.tf`:
  ```hcl
  variable "name" {
    description = "VPC name"
    type        = string
  }
  
  variable "vpc_cidr" {
    description = "VPC CIDR block"
    type        = string
  }
  
  variable "azs" {
    description = "Availability zones"
    type        = list(string)
  }
  
  variable "public_subnets" {
    description = "Public subnet CIDR blocks"
    type        = list(string)
  }
  
  variable "private_subnets" {
    description = "Private subnet CIDR blocks"
    type        = list(string)
  }
  
  variable "tags" {
    description = "Tags to apply to resources"
    type        = map(string)
    default     = {}
  }
  ```

- [ ] Create `modules/vpc/outputs.tf`:
  ```hcl
  output "vpc_id" {
    description = "VPC ID"
    value       = aws_vpc.this.id
  }
  
  output "public_subnet_ids" {
    description = "Public subnet IDs"
    value       = aws_subnet.public[*].id
  }
  
  output "private_subnet_ids" {
    description = "Private subnet IDs"
    value       = aws_subnet.private[*].id
  }
  ```

### Use Module
- [ ] In root `main.tf`:
  ```hcl
  module "vpc" {
    source = "./modules/vpc"
    
    name            = "my-vpc"
    vpc_cidr        = "10.0.0.0/16"
    azs             = ["us-east-1a", "us-east-1b"]
    public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
    private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]
    
    tags = {
      Environment = "dev"
      Project     = "myapp"
    }
  }
  
  # Reference module outputs
  output "vpc_id" {
    value = module.vpc.vpc_id
  }
  ```

### Public Modules
- [ ] Use Terraform Registry:
  ```hcl
  module "vpc" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "5.1.2"
    
    name = "my-vpc"
    cidr = "10.0.0.0/16"
    
    azs             = ["us-east-1a", "us-east-1b"]
    private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
    public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
    
    enable_nat_gateway = true
  }
  ```

## Thực Hành - Workspaces

### What are Workspaces?
- [ ] Separate state files
- [ ] Same configuration, different environments
- [ ] Alternative to separate directories

### Workspace Commands
- [ ] List workspaces:
  ```bash
  terraform workspace list
  ```

- [ ] Create workspace:
  ```bash
  terraform workspace new dev
  terraform workspace new staging
  terraform workspace new prod
  ```

- [ ] Switch workspace:
  ```bash
  terraform workspace select dev
  ```

- [ ] Show current:
  ```bash
  terraform workspace show
  ```

### Use in Configuration
- [ ] Reference workspace:
  ```hcl
  resource "aws_instance" "web" {
    ami           = data.aws_ami.ubuntu.id
    instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"
    
    tags = {
      Name        = "web-${terraform.workspace}"
      Environment = terraform.workspace
    }
  }
  ```

## Mini Project Week 2
- [ ] Modular infrastructure:
  - VPC module
  - Security group module
  - EC2 module
  - RDS module
  - All modules reusable

- [ ] Remote state:
  - S3 backend configured
  - State locking with DynamoDB
  - Versioning enabled
  - Encryption enabled

- [ ] Multiple environments:
  - Dev workspace
  - Staging workspace
  - Prod workspace
  - Environment-specific variables

- [ ] Project structure:
  ```
  terraform-project/
  ├── modules/
  │   ├── vpc/
  │   ├── security-group/
  │   ├── ec2/
  │   └── rds/
  ├── environments/
  │   ├── dev/
  │   ├── staging/
  │   └── prod/
  ├── main.tf
  ├── variables.tf
  └── outputs.tf
  ```

---

# Tuần 3: Advanced Terraform & CI/CD

## Học - Advanced Features

### Dynamic Blocks
- [ ] Generate repeated nested blocks:
  ```hcl
  resource "aws_security_group" "example" {
    name = "example"
    
    dynamic "ingress" {
      for_each = var.ingress_rules
      content {
        from_port   = ingress.value.from_port
        to_port     = ingress.value.to_port
        protocol    = ingress.value.protocol
        cidr_blocks = ingress.value.cidr_blocks
      }
    }
  }
  
  # variables.tf
  variable "ingress_rules" {
    type = list(object({
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_blocks = list(string)
    }))
  }
  ```

### For Expressions
- [ ] Transform lists/maps:
  ```hcl
  locals {
    subnet_ids = [for s in aws_subnet.private : s.id]
    
    instance_ips = {
      for instance in aws_instance.web :
      instance.tags.Name => instance.private_ip
    }
  }
  ```

### Conditional Expressions
- [ ] Ternary operator:
  ```hcl
  resource "aws_instance" "web" {
    instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"
  }
  
  # Create resource conditionally
  resource "aws_eip" "web" {
    count    = var.environment == "prod" ? 1 : 0
    instance = aws_instance.web.id
  }
  ```

### Functions
- [ ] Built-in functions:
  ```hcl
  locals {
    # String functions
    upper_env = upper(var.environment)
    
    # Collection functions
    all_cidrs = concat(var.public_cidrs, var.private_cidrs)
    
    # Encoding functions
    user_data = base64encode(file("user-data.sh"))
    
    # Filesystem functions
    config = yamldecode(file("config.yaml"))
    
    # Date/time
    timestamp = timestamp()
  }
  ```

## Thực Hành - Terraform with Kubernetes

### Kubernetes Provider
- [ ] Configure provider:
  ```hcl
  provider "kubernetes" {
    config_path = "~/.kube/config"
  }
  
  # Or for EKS
  data "aws_eks_cluster" "cluster" {
    name = module.eks.cluster_id
  }
  
  data "aws_eks_cluster_auth" "cluster" {
    name = module.eks.cluster_id
  }
  
  provider "kubernetes" {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
  ```

### Create Kubernetes Resources
- [ ] Deploy application:
  ```hcl
  resource "kubernetes_namespace" "app" {
    metadata {
      name = "myapp"
    }
  }
  
  resource "kubernetes_deployment" "app" {
    metadata {
      name      = "myapp"
      namespace = kubernetes_namespace.app.metadata[0].name
    }
    
    spec {
      replicas = 3
      
      selector {
        match_labels = {
          app = "myapp"
        }
      }
      
      template {
        metadata {
          labels = {
            app = "myapp"
          }
        }
        
        spec {
          container {
            name  = "myapp"
            image = "myapp:v1"
            
            port {
              container_port = 3000
            }
          }
        }
      }
    }
  }
  
  resource "kubernetes_service" "app" {
    metadata {
      name      = "myapp"
      namespace = kubernetes_namespace.app.metadata[0].name
    }
    
    spec {
      selector = {
        app = "myapp"
      }
      
      type = "LoadBalancer"
      
      port {
        port        = 80
        target_port = 3000
      }
    }
  }
  ```

## Thực Hành - Terraform CI/CD

### GitHub Actions for Terraform
- [ ] Create `.github/workflows/terraform.yml`:
  ```yaml
  name: Terraform
  
  on:
    pull_request:
      branches: [main]
    push:
      branches: [main]
  
  jobs:
    terraform:
      runs-on: ubuntu-latest
      
      steps:
        - name: Checkout
          uses: actions/checkout@v3
        
        - name: Setup Terraform
          uses: hashicorp/setup-terraform@v2
          with:
            terraform_version: 1.6.0
        
        - name: Terraform Format
          run: terraform fmt -check
        
        - name: Terraform Init
          run: terraform init
          env:
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        
        - name: Terraform Validate
          run: terraform validate
        
        - name: Terraform Plan
          run: terraform plan -out=tfplan
          env:
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        
        - name: Terraform Apply
          if: github.ref == 'refs/heads/main'
          run: terraform apply -auto-approve tfplan
          env:
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  ```

### Atlantis (Terraform Pull Request Automation)
- [ ] Deploy Atlantis server
- [ ] Configure webhook on GitHub
- [ ] Create `atlantis.yaml`:
  ```yaml
  version: 3
  projects:
  - name: dev
    dir: environments/dev
    workspace: dev
    autoplan:
      when_modified: ["*.tf", "*.tfvars"]
      enabled: true
  
  - name: prod
    dir: environments/prod
    workspace: prod
    autoplan:
      when_modified: ["*.tf", "*.tfvars"]
      enabled: true
  ```

- [ ] Pull request workflow:
  1. Create PR
  2. Atlantis automatically runs `terraform plan`
  3. Comment shows plan output
  4. Review plan
  5. Comment `atlantis apply` to apply
  6. Merge PR

## Thực Hành - Terragrunt

### What is Terragrunt?
- [ ] Wrapper for Terraform
- [ ] DRY configurations
- [ ] Manage remote state
- [ ] Execute commands across modules

### Install Terragrunt
- [ ] Install:
  ```bash
  brew install terragrunt
  ```

### Project Structure with Terragrunt
```
infrastructure/
├── terragrunt.hcl              # Root config
├── modules/
│   ├── vpc/
│   ├── eks/
│   └── rds/
└── environments/
    ├── dev/
    │   ├── terragrunt.hcl
    │   ├── vpc/
    │   │   └── terragrunt.hcl
    │   └── eks/
    │       └── terragrunt.hcl
    └── prod/
        ├── terragrunt.hcl
        ├── vpc/
        │   └── terragrunt.hcl
        └── eks/
            └── terragrunt.hcl
```

### Configuration
- [ ] Root `terragrunt.hcl`:
  ```hcl
  remote_state {
    backend = "s3"
    config = {
      bucket         = "my-terraform-state"
      key            = "${path_relative_to_include()}/terraform.tfstate"
      region         = "us-east-1"
      encrypt        = true
      dynamodb_table = "terraform-locks"
    }
  }
  ```

- [ ] Environment `terragrunt.hcl`:
  ```hcl
  include "root" {
    path = find_in_parent_folders()
  }
  
  terraform {
    source = "../../../modules/vpc"
  }
  
  inputs = {
    environment = "dev"
    vpc_cidr    = "10.0.0.0/16"
  }
  ```

## Mini Project Week 3
- [ ] Advanced Terraform features:
  - Dynamic blocks
  - For expressions
  - Conditional logic
  - Built-in functions
  - Kubernetes provider

- [ ] CI/CD pipeline:
  - GitHub Actions workflow
  - Automated fmt check
  - Automated plan on PR
  - Automated apply on merge
  - Atlantis for PR automation

- [ ] Terragrunt structure:
  - DRY configuration
  - Multiple environments
  - Shared modules
  - Remote state management

- [ ] Complete infrastructure:
  - AWS VPC
  - EKS cluster
  - RDS database
  - All via IaC

---

# Tuần 4: Configuration Management & Testing

## Học - Ansible Basics

### What is Ansible?
- [ ] Configuration management
- [ ] Agentless (SSH-based)
- [ ] YAML playbooks
- [ ] Idempotent operations

### Ansible vs Terraform
- [ ] **Terraform:** provision infrastructure
- [ ] **Ansible:** configure software
- [ ] Often used together

## Thực Hành - Ansible Setup

### Install Ansible
- [ ] Install:
  ```bash
  brew install ansible
  ansible --version
  ```

### Inventory File
- [ ] Create `inventory.ini`:
  ```ini
  [webservers]
  web1 ansible_host=10.0.1.10
  web2 ansible_host=10.0.1.11
  
  [dbservers]
  db1 ansible_host=10.0.2.10
  
  [all:vars]
  ansible_user=ubuntu
  ansible_ssh_private_key_file=~/.ssh/mykey.pem
  ```

### Ad-Hoc Commands
- [ ] Ping hosts:
  ```bash
  ansible all -i inventory.ini -m ping
  ```

- [ ] Run command:
  ```bash
  ansible webservers -i inventory.ini -a "uptime"
  ```

- [ ] Install package:
  ```bash
  ansible webservers -i inventory.ini -m apt -a "name=nginx state=present" --become
  ```

## Thực Hành - Ansible Playbooks

### Create Playbook
- [ ] Create `webserver.yml`:
  ```yaml
  ---
  - name: Configure webservers
    hosts: webservers
    become: yes
    
    tasks:
      - name: Update apt cache
        apt:
          update_cache: yes
      
      - name: Install nginx
        apt:
          name: nginx
          state: present
      
      - name: Copy nginx config
        template:
          src: templates/nginx.conf.j2
          dest: /etc/nginx/nginx.conf
        notify: Restart nginx
      
      - name: Ensure nginx is running
        service:
          name: nginx
          state: started
          enabled: yes
    
    handlers:
      - name: Restart nginx
        service:
          name: nginx
          state: restarted
  ```

- [ ] Run playbook:
  ```bash
  ansible-playbook -i inventory.ini webserver.yml
  ```

### Ansible Roles
- [ ] Create role structure:
  ```bash
  ansible-galaxy init roles/webserver
  ```

- [ ] Structure:
  ```
  roles/webserver/
  ├── tasks/
  │   └── main.yml
  ├── handlers/
  │   └── main.yml
  ├── templates/
  │   └── nginx.conf.j2
  ├── files/
  ├── vars/
  │   └── main.yml
  └── defaults/
      └── main.yml
  ```

- [ ] Use role in playbook:
  ```yaml
  ---
  - name: Setup webservers
    hosts: webservers
    become: yes
    roles:
      - webserver
  ```

## Thực Hành - Terraform + Ansible

### Provision with Terraform
- [ ] Create instances:
  ```hcl
  resource "aws_instance" "web" {
    count         = 2
    ami           = data.aws_ami.ubuntu.id
    instance_type = "t3.micro"
    key_name      = aws_key_pair.deployer.key_name
    
    tags = {
      Name = "web-${count.index + 1}"
    }
  }
  
  # Generate Ansible inventory
  resource "local_file" "ansible_inventory" {
    content = templatefile("${path.module}/inventory.tpl", {
      webservers = aws_instance.web[*].public_ip
    })
    filename = "${path.module}/inventory.ini"
  }
  ```

### Configure with Ansible
- [ ] Run after Terraform:
  ```bash
  terraform apply
  ansible-playbook -i inventory.ini webserver.yml
  ```

## Học - Infrastructure Testing

### Why Test IaC?
- [ ] Catch errors early
- [ ] Validate assumptions
- [ ] Ensure compliance
- [ ] Confidence in changes

### Testing Layers
- [ ] **Syntax:** terraform fmt, validate
- [ ] **Static Analysis:** tflint, checkov
- [ ] **Unit Tests:** terratest
- [ ] **Integration Tests:** kitchen-terraform

## Thực Hành - Static Analysis

### tflint
- [ ] Install:
  ```bash
  brew install tflint
  ```

- [ ] Configure `.tflint.hcl`:
  ```hcl
  plugin "aws" {
    enabled = true
    version = "0.27.0"
    source  = "github.com/terraform-linters/tflint-ruleset-aws"
  }
  ```

- [ ] Run:
  ```bash
  tflint --init
  tflint
  ```

### Checkov
- [ ] Install:
  ```bash
  brew install checkov
  ```

- [ ] Run security checks:
  ```bash
  checkov -d .
  ```

- [ ] Fix issues found

## Thực Hành - Terratest

### Install Go
- [ ] Install:
  ```bash
  brew install go
  ```

### Write Test
- [ ] Create `test/terraform_test.go`:
  ```go
  package test
  
  import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/assert"
  )
  
  func TestVPCCreation(t *testing.T) {
    t.Parallel()
    
    terraformOptions := &terraform.Options{
      TerraformDir: "../",
      Vars: map[string]interface{}{
        "environment": "test",
        "vpc_cidr":    "10.100.0.0/16",
      },
    }
    
    defer terraform.Destroy(t, terraformOptions)
    
    terraform.InitAndApply(t, terraformOptions)
    
    vpcID := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcID)
  }
  ```

- [ ] Run test:
  ```bash
  cd test
  go test -v -timeout 30m
  ```

## Mini Project Week 4
- [ ] Infrastructure testing pipeline:
  - Terraform fmt check
  - tflint for linting
  - Checkov for security
  - Terratest for validation
  - All in CI/CD

- [ ] Ansible integration:
  - EC2 instances via Terraform
  - Auto-generated inventory
  - Ansible playbook for configuration
  - Docker installed via Ansible
  - Application deployed

- [ ] Complete workflow:
  ```bash
  # 1. Provision infrastructure
  terraform apply
  
  # 2. Configure servers
  ansible-playbook -i inventory.ini site.yml
  
  # 3. Deploy application
  ansible-playbook -i inventory.ini deploy.yml
  ```

- [ ] Documentation:
  - Architecture diagram
  - Module documentation
  - Playbook documentation
  - Testing guide
  - Troubleshooting

---

# CAPSTONE PROJECT: Complete IaC Platform

## Objective
Build complete infrastructure-as-code platform for multi-environment deployment.

## Requirements Checklist

### [ ] 1. Terraform Infrastructure
- [ ] Multi-cloud support (AWS + optionally others)
- [ ] Modular architecture
- [ ] Multiple environments (dev/staging/prod)
- [ ] Remote state (S3 + DynamoDB)
- [ ] Workspaces or separate configs
- [ ] All resources tagged properly

### [ ] 2. Resources to Provision
- [ ] **Networking:**
  - VPC with public/private subnets
  - Internet Gateway
  - NAT Gateway
  - Route tables
  - Security groups
  - Network ACLs

- [ ] **Compute:**
  - EKS cluster or EC2 Auto Scaling
  - Launch templates
  - Load balancers

- [ ] **Storage:**
  - S3 buckets
  - EBS volumes
  - EFS (optional)

- [ ] **Database:**
  - RDS Multi-AZ
  - ElastiCache

- [ ] **Monitoring:**
  - CloudWatch
  - SNS topics
  - Alarms

### [ ] 3. Configuration Management
- [ ] Ansible playbooks
- [ ] Roles for different components
- [ ] Dynamic inventory from Terraform
- [ ] Idempotent operations
- [ ] Secret management (Ansible Vault)

### [ ] 4. CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Pull request automation (Atlantis)
- [ ] Automated testing (tflint, checkov, terratest)
- [ ] Plan on PR
- [ ] Apply on merge
- [ ] Notifications (Slack)

### [ ] 5. Testing
- [ ] Unit tests (Terratest)
- [ ] Integration tests
- [ ] Security scans (checkov)
- [ ] Cost estimation (Infracost)
- [ ] Compliance checks (OPA)

### [ ] 6. Documentation
- [ ] Architecture diagrams
- [ ] Module documentation
- [ ] Variable documentation
- [ ] Setup guide
- [ ] Operations runbook
- [ ] Disaster recovery procedures

### [ ] 7. Security & Compliance
- [ ] Encrypted storage
- [ ] Secrets not in code
- [ ] IAM least privilege
- [ ] Security group rules minimal
- [ ] Logging enabled
- [ ] Compliance tags

### [ ] 8. Cost Optimization
- [ ] Right-sized instances
- [ ] Auto-scaling configured
- [ ] Reserved instances (where applicable)
- [ ] S3 lifecycle policies
- [ ] Cost allocation tags

---

# Self-Assessment

After Month 12, you should be able to:

### Terraform
- [ ] Write Terraform configurations
- [ ] Use modules effectively
- [ ] Manage remote state
- [ ] Multiple environments
- [ ] Advanced features (dynamic blocks, for expressions)
- [ ] Kubernetes provider

### Infrastructure as Code
- [ ] Design modular infrastructure
- [ ] Version control infrastructure
- [ ] Collaborate on IaC
- [ ] Test infrastructure code
- [ ] CI/CD for infrastructure

### Configuration Management
- [ ] Write Ansible playbooks
- [ ] Create reusable roles
- [ ] Integrate with Terraform
- [ ] Manage secrets
- [ ] Idempotent operations

### Best Practices
- [ ] DRY principles
- [ ] Naming conventions
- [ ] Tagging strategies
- [ ] Security practices
- [ ] Cost optimization

---

# Resources

## Documentation
- [ ] Terraform Documentation: https://www.terraform.io/docs
- [ ] Terraform Registry: https://registry.terraform.io
- [ ] Ansible Documentation: https://docs.ansible.com

## Books
- [ ] "Terraform: Up & Running" - Yevgeniy Brikman
- [ ] "Ansible for DevOps" - Jeff Geerling

## Courses
- [ ] HashiCorp Certified: Terraform Associate
- [ ] A Cloud Guru: Terraform courses
- [ ] Linux Academy: Ansible courses

## Tools
- [ ] Terragrunt: https://terragrunt.gruntwork.io
- [ ] Atlantis: https://www.runatlantis.io
- [ ] tflint: https://github.com/terraform-linters/tflint
- [ ] checkov: https://www.checkov.io
- [ ] Infracost: https://www.infracost.io

---

# Progress Tracking

## Week 1
- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________

## Week 2
- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________

## Week 3
- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________

## Week 4
- Date Started: ___________
- Completed Tasks: ___ / ___
- Key Learnings: ___________

## Capstone Project
- Date Started: ___________
- Date Completed: ___________
- GitHub Repo: ___________
- Production Deployment: ___________

---

## 🎓 Congratulations!

You've completed the 12-month DevOps journey! You now have:

✅ Linux/Unix fundamentals
✅ Docker & Kubernetes expertise
✅ CI/CD mastery
✅ Cloud platform skills (AWS)
✅ Monitoring & observability
✅ Security best practices
✅ Infrastructure as Code

### Next Steps:
1. **Apply for DevOps roles**
2. **Contribute to open-source**
3. **Get certified** (AWS, Kubernetes, Terraform)
4. **Keep learning** - DevOps never stops evolving!
5. **Mentor others** - share your knowledge

---

**You're now a DevOps Engineer! 🚀**

*Remember: The journey doesn't end here. Technology evolves, and so should you. Keep building, keep learning, keep shipping!*
