# 🌐 Network Fundamentals - Complete Guide

**Author:** DevOps Learning Path  
**Topic:** IP Addresses, Ports, DNS, Network Commands, /etc/hosts  
**Level:** Beginner to Intermediate  

---

## Table of Contents

1. [IP Addresses](#1-ip-addresses)
   - [localhost](#-localhost)
   - [127.0.0.1](#-127001)
   - [0.0.0.0](#-0000)
2. [Ports](#2-ports)
   - [What is a Port?](#-what-is-a-port)
   - [Well-Known Ports](#-well-known-ports)
3. [DNS](#3-dns)
   - [What is DNS?](#-what-is-dns)
   - [DNS Resolution Process](#-dns-resolution-process)
4. [Network Commands](#4-network-commands)
   - [ping](#-ping---test-connectivity)
   - [curl](#-curl---transfer-data)
   - [netstat](#-netstat---network-statistics)
   - [lsof](#-lsof---list-open-files)
5. [/etc/hosts File](#5-etchosts-file)
6. [Practical Examples](#-practical-examples)
7. [Summary](#-summary)

---

## 1️⃣ IP Addresses

### 📍 localhost

**`localhost`** = tên domain đại diện cho **máy tính của chính bạn**

```bash
# Tất cả đều trỏ đến máy bạn:
ping localhost
ping 127.0.0.1
ping ::1  # IPv6 version
```

**Use cases:**
- Test web app locally: `http://localhost:3000`
- Connect to local database: `mongodb://localhost:27017`
- Debug without internet

---

### 🔢 127.0.0.1

**`127.0.0.1`** = **loopback IP address** (địa chỉ vòng lại)

**Giải thích đơn giản:**
- Network packet đi ra và quay lại ngay máy bạn
- KHÔNG đi qua network card thật
- KHÔNG ra internet
- Dùng để test/debug

```bash
# Tất cả đều giống nhau:
curl http://localhost:3000
curl http://127.0.0.1:3000
curl http://127.0.0.2:3000  # Cũng là loopback!
# 127.0.0.0 đến 127.255.255.255 đều là loopback
```

**Ví dụ thực tế:**

```javascript
// server.js
const express = require('express');
const app = express();

// Listen on localhost only
app.listen(3000, 'localhost', () => {
  console.log('Server on http://localhost:3000');
});

// Chỉ truy cập được từ máy này:
// ✅ http://localhost:3000  → Works
// ✅ http://127.0.0.1:3000  → Works
// ❌ http://192.168.1.5:3000 → Không truy cập được từ máy khác
```

---

### 🌍 0.0.0.0

**`0.0.0.0`** = **ALL interfaces** (tất cả địa chỉ IP)

**Giải thích:**
- Server listen trên **TẤT CẢ** network interfaces
- Có thể truy cập qua:
  - `localhost`
  - `127.0.0.1` 
  - `192.168.x.x` (local network)
  - Public IP (nếu có)

```javascript
// Listen on ALL interfaces
app.listen(3000, '0.0.0.0', () => {
  console.log('Server accessible from anywhere');
});

// Bây giờ có thể truy cập qua:
// ✅ http://localhost:3000
// ✅ http://127.0.0.1:3000
// ✅ http://192.168.1.5:3000 (từ máy khác trong LAN)
// ✅ http://your-public-ip:3000 (từ internet, nếu có)
```

**So sánh:**

| Listen Address | Accessible From |
|----------------|-----------------|
| `localhost` | Chỉ máy này |
| `127.0.0.1` | Chỉ máy này |
| `0.0.0.0` | Máy này + LAN + Internet |
| `192.168.1.5` | Chỉ từ IP cụ thể đó |

**Tìm IP của máy bạn:**

```bash
# macOS
ifconfig | grep inet

# Output:
inet 127.0.0.1 netmask 0xff000000          # Loopback
inet 192.168.1.100 netmask 0xffffff00      # Local network IP
```

---

## 2️⃣ Ports (Cổng)

### 🚪 What is a Port?

**Port** = "cửa" để traffic vào/ra application

**Ví dụ thực tế:**
- Một tòa nhà (IP address) có nhiều căn hộ (ports)
- Mỗi căn hộ là một service khác nhau

```
192.168.1.100:80   → Web server
192.168.1.100:22   → SSH
192.168.1.100:3000 → Node.js app
```

---

### 📋 Well-Known Ports

**Port ranges:**
- **0-1023**: Well-known ports (system/admin only)
- **1024-49151**: Registered ports
- **49152-65535**: Dynamic/Private ports

**Important ports:**

| Port | Service | Description |
|------|---------|-------------|
| **20, 21** | FTP | File transfer |
| **22** | SSH | Secure shell (remote login) |
| **23** | Telnet | Unencrypted remote login |
| **25** | SMTP | Email sending |
| **53** | DNS | Domain name resolution |
| **80** | HTTP | Web traffic (không mã hóa) |
| **443** | HTTPS | Secure web traffic (SSL/TLS) |
| **3000** | Development | Node.js dev server (convention) |
| **3306** | MySQL | Database |
| **5432** | PostgreSQL | Database |
| **6379** | Redis | Cache |
| **8080** | HTTP Alt | Alternative HTTP (proxy/dev) |
| **27017** | MongoDB | Database |

**Thực hành:**

```bash
# Check port đang được dùng bởi process nào
lsof -i :3000
lsof -i :80
lsof -i :443

# Netstat (older way)
netstat -an | grep 3000

# Kill process on port
lsof -ti:3000 | xargs kill
```

**Example output:**

```bash
$ lsof -i :3000
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 user   23u  IPv4 0x1234      0t0  TCP localhost:3000 (LISTEN)
```

---

## 3️⃣ DNS (Domain Name System)

### 🔤 What is DNS?

**DNS** = "Danh bạ điện thoại của Internet"

Chuyển đổi:
```
google.com  →  142.250.185.46
github.com  →  140.82.121.4
```

### 🔄 DNS Resolution Process

```
1. Browser: "google.com là gì?"
   ↓
2. Check /etc/hosts file
   ↓
3. Check DNS cache
   ↓
4. Ask DNS server (8.8.8.8 - Google DNS)
   ↓
5. DNS returns: 142.250.185.46
   ↓
6. Browser connects to that IP
```

**Test DNS:**

```bash
# Lookup IP của domain
nslookup google.com

# Output:
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	google.com
Address: 142.250.185.46

# Hoặc dùng dig (detailed)
dig google.com

# Hoặc host (simple)
host google.com
```

**DNS Records Types:**

```bash
# A Record: Domain → IPv4
google.com  →  142.250.185.46

# AAAA Record: Domain → IPv6
google.com  →  2404:6800:4003:c00::71

# CNAME: Alias
www.example.com  →  example.com

# MX: Mail server
example.com  →  mail.example.com

# TXT: Text data (SPF, DKIM, etc.)
```

---

## 4️⃣ Network Commands

### 🏓 `ping` - Test connectivity

**Kiểm tra kết nối đến host**

```bash
# Ping domain
ping google.com

# Output:
PING google.com (142.250.185.46): 56 data bytes
64 bytes from 142.250.185.46: icmp_seq=0 ttl=117 time=10.5 ms
64 bytes from 142.250.185.46: icmp_seq=1 ttl=117 time=9.8 ms
^C
--- google.com ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 9.8/10.15/10.5/0.35 ms

# Ping IP address
ping 8.8.8.8

# Ping with count
ping -c 4 google.com  # Chỉ ping 4 lần

# Ping localhost
ping localhost
ping 127.0.0.1
```

**Giải thích output:**
- **ttl (Time To Live)**: số "hops" còn lại
- **time**: latency (ms) - càng thấp càng tốt
- **packet loss**: % packets bị mất

---

### 🌐 `curl` - Transfer data from/to server

**Swiss army knife của HTTP requests**

```bash
# Simple GET request
curl http://localhost:3000

# GET với headers
curl -i http://localhost:3000
# -i = include response headers

# GET với verbose (debug)
curl -v http://localhost:3000
# -v = verbose (shows request + response)

# POST request
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# POST với file
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/file.jpg"

# Follow redirects
curl -L http://example.com
# -L = follow redirects

# Save to file
curl http://example.com/file.zip -o file.zip

# Download with progress bar
curl -# -O http://example.com/bigfile.zip

# Test API with authentication
curl -u username:password http://api.example.com/data

# Check response time
curl -w "@curl-format.txt" -o /dev/null -s http://example.com

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_total:  %{time_total}\n
```

**Common options:**

| Option | Meaning |
|--------|---------|
| `-X` | HTTP method (GET, POST, PUT, DELETE) |
| `-H` | Add header |
| `-d` | Data for POST/PUT |
| `-i` | Include headers in output |
| `-v` | Verbose (debug) |
| `-o` | Output to file |
| `-L` | Follow redirects |
| `-u` | Username:password |
| `-s` | Silent (no progress) |

---

### 📊 `netstat` - Network statistics

**Show network connections và listening ports**

```bash
# Show all listening ports
netstat -an | grep LISTEN

# Show TCP connections
netstat -an -p tcp

# Show UDP connections
netstat -an -p udp

# Show with process names (need sudo on macOS)
sudo netstat -anv | grep LISTEN

# Find what's using port 3000
netstat -an | grep 3000
```

**Example output:**

```
tcp4  0  0  127.0.0.1.3000   *.*     LISTEN
tcp4  0  0  *.80             *.*     LISTEN
tcp4  0  0  *.22             *.*     LISTEN
```

**Columns:**
- **Proto**: protocol (tcp4, tcp6, udp)
- **Recv-Q**: receive queue
- **Send-Q**: send queue
- **Local Address**: your machine
- **Foreign Address**: remote machine
- **State**: LISTEN, ESTABLISHED, etc.

---

### 🔍 `lsof` - List Open Files

**List open files including network connections** (macOS/Linux)

```bash
# List all network connections
lsof -i

# Check specific port
lsof -i :3000
lsof -i :80

# Check all ports used by process name
lsof -i -P | grep node

# Check what user is using
lsof -u username

# Check TCP connections
lsof -i tcp

# Check UDP connections
lsof -i udp

# Get PID only
lsof -ti :3000

# Kill process on port (combine with kill)
kill $(lsof -ti :3000)
# Or force kill
kill -9 $(lsof -ti :3000)
```

**Example output:**

```bash
$ lsof -i :3000
COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    12345 user   23u  IPv4 0x12ab34cd56ef      0t0  TCP localhost:3000 (LISTEN)
```

**Columns explained:**
- **COMMAND**: program name
- **PID**: Process ID
- **USER**: who owns it
- **FD**: File Descriptor
- **TYPE**: IPv4, IPv6
- **NODE**: TCP, UDP
- **NAME**: address:port

---

## 5️⃣ `/etc/hosts` File

### 📝 Hosts File là gì?

**Local DNS override** - map domain names to IP addresses **TRƯỚC KHI** hỏi DNS server

**Location:**
- macOS/Linux: `/etc/hosts`
- Windows: `C:\Windows\System32\drivers\etc\hosts`

### 🔧 Cách Edit

```bash
# macOS/Linux - cần sudo
sudo nano /etc/hosts

# Hoặc với vim
sudo vim /etc/hosts

# Hoặc với VS Code
sudo code /etc/hosts
```

### 📄 Format

```bash
# /etc/hosts format:
# IP_ADDRESS    HOSTNAME    [ALIASES...]

# Loopback
127.0.0.1       localhost
::1             localhost

# Custom mappings
127.0.0.1       myapp.local
127.0.0.1       api.myapp.local
127.0.0.1       admin.myapp.local

# Block websites (redirect to nowhere)
0.0.0.0         facebook.com
0.0.0.0         twitter.com

# Local development
192.168.1.100   dev-server.local
192.168.1.101   staging-server.local

# Minikube (Kubernetes)
192.168.49.2    myapp.local
```

### 🎯 Use Cases

#### 1. Local Development

```bash
# /etc/hosts
127.0.0.1  myapp.local
127.0.0.1  api.myapp.local
```

```javascript
// server.js - Run on port 3000
app.listen(3000, () => {
  console.log('Server on http://myapp.local:3000');
});
```

Now access:
- `http://myapp.local:3000` thay vì `http://localhost:3000`
- `http://api.myapp.local:3000/users`

#### 2. Multi-service Development

```bash
# /etc/hosts
127.0.0.1  frontend.local
127.0.0.1  api.local
127.0.0.1  admin.local
```

```javascript
// frontend server (port 3000)
// backend server (port 3001)
// admin server (port 3002)

// Frontend can call:
fetch('http://api.local:3001/users')
```

#### 3. Kubernetes Ingress Testing

```bash
# Get Minikube IP
minikube ip
# Output: 192.168.49.2

# Add to /etc/hosts
192.168.49.2  myapp.local
192.168.49.2  api.myapp.local
```

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
  - host: api.myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 80
```

Now access: `http://myapp.local` và `http://api.myapp.local`

#### 4. Block Distractions

```bash
# /etc/hosts
0.0.0.0  facebook.com
0.0.0.0  www.facebook.com
0.0.0.0  twitter.com
0.0.0.0  www.twitter.com
0.0.0.0  reddit.com
0.0.0.0  www.reddit.com
```

### ⚠️ Important Notes

1. **Need sudo** to edit
2. **No port numbers** - chỉ có domain
3. **Changes immediate** - không cần restart
4. **Flush DNS cache** sau khi edit:

```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

5. **Comment lines** with `#`:

```bash
# This is a comment
# 127.0.0.1  disabled.local   ← This line is ignored
127.0.0.1    active.local      ← This line works
```

---

## 🎯 Practical Examples

### Example 1: Test Local API

```bash
# Start Node.js server
node server.js  # Running on port 3000

# Test with different methods
curl http://localhost:3000
curl http://127.0.0.1:3000
curl http://0.0.0.0:3000

# Check what's listening
lsof -i :3000
netstat -an | grep 3000

# Test connectivity
ping localhost
```

### Example 2: Debugging Network Issues

```bash
# 1. Check if server is running
lsof -i :3000

# 2. Test if port is accessible
curl http://localhost:3000

# 3. Check DNS resolution
nslookup myapp.local

# 4. Check routing
ping myapp.local

# 5. Verbose curl for details
curl -v http://localhost:3000
```

### Example 3: Multi-service Setup

```bash
# /etc/hosts
127.0.0.1  frontend.local
127.0.0.1  api.local
127.0.0.1  db.local

# Start services
# Frontend on :3000
# API on :3001
# DB on :5432

# Test each service
curl http://frontend.local:3000
curl http://api.local:3001/health
psql -h db.local -U postgres
```

### Example 4: Complete Network Troubleshooting Workflow

```bash
# Step 1: Identify the problem
ping myapp.local
# If fails, DNS issue

# Step 2: Check DNS resolution
nslookup myapp.local
host myapp.local
# Verify correct IP returned

# Step 3: Check if port is open
lsof -i :3000
netstat -an | grep 3000
# Verify service is listening

# Step 4: Test connection
curl -v http://myapp.local:3000
# Verbose output shows connection details

# Step 5: Check firewall/security
# Ensure no firewall blocking

# Step 6: Check logs
tail -f /var/log/myapp.log
# Or application-specific logs
```

### Example 5: Multi-Instance Load Testing

```bash
# Start 3 instances
PORT=3000 node server.js &
PORT=3001 node server.js &
PORT=3002 node server.js &

# Verify all running
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Or all at once
lsof -i :3000-3002

# Test each instance
for port in 3000 3001 3002; do
  echo "Testing port $port"
  curl http://localhost:$port
done

# Monitor all
ps aux | grep node
```

---

## 📚 Summary Table

| Concept | Purpose | Example |
|---------|---------|---------|
| **localhost** | Your machine | `http://localhost:3000` |
| **127.0.0.1** | Loopback IP | `ping 127.0.0.1` |
| **0.0.0.0** | All interfaces | `app.listen(3000, '0.0.0.0')` |
| **Port** | Service endpoint | `:80`, `:443`, `:3000` |
| **DNS** | Domain → IP | `google.com → 142.250.185.46` |
| **ping** | Test connectivity | `ping google.com` |
| **curl** | HTTP requests | `curl http://api.com` |
| **netstat** | Network stats | `netstat -an` |
| **lsof** | Open files/ports | `lsof -i :3000` |
| **/etc/hosts** | Local DNS | `127.0.0.1 myapp.local` |

---

## 🔥 Quick Reference Commands

### Check if port is in use:
```bash
lsof -i :3000
netstat -an | grep 3000
```

### Kill process on port:
```bash
kill $(lsof -ti :3000)
kill -9 $(lsof -ti :3000)  # Force kill
```

### Test API endpoint:
```bash
curl http://localhost:3000
curl -i http://localhost:3000  # With headers
curl -v http://localhost:3000  # Verbose
```

### Check DNS resolution:
```bash
nslookup domain.com
host domain.com
dig domain.com
```

### Edit hosts file:
```bash
sudo nano /etc/hosts
# Add: 127.0.0.1  myapp.local
sudo dscacheutil -flushcache  # Flush cache
```

### Find your IP:
```bash
ifconfig | grep inet
# Or
ipconfig getifaddr en0  # macOS WiFi
```

---

## 🎓 Learning Checklist

After completing this guide, you should be able to:

- [ ] Explain the difference between localhost, 127.0.0.1, and 0.0.0.0
- [ ] Understand what ports are and identify well-known ports
- [ ] Explain how DNS works and resolution process
- [ ] Use ping to test connectivity
- [ ] Use curl to make HTTP requests
- [ ] Use netstat to view network connections
- [ ] Use lsof to find what's using a port
- [ ] Edit /etc/hosts file to create local domains
- [ ] Troubleshoot basic networking issues
- [ ] Set up multi-service local development environment

---

## 📖 Additional Resources

### Documentation
- [RFC 1918 - Private IP Addresses](https://tools.ietf.org/html/rfc1918)
- [RFC 6761 - localhost](https://tools.ietf.org/html/rfc6761)
- [curl Documentation](https://curl.se/docs/)
- [DNS Explained](https://www.cloudflare.com/learning/dns/what-is-dns/)

### Tools
- **Network Debugging:** Wireshark, tcpdump
- **API Testing:** Postman, Insomnia
- **DNS Tools:** dig, nslookup, host
- **Port Scanning:** nmap

### Practice
- Set up local development with custom domains
- Create multi-service architecture locally
- Practice debugging network issues
- Build a simple load balancer

---

## ❓ Troubleshooting Common Issues

### Issue: "Port already in use"
```bash
# Find and kill process
lsof -ti :3000 | xargs kill -9
```

### Issue: "Cannot access via domain"
```bash
# Check /etc/hosts
cat /etc/hosts | grep myapp.local

# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Issue: "Connection refused"
```bash
# Check if service is running
lsof -i :3000

# Check if listening on correct interface
netstat -an | grep 3000

# Try verbose curl
curl -v http://localhost:3000
```

### Issue: "DNS resolution fails"
```bash
# Test DNS servers
nslookup google.com 8.8.8.8
nslookup google.com 1.1.1.1

# Check /etc/resolv.conf
cat /etc/resolv.conf
```

---

**End of Guide** 🎉

**Last Updated:** December 2024  
**Version:** 1.0  

*Happy Networking!* 🚀