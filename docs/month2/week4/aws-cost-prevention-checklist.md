# 💰 AWS Cost Prevention Checklist
## "Don't Let the Money Slip Away" - Complete Money-Saving Guide

**Purpose:** Track and prevent unexpected AWS charges  
**Target:** Beginners learning AWS  
**Goal:** Stay within free tier ($0/month) or minimal cost ($5-10/month)

---

## 🚨 **IMMEDIATE SETUP (Do These BEFORE Launching Anything!)**

### ☐ **Critical Alert Setup** (30 minutes - DO THIS FIRST!)

**1. Enable Billing Alerts**
```
□ AWS Console → Billing Dashboard → Billing Preferences
□ ✅ Check "Receive Free Tier Usage Alerts"
□ ✅ Check "Receive Billing Alerts"
□ Enter email: ____________________
□ Save preferences
□ Status: _________ Date: _________
```

**2. Create CloudWatch Billing Alarm ($1 Alert)**
```
□ CloudWatch → Billing → Create alarm
□ Metric: EstimatedCharges
□ Threshold: Greater than $1
□ Email: ____________________
□ Create alarm
□ Confirm email subscription
□ Status: _________ Date: _________

Why $1? Free tier should be $0. Any charge = investigate immediately!
```

**3. Create AWS Budgets**
```
Budget 1: Zero Spend Budget
□ Billing → Budgets → Create budget
□ Template: Zero spend budget
□ Email: ____________________
□ Alert when forecasted > $0
□ Status: _________ Date: _________

Budget 2: $5 Safety Budget
□ Create budget → Monthly cost budget
□ Amount: $5
□ Alert at 50% ($2.50)
□ Alert at 80% ($4.00)
□ Alert at 100% ($5.00)
□ Status: _________ Date: _________

Budget 3: $20 Hard Limit
□ Create budget → Monthly cost budget
□ Amount: $20
□ Alert at 100% ($20)
□ Email + SMS notification
□ Status: _________ Date: _________
```

**4. Enable Multi-Factor Authentication (MFA)**
```
□ AWS Console → Your Name → Security Credentials
□ Multi-factor authentication (MFA) → Assign MFA device
□ App used: □ Google Authenticator  □ Authy  □ Other: _________
□ Scan QR code
□ Enter two consecutive MFA codes
□ MFA enabled ✅
□ Status: _________ Date: _________
```

**5. Create IAM User (Don't Use Root!)**
```
□ IAM → Users → Create user
□ Username: ____________________
□ Permissions: AdministratorAccess (or EC2FullAccess for learning)
□ Create user
□ Save credentials securely
□ Logout from root account
□ Login with IAM user
□ Status: _________ Date: _________
```

**6. Enable AWS Cost Anomaly Detection**
```
□ Billing → Cost Anomaly Detection
□ Create monitor → "AWS Services"
□ Alert preference: Email
□ Status: _________ Date: _________
```

**7. Choose Default Region (Stick to One!)**
```
My default region: □ us-east-1 (N. Virginia) - Recommended
                   □ Other: ____________________

Bookmark URL: https://console.aws.amazon.com/ec2/home?region=us-east-1

Always check region BEFORE launching anything!
```

---

## 📋 **DAILY CHECKLIST (5 minutes every evening)**

### **Daily Shutdown Routine**

**Date: _______ Time: _______**

```
□ Check EC2 Instances
  Region: ____________________
  Running instances: _____
  Action taken:
  □ Stopped instances: _____ (list IDs: __________________)
  □ Terminated instances: _____ (list IDs: __________________)
  □ Kept running (reason: ______________________)

□ Check if instance is needed overnight
  □ Yes - Production/long-running task → Keep running
  □ No - Learning/testing → STOP or TERMINATE

□ Verify all regions checked
  □ us-east-1
  □ us-west-2
  □ Other regions: ____________________

Notes: _________________________________________________
```

**Quick Daily Commands:**
```bash
# Check running instances
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]' \
  --output table

# Stop all instances (if needed)
aws ec2 stop-instances --instance-ids i-xxxxxxxxx
```

---

## 📅 **WEEKLY AUDIT (Sunday Evening - 15 minutes)**

### **Week of: __________ Completed: ☐**

**1. EC2 Resources Check**
```
□ Check ALL regions (not just default!)
  Regions checked: ____________________

For EACH region:
□ Running instances: _____
  Action: □ Stopped  □ Terminated  □ Kept (why: ________)

□ Stopped instances: _____
  Action: □ Terminated (recommended for learning)
          □ Kept (reason: ______________________)

□ Elastic IPs allocated: _____
  □ Associated with running instance: _____ (Cost: $0) ✅
  □ NOT associated: _____ (Cost: $3.60/month each!) ❌
  Action: Released _____ Elastic IPs
  IDs released: ____________________

□ Volumes (EBS): _____
  □ In-use: _____ (attached to instances) ✅
  □ Available: _____ (NOT attached - DELETE!) ❌
  Action: Deleted _____ volumes
  Size freed: _____ GB

□ Snapshots: _____
  □ Needed (backups): _____
  □ Old/unused: _____
  Action: Deleted _____ snapshots
  Size freed: _____ GB
```

**2. Other Services Check**
```
□ S3 Buckets: _____
  Total storage: _____ GB (Free tier: 5 GB)
  Action: Deleted _____ GB

□ RDS Databases: _____
  Action: □ Stopped  □ Deleted

□ Load Balancers: _____
  Action: □ Deleted (Cost: ~$18/month each!)

□ NAT Gateways: _____
  Action: □ Deleted (Cost: ~$32/month each!)
```

**3. Billing Check**
```
□ Current month charges: $__________
  □ $0 ✅
  □ > $0 ⚠️ → Investigate!

□ Forecasted charges: $__________

□ Free tier usage:
  EC2: _____ / 750 hours
  EBS: _____ / 30 GB
  Data transfer: _____ / 100 GB

Notes: _________________________________________________
```

---

## 📆 **MONTHLY REVIEW (First Day of Month - 30 minutes)**

### **Month: __________ Completed: ☐**

**1. Previous Month Bill Analysis**
```
□ Total bill: $__________
  □ $0 ✅ Perfect!
  □ $1-5 ⚠️ Acceptable for learning
  □ $5-20 ⚠️ Review what caused it
  □ > $20 🚨 INVESTIGATE IMMEDIATELY!

□ Breakdown by service:
  EC2: $__________
  EBS: $__________
  Data Transfer: $__________
  Elastic IP: $__________
  Other: $__________

□ Most expensive service: ____________________
  Reason: ____________________
  Action to reduce: ____________________
```

**2. Free Tier Status**
```
□ Free tier expiration date: __________
  Days remaining: _____

□ Free tier usage last month:
  EC2 hours: _____ / 750 (____%)
  EBS storage: _____ / 30 GB (____%)
  Data transfer: _____ / 100 GB (____%)

□ Approaching limits?
  □ No ✅
  □ Yes ⚠️ → Action: ____________________
```

**3. Cost Forecast**
```
□ Current month forecast: $__________
□ Projected annual cost: $__________

□ If forecast > $10:
  Reason: ____________________
  Plan to reduce: ____________________
```

**4. Resource Cleanup**
```
□ Deleted old snapshots: _____
□ Released unused Elastic IPs: _____
□ Terminated stopped instances: _____
□ Deleted unattached volumes: _____
□ Emptied unused S3 buckets: _____

Total monthly savings: $__________
```

**5. Security Check**
```
□ Review CloudTrail logs for unusual activity
□ Check IAM access keys (no unused keys)
□ Verify MFA still enabled
□ Check for exposed credentials (GitHub scan)
□ Review security groups (no 0.0.0.0/0 on sensitive ports)
```

---

## 🏷️ **RESOURCE TAGGING TEMPLATE**

**Every resource MUST have these tags:**

```
When creating ANY resource:

□ Name: ________________________
  Format: [env]-[purpose]-[number]
  Example: dev-webserver-01, learning-nginx-test

□ Environment: □ development  □ staging  □ production  □ learning

□ Owner: ________________________ (your name)

□ Purpose: ________________________
  Example: "Following AWS tutorial chapter 5"
           "Testing Docker deployment"
           "Personal project - blog"

□ AutoDelete: □ yes  □ no
  (yes = safe to delete after learning)

□ CreatedDate: __________

□ CostCenter: □ personal  □ learning  □ project: __________

□ DeleteAfter: __________ (date)
  Example: "2024-12-31" or "after-tutorial-completion"
```

**Example Tag Set:**
```
Name: learning-ubuntu-server
Environment: development
Owner: john-doe
Purpose: Learning SSH and basic Linux commands
AutoDelete: yes
CreatedDate: 2024-01-15
CostCenter: personal
DeleteAfter: 2024-01-20
```

---

## 📊 **RESOURCE TRACKING SPREADSHEET**

**Copy this to Excel/Google Sheets:**

| Date | Resource Type | Resource ID | Region | Name | Purpose | Status | Cost/Month | Action Needed |
|------|---------------|-------------|--------|------|---------|--------|------------|---------------|
| 2024-01-15 | EC2 Instance | i-abc123 | us-east-1 | dev-webserver | Tutorial Ch.3 | Terminated | $0 | None |
| 2024-01-16 | Elastic IP | eipalloc-xyz | us-east-1 | test-eip | Testing | Released | $0 | None |
| 2024-01-20 | EC2 Instance | i-def456 | us-east-1 | prod-demo | Demo project | Running | $7.59 | Monitor |
| | | | | | | | | |

**Update this spreadsheet:**
- ✅ When launching new resources
- ✅ When terminating resources
- ✅ Weekly during audit
- ✅ Before major changes

---

## 💡 **COST-SAVING STRATEGIES**

### **Strategy 1: Stop vs Terminate Decision**

```
For each instance, ask:

□ Is this production?
  □ Yes → Keep running (need 24/7 availability)
  □ No → Continue to next question

□ Will I use this again tomorrow?
  □ Yes → STOP instance (save partial cost)
  □ No → TERMINATE instance (save full cost)

□ Is it valuable to keep configuration?
  □ Yes → STOP instance OR create AMI then terminate
  □ No → TERMINATE immediately

LEARNING/TESTING → Always TERMINATE
DEVELOPMENT → Stop overnight, terminate weekends
PRODUCTION → Keep running
```

**Cost Comparison (t3.micro):**
```
Always Running: $7.59/month
Stopped (12h/day): $3.80/month + $2/month (EBS) = $5.80/month
Terminated: $0/month

For learning: TERMINATE = Best!
Recreate when needed (takes 2 minutes)
```

---

### **Strategy 2: Free Tier Optimization**

```
Free Tier Limits (12 months):
□ 750 hours/month EC2 (t2.micro or t3.micro)
□ 30 GB EBS storage
□ 100 GB data transfer OUT

How to stay within:
□ Only use t3.micro (NEVER upgrade during free tier)
□ 1 instance 24/7 = 744 hours ✅
□ 2 instances 12h/day = 720 hours ✅
□ Keep root volume < 30 GB
□ Don't download > 100 GB/month

Current usage tracking:
EC2 hours used: _____ / 750
EBS storage: _____ / 30 GB
Data transfer: _____ / 100 GB
```

---

### **Strategy 3: Right-Sizing**

```
Before launching, ask:

What do I need it for?
□ Learning/Tutorial → t3.micro ✅
□ Small app/website → t3.micro ✅
□ Medium app → t3.small
□ Production (>1000 users/day) → t3.medium or larger

Current instance size: __________
CPU usage: _____%
RAM usage: _____%

Action:
□ < 40% utilized → Downsize to save money
□ 40-80% utilized → Perfect size ✅
□ > 80% utilized → Consider upgrade
```

---

### **Strategy 4: Region Selection**

```
My chosen region: ____________________

Pricing varies by region:
us-east-1 (N. Virginia): $7.59/month (cheapest!)
us-west-2 (Oregon): $7.59/month
eu-west-1 (Ireland): $8.50/month
ap-southeast-1 (Singapore): $8.80/month

Savings tip: Use us-east-1 for learning (cheapest + most services)
```

---

### **Strategy 5: Schedule-Based Usage**

```
If you must keep instance running:

Create schedule:
Monday-Friday: 9 AM - 6 PM (9 hours)
Nights: OFF (15 hours)
Weekends: OFF (48 hours)

Monthly hours: (9 × 5 × 4) + (9 × 4) = 216 hours
vs 744 hours (24/7)

Savings: 71%!

Implementation:
□ Manual: Stop/Start via console
□ Automated: AWS Instance Scheduler
□ Script: Lambda + CloudWatch Events

My schedule: ____________________
```

---

## 🚫 **NEVER DO THIS! (Common Costly Mistakes)**

### **Critical Mistakes to Avoid**

```
☐ NEVER commit AWS credentials to Git
   □ Check .gitignore includes:
     .aws/
     *.pem
     *.ppk
     credentials*
     .env

☐ NEVER enable services you don't understand
   □ Research pricing before enabling
   □ Stick to EC2, S3 basics while learning
   
   Expensive services to avoid:
   □ NAT Gateway ($32/month)
   □ Elasticsearch ($50+/month)
   □ SageMaker ($50+/month)
   □ VPN ($36/month)

☐ NEVER ignore email alerts
   □ AWS Free Tier usage warning → Check immediately
   □ Billing alert → Log in NOW
   □ Cost anomaly → Investigate TODAY

☐ NEVER upgrade instance type without investigating
   □ t3.micro → t3.small: 2x cost
   □ t3.micro → t3.medium: 4x cost
   □ t3.micro → m5.large: 9x cost!
   
   Before upgrading:
   □ Check CPU/RAM usage (CloudWatch)
   □ Optimize code first
   □ Add caching
   □ Only upgrade if really needed

☐ NEVER keep resources in multiple regions
   □ Always check region before launching
   □ Stick to ONE region (us-east-1)
   □ Check ALL regions during weekly audit

☐ NEVER forget to release Elastic IPs
   □ If not using → Release immediately
   □ Cost: $3.60/month per idle EIP
   □ Check weekly!

☐ NEVER share AWS credentials
   □ Each team member needs own IAM user
   □ Each person gets own SSH key
   □ No sharing root account password
```

---

## 🆘 **EMERGENCY COST CONTROL**

### **Bill is High! Do This IMMEDIATELY:**

```
Current bill: $__________ (if > $20, this is emergency!)

Step 1: STOP THE BLEEDING (Do NOW - 5 minutes)
□ EC2 → Instances → Select All → Actions → Stop/Terminate
□ EC2 → Load Balancers → Delete all
□ EC2 → Elastic IPs → Release all
□ RDS → Databases → Delete all
□ S3 → Buckets → Empty and delete (if not needed)

Step 2: CHECK ALL REGIONS (10 minutes)
For each region:
□ us-east-1: _____ resources stopped/deleted
□ us-west-1: _____ resources stopped/deleted
□ us-west-2: _____ resources stopped/deleted
□ eu-west-1: _____ resources stopped/deleted
□ ap-southeast-1: _____ resources stopped/deleted
□ Other: _____ resources stopped/deleted

Step 3: IDENTIFY THE CULPRIT (15 minutes)
□ Billing → Bills → Current month
□ Most expensive service: ____________________
□ Cost: $__________
□ Date started: __________
□ Reason: ____________________

Step 4: CONTACT AWS SUPPORT (if needed)
□ Support → Create case → Account and billing
□ Explain: ____________________
□ Request: Credit/waive charges
□ Case ID: ____________________

Common reasons AWS grants credits:
✅ First-time mistake
✅ Account compromised
✅ Didn't understand pricing
✅ Student/learning

Step 5: PREVENT FUTURE OCCURRENCES
□ Lower budget alerts ($1, $5, $10)
□ Enable stricter cost controls
□ Set calendar reminders
□ Use AWS Cost Anomaly Detection
```

---

## 🔐 **SECURITY CHECKLIST (Prevent Account Compromise)**

### **Monthly Security Audit**

```
□ Check for exposed credentials
  □ GitHub repository scan: ____________________
  □ No .pem files in repos ✅
  □ No credentials in code ✅

□ Review IAM access keys
  □ Last used: __________
  □ Delete unused keys: _____
  □ Rotate keys older than 90 days

□ Verify MFA status
  □ Root account MFA: ☐ Enabled ☐ Disabled
  □ IAM user MFA: ☐ Enabled ☐ Disabled

□ Check CloudTrail for suspicious activity
  □ Unusual instance launches: ☐ Yes ☐ No
  □ Unexpected region access: ☐ Yes ☐ No
  □ Large instance types: ☐ Yes ☐ No

□ Review security groups
  □ SSH (22) from 0.0.0.0/0: ☐ Found ☐ Clear ⚠️
  □ Unnecessary ports open: ☐ Found ☐ Clear
  □ Action taken: ____________________

□ Check for crypto mining
  □ Unexpected GPU instances: ☐ Yes ☐ No
  □ High CPU utilization: ☐ Yes ☐ No
  □ Unusual regions: ☐ Yes ☐ No
```

---

## 📈 **COST TRACKING DASHBOARD**

### **Monthly Cost Summary**

**Month: __________**

```
Starting balance: $__________

Week 1 (_____ to _____): $__________
  Services used:
  □ EC2: $__________
  □ EBS: $__________
  □ S3: $__________
  □ Other: __________

Week 2 (_____ to _____): $__________
  Services used:
  □ EC2: $__________
  □ EBS: $__________
  □ S3: $__________
  □ Other: __________

Week 3 (_____ to _____): $__________
  Services used:
  □ EC2: $__________
  □ EBS: $__________
  □ S3: $__________
  □ Other: __________

Week 4 (_____ to _____): $__________
  Services used:
  □ EC2: $__________
  □ EBS: $__________
  □ S3: $__________
  □ Other: __________

Total monthly cost: $__________

Goal: $__________ (typically $0-5 for learning)
Difference: $__________ (over/under budget)

Actions for next month:
1. ____________________________________________________
2. ____________________________________________________
3. ____________________________________________________
```

---

## 🎯 **LEARNING PHASE COST GOALS**

### **Progressive Cost Targets**

```
Month 1-3 (Learning Basics):
Target: $0/month (use free tier only)
□ Only t3.micro instances
□ Terminate after each session
□ No Elastic IPs
□ No additional services
Actual: $__________

Month 4-6 (Building Projects):
Target: $0-5/month
□ Small projects running
□ Efficient resource usage
□ Still within free tier mostly
Actual: $__________

Month 7-12 (Advanced Learning):
Target: $5-10/month
□ Multiple small projects
□ Some paid features
□ Learning cost optimization
Actual: $__________

Month 13+ (Post Free Tier):
Target: $10-20/month
□ Production-grade setup
□ Optimized architecture
□ Cost-efficient practices
Actual: $__________
```

---

## 📝 **WEEKLY HABITS REMINDER**

### **Print and Put on Wall:**

```
═══════════════════════════════════════════════════════════
                   AWS COST PREVENTION
                      DAILY HABITS
═══════════════════════════════════════════════════════════

BEFORE CLOSING LAPTOP EACH DAY:

1. ☐ Check running EC2 instances
2. ☐ Stop or terminate if not needed overnight
3. ☐ Check Elastic IPs (release if idle)
4. ☐ Verify only in one region

TIME REQUIRED: 2-5 minutes
MONEY SAVED: $5-20/month

═══════════════════════════════════════════════════════════
                     SUNDAY EVENING
                   WEEKLY AUDIT (15 min)
═══════════════════════════════════════════════════════════

1. ☐ Check ALL regions (not just default!)
2. ☐ Release all Elastic IPs not in use
3. ☐ Delete unattached EBS volumes
4. ☐ Delete old snapshots
5. ☐ Check billing dashboard
6. ☐ Review free tier usage

MONEY SAVED: $10-50/month

═══════════════════════════════════════════════════════════
                    FIRST OF MONTH
                 MONTHLY REVIEW (30 min)
═══════════════════════════════════════════════════════════

1. ☐ Review previous month bill
2. ☐ Check free tier status
3. ☐ Forecast next month
4. ☐ Clean up all unused resources
5. ☐ Security audit
6. ☐ Update tracking spreadsheet

═══════════════════════════════════════════════════════════
```

---

## ⚡ **QUICK COMMANDS REFERENCE**

### **Copy-Paste Commands for Daily Use**

```bash
# Check all running instances
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType,PublicIpAddress]' \
  --output table

# List all Elastic IPs
aws ec2 describe-addresses \
  --query 'Addresses[*].[AllocationId,PublicIp,AssociationId]' \
  --output table

# Find unassociated Elastic IPs (costing money!)
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].[AllocationId,PublicIp]' \
  --output table

# List all EBS volumes
aws ec2 describe-volumes \
  --query 'Volumes[*].[VolumeId,State,Size]' \
  --output table

# Find unattached volumes (delete these!)
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,CreateTime]' \
  --output table

# Check current month cost (requires jq)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --query 'ResultsByTime[*].[TimePeriod.Start,Total.BlendedCost.Amount]'

# Stop all running instances in region
aws ec2 stop-instances --instance-ids \
  $(aws ec2 describe-instances \
    --query 'Reservations[*].Instances[?State.Name==`running`].InstanceId' \
    --output text)

# Release specific Elastic IP
aws ec2 release-address --allocation-id eipalloc-xxxxxxxxx

# Delete specific volume
aws ec2 delete-volume --volume-id vol-xxxxxxxxx
```

---

## 📚 **RESOURCES AND LINKS**

### **Bookmark These URLs:**

```
AWS Console (us-east-1):
https://console.aws.amazon.com/ec2/home?region=us-east-1

Billing Dashboard:
https://console.aws.amazon.com/billing/home

Cost Explorer:
https://console.aws.amazon.com/cost-management/home

Free Tier Usage:
https://console.aws.amazon.com/billing/home#/freetier

AWS Pricing Calculator:
https://calculator.aws/

AWS Cost Management Blog:
https://aws.amazon.com/blogs/aws-cost-management/

CloudWatch Billing Alarms:
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#alarmsV2:

AWS Trusted Advisor:
https://console.aws.amazon.com/trustedadvisor/home
```

---

## 🎓 **LEARNING RESOURCES**

### **Free Tier Documentation:**

```
□ AWS Free Tier Page
  https://aws.amazon.com/free/
  
□ AWS Free Tier FAQs
  https://aws.amazon.com/free/free-tier-faqs/
  
□ EC2 Pricing
  https://aws.amazon.com/ec2/pricing/
  
□ Cost Optimization Best Practices
  https://docs.aws.amazon.com/cost-management/

□ Reddit: r/aws (search "free tier" or "billing")
  https://reddit.com/r/aws

□ AWS re:Post (AWS Community Forum)
  https://repost.aws/
```

---

## ✅ **SUCCESS METRICS**

### **Track Your Cost Control Success:**

```
Month 1:
□ All alerts set up ✅
□ Zero unexpected charges ✅
□ Daily checks performed: _____ / 30
□ Monthly cost: $__________
□ Goal achieved: ☐ Yes ☐ No

Month 2:
□ Zero unexpected charges ✅
□ Weekly audits performed: _____ / 4
□ Monthly cost: $__________
□ Goal achieved: ☐ Yes ☐ No

Month 3:
□ Zero unexpected charges ✅
□ All resources tagged ✅
□ Monthly cost: $__________
□ Goal achieved: ☐ Yes ☐ No

Total Saved (vs. worst case): $__________
```

---

## 🏆 **COST SAVING ACHIEVEMENTS**

### **Unlock These Milestones:**

```
□ 🥉 Bronze: First month at $0
□ 🥈 Silver: 3 consecutive months at $0
□ 🥇 Gold: 6 consecutive months at $0
□ 💎 Diamond: 12 consecutive months at $0

□ 🔰 Novice: Set up all billing alerts
□ 📊 Analyst: Use Cost Explorer weekly
□ 🎯 Optimizer: Reduce costs by 50%
□ 🛡️ Guardian: Catch anomaly before $10

□ 🏃 Quick Responder: Act on alert within 1 hour
□ 🕵️ Detective: Find and fix hidden cost
□ 💰 Saver: Save $100+ through optimization
□ 🎓 Master: Help others avoid cost pitfalls
```

---

## 📞 **EMERGENCY CONTACTS**

### **When Things Go Wrong:**

```
AWS Support:
Phone: 1-866-793-4792 (US)
Email: Through AWS Console → Support Center
Live Chat: Available in console

Your Reminders:
Calendar: Set daily reminder at _____ PM
Weekly: Every Sunday at _____ PM
Monthly: 1st of month at _____ AM

Personal Notes:
Emergency budget limit: $__________
Max acceptable monthly cost: $__________
Contact if exceeded: ____________________
```

---

## 📋 **PRINT THIS CHECKLIST**

### **Quick Daily Checklist (Print and Post):**

```
═══════════════════════════════════════════════════════════
                    BEFORE YOU LOG OFF
═══════════════════════════════════════════════════════════

Today's Date: ____________

☐ Checked running instances
☐ Stopped/terminated if not needed
☐ Checked Elastic IPs
☐ Confirmed region
☐ Today's estimated cost: $__________

Sign: ____________

═══════════════════════════════════════════════════════════

WEEKLY GOAL: $0
MONTHLY GOAL: $0

CURRENT MONTH: $__________

═══════════════════════════════════════════════════════════
```

---

## 🎯 **FINAL REMINDERS**

```
💰 GOLDEN RULES:

1. If you don't need it running, TERMINATE it (not just stop)
2. Check daily (5 minutes saves you $5-20/month)
3. One region only (prevents confusion)
4. Tag everything (know what you can delete)
5. When in doubt, DELETE (you can recreate)
6. Set alerts BEFORE launching anything
7. Free tier should cost $0 - any charge needs investigation
8. Elastic IPs cost money when idle - release them!
9. Monthly review is mandatory
10. "Don't let the money slip away!" 💸

═══════════════════════════════════════════════════════════

Print this document and keep it next to your computer!
Review weekly to build habits.
Update monthly with actual costs.

Your AWS learning should cost $0-5/month, not $50-500!

═══════════════════════════════════════════════════════════
```

---

**Document Version:** 1.0  
**Last Updated:** ___________  
**Next Review Date:** ___________  
**Owner:** ___________

**Status:** ☐ Active  ☐ Needs Update

---

**END OF CHECKLIST**

**Remember: The best way to save money is to build good habits!**  
**Check daily, audit weekly, review monthly. You've got this! 💪**