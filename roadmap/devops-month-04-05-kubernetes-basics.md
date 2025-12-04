# Tháng 4-5: Kubernetes Basics & Container Orchestration

> **Prerequisites:** Hoàn thành Tháng 1-3 (Docker, CI/CD)
> **Focus:** Kubernetes fundamentals, local development, basic deployments
> **Main Tools:** Kubernetes, Minikube, kubectl, Helm

---

## Mục Tiêu Tháng 4-5

Sau 2 tháng này, bạn sẽ:
- [ ] Hiểu kiến trúc và concepts của Kubernetes
- [ ] Sử dụng kubectl thành thạo
- [ ] Deploy applications lên K8s cluster
- [ ] Quản lý configurations và secrets
- [ ] Understand networking và services trong K8s
- [ ] Use Helm để package applications
- [ ] Debug issues trong K8s

---

# THÁNG 4

# Tuần 1: Kubernetes Fundamentals

## Học - Why Kubernetes?

### Container Orchestration Problems
- [ ] Scaling containers manually is tedious
- [ ] No built-in load balancing
- [ ] No self-healing capabilities
- [ ] Complex networking between containers
- [ ] Manual configuration management
- [ ] Zero-downtime deployment challenges

### Kubernetes Solutions
- [ ] Automated scaling (horizontal & vertical)
- [ ] Built-in load balancing
- [ ] Self-healing: restart failed containers
- [ ] Service discovery & DNS
- [ ] ConfigMaps & Secrets management
- [ ] Rolling updates & rollbacks

### Kubernetes Architecture
- [ ] **Control Plane (Master):**
  - API Server: central management
  - Scheduler: pod placement
  - Controller Manager: maintain desired state
  - etcd: cluster data store
- [ ] **Worker Nodes:**
  - Kubelet: manage pods
  - Container Runtime: Docker/containerd
  - kube-proxy: networking

### Core Concepts
- [ ] **Pod:** smallest deployable unit (1+ containers)
- [ ] **ReplicaSet:** maintain pod replicas
- [ ] **Deployment:** declarative updates
- [ ] **Service:** stable networking
- [ ] **Namespace:** virtual clusters
- [ ] **ConfigMap:** configuration data
- [ ] **Secret:** sensitive data
- [ ] **Volume:** persistent storage

## Thực Hành - Local Kubernetes Setup

### Install Tools trên macOS
- [ ] Install kubectl:
  ```bash
  brew install kubectl
  kubectl version --client
  ```

- [ ] Install Minikube:
  ```bash
  brew install minikube
  minikube version
  ```

- [ ] Install Docker Desktop (nếu chưa có)
  ```bash
  brew install --cask docker
  ```

- [ ] Install k9s (terminal UI):
  ```bash
  brew install derailed/k9s/k9s
  ```

### Start Local Cluster
- [ ] Start Minikube:
  ```bash
  minikube start --driver=docker --cpus=4 --memory=8192
  ```

- [ ] Verify cluster:
  ```bash
  kubectl cluster-info
  kubectl get nodes
  ```

- [ ] Access Kubernetes dashboard:
  ```bash
  minikube dashboard
  ```

### kubectl Basics
- [ ] Get cluster information:
  ```bash
  kubectl cluster-info
  kubectl get nodes
  kubectl describe node minikube
  ```

- [ ] Explore namespaces:
  ```bash
  kubectl get namespaces
  kubectl get pods --all-namespaces
  ```

- [ ] Set default namespace:
  ```bash
  kubectl config set-context --current --namespace=default
  ```

## Thực Hành - First Pod

### Create Pod with kubectl run
- [ ] Run nginx pod:
  ```bash
  kubectl run nginx --image=nginx:latest
  kubectl get pods
  kubectl describe pod nginx
  ```

- [ ] View logs:
  ```bash
  kubectl logs nginx
  kubectl logs -f nginx  # follow logs
  ```

- [ ] Execute commands:
  ```bash
  kubectl exec nginx -- ls /usr/share/nginx/html
  kubectl exec -it nginx -- /bin/bash
  ```

- [ ] Delete pod:
  ```bash
  kubectl delete pod nginx
  ```

### Create Pod with YAML
- [ ] Create `pod.yaml`:
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: nodejs-app
    labels:
      app: nodejs
  spec:
    containers:
    - name: nodejs
      image: node:18-alpine
      command: ['node', '-e', 'require("http").createServer((req, res) => res.end("Hello K8s")).listen(3000)']
      ports:
      - containerPort: 3000
  ```

- [ ] Apply configuration:
  ```bash
  kubectl apply -f pod.yaml
  kubectl get pods
  kubectl describe pod nodejs-app
  ```

- [ ] Port-forward to access:
  ```bash
  kubectl port-forward pod/nodejs-app 3000:3000
  # Visit http://localhost:3000
  ```

- [ ] Clean up:
  ```bash
  kubectl delete -f pod.yaml
  ```

## Thực Hành - Labels & Selectors

### Working with Labels
- [ ] Add labels to pods:
  ```yaml
  metadata:
    labels:
      app: nodejs
      environment: dev
      tier: backend
  ```

- [ ] Query by labels:
  ```bash
  kubectl get pods -l app=nodejs
  kubectl get pods -l environment=dev
  kubectl get pods -l 'tier in (backend,frontend)'
  ```

- [ ] Add/remove labels:
  ```bash
  kubectl label pod nodejs-app version=v1
  kubectl label pod nodejs-app version-  # remove label
  ```

## Mini Project Week 1
- [ ] Setup local Kubernetes cluster với Minikube
- [ ] Deploy 3 different pods:
  - Nginx web server
  - Node.js API
  - MongoDB database
- [ ] Use labels để organize pods
- [ ] Practice kubectl commands:
  - get, describe, logs, exec
  - Port-forwarding để access services
- [ ] Create YAML manifests cho all resources

---

# Tuần 2: Deployments & ReplicaSets

## Học - Deployments

### Why Deployments?
- [ ] Pods are ephemeral (temporary)
- [ ] No automatic restart on failure
- [ ] No scaling capabilities
- [ ] No rolling updates
- [ ] Deployments solve all these issues

### Deployment Features
- [ ] Maintain desired replica count
- [ ] Self-healing: replace failed pods
- [ ] Scaling: horizontal pod autoscaler
- [ ] Rolling updates: zero-downtime
- [ ] Rollback: revert to previous versions
- [ ] Declarative: desired state management

### ReplicaSets
- [ ] Managed by Deployments
- [ ] Ensure specified number of pods running
- [ ] Rarely created directly
- [ ] Use pod templates

## Thực Hành - Create Deployments

### Simple Deployment
- [ ] Create `deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nodejs-deployment
    labels:
      app: nodejs
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: nodejs
    template:
      metadata:
        labels:
          app: nodejs
      spec:
        containers:
        - name: nodejs
          image: node:18-alpine
          ports:
          - containerPort: 3000
          command: ['node', '-e']
          args:
          - |
            const http = require('http');
            const server = http.createServer((req, res) => {
              res.end(`Hello from pod: ${process.env.HOSTNAME}\n`);
            });
            server.listen(3000, () => console.log('Server running on 3000'));
  ```

- [ ] Apply deployment:
  ```bash
  kubectl apply -f deployment.yaml
  kubectl get deployments
  kubectl get replicasets
  kubectl get pods
  ```

- [ ] Describe deployment:
  ```bash
  kubectl describe deployment nodejs-deployment
  ```

### Scaling Deployments
- [ ] Scale up:
  ```bash
  kubectl scale deployment nodejs-deployment --replicas=5
  kubectl get pods -w  # watch pods being created
  ```

- [ ] Scale down:
  ```bash
  kubectl scale deployment nodejs-deployment --replicas=2
  ```

- [ ] Autoscaling (preview):
  ```bash
  kubectl autoscale deployment nodejs-deployment --min=2 --max=10 --cpu-percent=80
  ```

### Testing Self-Healing
- [ ] Delete a pod:
  ```bash
  kubectl get pods
  kubectl delete pod nodejs-deployment-xxxxx
  kubectl get pods  # notice new pod created automatically
  ```

- [ ] Watch replacement:
  ```bash
  kubectl get pods -w
  # In another terminal:
  kubectl delete pod <pod-name>
  ```

## Thực Hành - Rolling Updates

### Update Deployment
- [ ] Update image version:
  ```bash
  kubectl set image deployment/nodejs-deployment nodejs=node:20-alpine
  ```

- [ ] Watch rollout:
  ```bash
  kubectl rollout status deployment/nodejs-deployment
  kubectl get pods -w
  ```

- [ ] View rollout history:
  ```bash
  kubectl rollout history deployment/nodejs-deployment
  ```

### Update Strategy
- [ ] Configure rolling update:
  ```yaml
  spec:
    replicas: 5
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1        # max pods above desired
        maxUnavailable: 1  # max pods unavailable
  ```

- [ ] Apply and watch:
  ```bash
  kubectl apply -f deployment.yaml
  kubectl rollout status deployment/nodejs-deployment
  ```

### Rollback Deployment
- [ ] Rollback to previous version:
  ```bash
  kubectl rollout undo deployment/nodejs-deployment
  ```

- [ ] Rollback to specific revision:
  ```bash
  kubectl rollout history deployment/nodejs-deployment
  kubectl rollout undo deployment/nodejs-deployment --to-revision=2
  ```

## Thực Hành - Deployment với Real App

### Express API Deployment
- [ ] Build Docker image:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

- [ ] Push to Docker Hub:
  ```bash
  docker build -t username/myapi:v1 .
  docker push username/myapi:v1
  ```

- [ ] Create deployment:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapi
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: myapi
    template:
      metadata:
        labels:
          app: myapi
          version: v1
      spec:
        containers:
        - name: myapi
          image: username/myapi:v1
          ports:
          - containerPort: 3000
          env:
          - name: NODE_ENV
            value: production
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "200m"
  ```

- [ ] Deploy and test:
  ```bash
  kubectl apply -f deployment.yaml
  kubectl get pods
  kubectl logs -f <pod-name>
  ```

## Mini Project Week 2
- [ ] Create Express API với multiple endpoints
- [ ] Dockerize application
- [ ] Create Kubernetes Deployment với:
  - 3 replicas
  - Resource limits
  - Environment variables
  - Health checks (coming in week 3)
  - Rolling update strategy
- [ ] Test scaling: 3 → 6 → 3 replicas
- [ ] Test rolling update: v1 → v2
- [ ] Test rollback: v2 → v1
- [ ] Test self-healing: delete pods

---

# Tuần 3: Services & Networking

## Học - Kubernetes Services

### Why Services?
- [ ] Pods have dynamic IPs (change on restart)
- [ ] Need stable endpoint for communication
- [ ] Load balancing across pods
- [ ] Service discovery

### Service Types
- [ ] **ClusterIP (default):** internal cluster access
- [ ] **NodePort:** expose on node IP:port
- [ ] **LoadBalancer:** cloud provider load balancer
- [ ] **ExternalName:** DNS CNAME record

### Service Discovery
- [ ] DNS: `<service-name>.<namespace>.svc.cluster.local`
- [ ] Environment variables
- [ ] Service selectors match pod labels

## Thực Hành - ClusterIP Service

### Internal Service
- [ ] Create `service.yaml`:
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: myapi-service
  spec:
    type: ClusterIP
    selector:
      app: myapi
    ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  ```

- [ ] Apply service:
  ```bash
  kubectl apply -f service.yaml
  kubectl get services
  kubectl describe service myapi-service
  ```

- [ ] Get service endpoint:
  ```bash
  kubectl get endpoints myapi-service
  ```

### Test Service
- [ ] Create test pod:
  ```bash
  kubectl run test --image=busybox:1.28 --rm -it --restart=Never -- sh
  # Inside pod:
  wget -O- myapi-service
  nslookup myapi-service
  exit
  ```

- [ ] DNS resolution:
  ```bash
  # From another pod:
  curl http://myapi-service
  curl http://myapi-service.default.svc.cluster.local
  ```

## Thực Hành - NodePort Service

### Expose Externally
- [ ] Create NodePort service:
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: myapi-nodeport
  spec:
    type: NodePort
    selector:
      app: myapi
    ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      nodePort: 30080  # optional, 30000-32767
  ```

- [ ] Access service:
  ```bash
  kubectl apply -f service-nodeport.yaml
  kubectl get service myapi-nodeport
  minikube service myapi-nodeport  # opens in browser
  ```

- [ ] Get URL:
  ```bash
  minikube service myapi-nodeport --url
  curl $(minikube service myapi-nodeport --url)
  ```

## Thực Hành - LoadBalancer (Minikube)

### LoadBalancer Service
- [ ] Create service:
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: myapi-lb
  spec:
    type: LoadBalancer
    selector:
      app: myapi
    ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  ```

- [ ] Apply and tunnel:
  ```bash
  kubectl apply -f service-lb.yaml
  minikube tunnel  # run in separate terminal
  kubectl get service myapi-lb  # get EXTERNAL-IP
  curl http://<EXTERNAL-IP>
  ```

## Thực Hành - Multi-Tier Application

### Backend Service (API)
- [ ] `backend-deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: backend
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: backend
    template:
      metadata:
        labels:
          app: backend
      spec:
        containers:
        - name: api
          image: username/backend:v1
          ports:
          - containerPort: 3000
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: backend-service
  spec:
    selector:
      app: backend
    ports:
    - port: 80
      targetPort: 3000
  ```

### Frontend Service
- [ ] `frontend-deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: frontend
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: frontend
    template:
      metadata:
        labels:
          app: frontend
      spec:
        containers:
        - name: web
          image: username/frontend:v1
          ports:
          - containerPort: 80
          env:
          - name: API_URL
            value: http://backend-service
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: frontend-service
  spec:
    type: LoadBalancer
    selector:
      app: frontend
    ports:
    - port: 80
      targetPort: 80
  ```

### Deploy Full Stack
- [ ] Apply all:
  ```bash
  kubectl apply -f backend-deployment.yaml
  kubectl apply -f frontend-deployment.yaml
  kubectl get all
  ```

- [ ] Test connectivity:
  ```bash
  minikube tunnel
  curl http://<frontend-external-ip>
  ```

## Mini Project Week 3
- [ ] Three-tier application:
  - Frontend (React/Vue)
  - Backend API (Express)
  - Database (MongoDB)
- [ ] Services:
  - Frontend: LoadBalancer
  - Backend: ClusterIP
  - Database: ClusterIP
- [ ] Test:
  - Frontend can reach backend
  - Backend can reach database
  - External access via LoadBalancer
- [ ] Verify service discovery with DNS

---

# Tuần 4: ConfigMaps, Secrets & Volumes

## Học - Configuration Management

### ConfigMaps
- [ ] Store non-sensitive configuration
- [ ] Key-value pairs or files
- [ ] Decouple config from image
- [ ] Can be updated without rebuild

### Secrets
- [ ] Store sensitive data (passwords, tokens)
- [ ] Base64 encoded (not encrypted!)
- [ ] Better: use external secret management
- [ ] Mount as files or environment variables

### Volumes
- [ ] Ephemeral storage: emptyDir
- [ ] Persistent storage: PersistentVolume
- [ ] Cloud storage: AWS EBS, GCP PD
- [ ] ConfigMap/Secret volumes

## Thực Hành - ConfigMaps

### Create from Literal
- [ ] Create ConfigMap:
  ```bash
  kubectl create configmap app-config \
    --from-literal=APP_ENV=production \
    --from-literal=LOG_LEVEL=info
  ```

- [ ] View ConfigMap:
  ```bash
  kubectl get configmap app-config -o yaml
  kubectl describe configmap app-config
  ```

### Create from File
- [ ] Create config file `app.properties`:
  ```properties
  database.host=mongodb-service
  database.port=27017
  database.name=myapp
  cache.ttl=3600
  ```

- [ ] Create ConfigMap:
  ```bash
  kubectl create configmap app-properties --from-file=app.properties
  ```

### Use in Deployment
- [ ] Environment variables:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapi
  spec:
    template:
      spec:
        containers:
        - name: api
          image: myapi:v1
          envFrom:
          - configMapRef:
              name: app-config
          env:
          - name: DB_HOST
            valueFrom:
              configMapKeyRef:
                name: app-properties
                key: database.host
  ```

- [ ] Mount as volume:
  ```yaml
  spec:
    containers:
    - name: api
      image: myapi:v1
      volumeMounts:
      - name: config
        mountPath: /etc/config
        readOnly: true
    volumes:
    - name: config
      configMap:
        name: app-properties
  ```

## Thực Hành - Secrets

### Create Secret
- [ ] From literal:
  ```bash
  kubectl create secret generic db-secret \
    --from-literal=username=admin \
    --from-literal=password=secretpass123
  ```

- [ ] From file:
  ```bash
  echo -n 'admin' > username.txt
  echo -n 'secretpass123' > password.txt
  kubectl create secret generic db-secret --from-file=username.txt --from-file=password.txt
  rm username.txt password.txt
  ```

- [ ] From YAML (base64 encoded):
  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: db-secret
  type: Opaque
  data:
    username: YWRtaW4=  # echo -n 'admin' | base64
    password: c2VjcmV0cGFzczEyMw==
  ```

### Use Secrets
- [ ] As environment variables:
  ```yaml
  containers:
  - name: api
    image: myapi:v1
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
  ```

- [ ] As mounted files:
  ```yaml
  containers:
  - name: api
    image: myapi:v1
    volumeMounts:
    - name: secret
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret
    secret:
      secretName: db-secret
  ```

## Thực Hành - Persistent Volumes

### PersistentVolumeClaim
- [ ] Create PVC:
  ```yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: mongodb-pvc
  spec:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  ```

- [ ] Apply PVC:
  ```bash
  kubectl apply -f pvc.yaml
  kubectl get pvc
  ```

### Use in Deployment
- [ ] MongoDB with persistence:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: mongodb
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: mongodb
    template:
      metadata:
        labels:
          app: mongodb
      spec:
        containers:
        - name: mongodb
          image: mongo:6
          ports:
          - containerPort: 27017
          volumeMounts:
          - name: data
            mountPath: /data/db
          env:
          - name: MONGO_INITDB_ROOT_USERNAME
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: username
          - name: MONGO_INITDB_ROOT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: password
        volumes:
        - name: data
          persistentVolumeClaim:
            claimName: mongodb-pvc
  ```

### Test Persistence
- [ ] Deploy MongoDB
- [ ] Create data in database
- [ ] Delete pod:
  ```bash
  kubectl delete pod mongodb-xxxxx
  ```
- [ ] Verify data still exists in new pod

## Mini Project Week 4
- [ ] Full-stack application với configuration:
  - Frontend deployment
  - Backend API deployment  
  - MongoDB deployment với persistence
- [ ] ConfigMaps:
  - API URLs
  - Feature flags
  - Application settings
- [ ] Secrets:
  - Database credentials
  - API keys
  - JWT secrets
- [ ] Persistent storage:
  - MongoDB data persists
  - Upload files storage (optional)
- [ ] Test:
  - Update ConfigMap, pods reload
  - Rotate secrets
  - Delete pods, data persists

---

# THÁNG 5

# Tuần 1: Health Checks & Resource Management

## Học - Probes

### Probe Types
- [ ] **Liveness Probe:** is container alive?
- [ ] **Readiness Probe:** is container ready for traffic?
- [ ] **Startup Probe:** has container started? (slow startups)

### Probe Methods
- [ ] HTTP GET: check endpoint
- [ ] TCP Socket: check port
- [ ] Exec: run command

### Why Probes Matter
- [ ] Automatic restart of unhealthy containers
- [ ] Prevent traffic to not-ready pods
- [ ] Graceful startup for slow apps

## Thực Hành - Liveness Probes

### HTTP Liveness Probe
- [ ] Add to deployment:
  ```yaml
  containers:
  - name: api
    image: myapi:v1
    ports:
    - containerPort: 3000
    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
  ```

- [ ] Create health endpoint in app:
  ```javascript
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });
  ```

- [ ] Test liveness:
  ```bash
  kubectl describe pod <pod-name>  # check events
  kubectl get pod <pod-name> --watch
  ```

### Simulate Failure
- [ ] Break health endpoint:
  ```javascript
  let healthy = true;
  app.get('/health', (req, res) => {
    if (healthy) {
      res.status(200).json({ status: 'healthy' });
    } else {
      res.status(500).json({ status: 'unhealthy' });
    }
  });
  app.get('/break', (req, res) => {
    healthy = false;
    res.send('Health endpoint broken');
  });
  ```

- [ ] Trigger failure:
  ```bash
  kubectl exec <pod-name> -- curl localhost:3000/break
  kubectl get pods --watch  # observe restart
  ```

## Thực Hành - Readiness Probes

### Readiness Probe
- [ ] Add to deployment:
  ```yaml
  containers:
  - name: api
    image: myapi:v1
    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 3
      failureThreshold: 2
  ```

- [ ] Create readiness endpoint:
  ```javascript
  let ready = false;
  
  // Simulate async initialization
  setTimeout(() => {
    ready = true;
    console.log('App is ready');
  }, 15000);
  
  app.get('/ready', (req, res) => {
    if (ready) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready' });
    }
  });
  ```

### Test Readiness
- [ ] Deploy and watch:
  ```bash
  kubectl get pods --watch
  # Pod shows 0/1 READY until readiness succeeds
  ```

- [ ] Check service endpoints:
  ```bash
  kubectl get endpoints myapi-service
  # Only ready pods included
  ```

## Thực Hành - Resource Requests & Limits

### Resource Specifications
- [ ] Add to deployment:
  ```yaml
  containers:
  - name: api
    image: myapi:v1
    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "200m"
  ```

### Resource Units
- [ ] CPU:
  - `100m` = 0.1 CPU
  - `1000m` = 1 CPU
- [ ] Memory:
  - `128Mi` = 128 MiB
  - `1Gi` = 1 GiB

### View Resource Usage
- [ ] Install metrics server:
  ```bash
  minikube addons enable metrics-server
  ```

- [ ] View usage:
  ```bash
  kubectl top nodes
  kubectl top pods
  kubectl top pod <pod-name> --containers
  ```

### Test Resource Limits
- [ ] Create memory-hungry app:
  ```javascript
  app.get('/memory-leak', (req, res) => {
    const bigArray = [];
    setInterval(() => {
      bigArray.push(new Array(1000000));
    }, 100);
    res.send('Memory leak started');
  });
  ```

- [ ] Trigger and watch:
  ```bash
  kubectl exec <pod-name> -- curl localhost:3000/memory-leak
  kubectl get pods --watch  # pod will be OOMKilled
  ```

## Mini Project Week 1
- [ ] Update existing application với:
  - Liveness probe (health check)
  - Readiness probe (ready check)
  - Startup probe cho slow initialization
  - Resource requests và limits
- [ ] Implement health endpoints:
  - `/health`: basic health
  - `/ready`: readiness with dependencies
  - `/metrics`: basic metrics
- [ ] Test scenarios:
  - Unhealthy pod gets restarted
  - Not-ready pod removed from service
  - OOM pod gets killed and restarted
- [ ] Monitor với `kubectl top`

---

# Tuần 2: Ingress & Advanced Networking

## Học - Ingress

### What is Ingress?
- [ ] L7 (HTTP/HTTPS) load balancing
- [ ] Single entry point for cluster
- [ ] Path-based routing
- [ ] Host-based routing
- [ ] TLS termination

### Ingress vs Service
- [ ] Services: L4 (TCP/UDP) load balancing
- [ ] Ingress: L7 (HTTP) with advanced routing
- [ ] Ingress needs Ingress Controller

### Ingress Controllers
- [ ] Nginx Ingress Controller (popular)
- [ ] Traefik
- [ ] HAProxy
- [ ] Cloud-specific: ALB, GCE

## Thực Hành - Setup Ingress

### Enable Ingress on Minikube
- [ ] Enable addon:
  ```bash
  minikube addons enable ingress
  kubectl get pods -n ingress-nginx
  ```

- [ ] Verify controller:
  ```bash
  kubectl get svc -n ingress-nginx
  ```

### Create Ingress Resource
- [ ] Basic ingress:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myapp-ingress
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
  spec:
    rules:
    - host: myapp.local
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-service
              port:
                number: 80
  ```

- [ ] Apply ingress:
  ```bash
  kubectl apply -f ingress.yaml
  kubectl get ingress
  kubectl describe ingress myapp-ingress
  ```

### Test Ingress
- [ ] Add to `/etc/hosts`:
  ```bash
  echo "$(minikube ip) myapp.local" | sudo tee -a /etc/hosts
  ```

- [ ] Access application:
  ```bash
  curl http://myapp.local
  # hoặc mở browser: http://myapp.local
  ```

## Thực Hành - Path-Based Routing

### Multiple Services
- [ ] Create ingress với paths:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: app-ingress
  spec:
    rules:
    - host: myapp.local
      http:
        paths:
        - path: /api
          pathType: Prefix
          backend:
            service:
              name: backend-service
              port:
                number: 80
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-service
              port:
                number: 80
  ```

- [ ] Test routing:
  ```bash
  curl http://myapp.local/          # → frontend
  curl http://myapp.local/api/users # → backend
  ```

## Thực Hành - Host-Based Routing

### Multiple Hosts
- [ ] Multi-host ingress:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: multi-host-ingress
  spec:
    rules:
    - host: frontend.local
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-service
              port:
                number: 80
    - host: api.local
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: backend-service
              port:
                number: 80
  ```

- [ ] Update `/etc/hosts`:
  ```bash
  echo "$(minikube ip) frontend.local api.local" | sudo tee -a /etc/hosts
  ```

- [ ] Test:
  ```bash
  curl http://frontend.local
  curl http://api.local/users
  ```

## Thực Hành - TLS/HTTPS

### Create Self-Signed Certificate
- [ ] Generate certificate:
  ```bash
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout tls.key -out tls.crt \
    -subj "/CN=myapp.local/O=myapp.local"
  ```

- [ ] Create TLS secret:
  ```bash
  kubectl create secret tls myapp-tls \
    --cert=tls.crt \
    --key=tls.key
  ```

### TLS Ingress
- [ ] Update ingress:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myapp-ingress
  spec:
    tls:
    - hosts:
      - myapp.local
      secretName: myapp-tls
    rules:
    - host: myapp.local
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-service
              port:
                number: 80
  ```

- [ ] Test HTTPS:
  ```bash
  curl -k https://myapp.local  # -k to skip cert verification
  ```

## Mini Project Week 2
- [ ] Multi-service application:
  - Frontend (React)
  - API (Express)
  - Admin panel (separate app)
- [ ] Ingress configuration:
  - Path routing:
    - `/` → Frontend
    - `/api/*` → Backend API
    - `/admin/*` → Admin panel
  - Host routing (optional):
    - `app.local` → Frontend
    - `api.local` → API
  - TLS enabled
- [ ] Test all routes
- [ ] Monitor Ingress logs

---

# Tuần 3: Helm Package Manager

## Học - Helm Basics

### Why Helm?
- [ ] Package manager for Kubernetes
- [ ] Templating for YAML files
- [ ] Version management
- [ ] Easy upgrades and rollbacks
- [ ] Reusable charts

### Helm Concepts
- [ ] **Chart:** package of K8s resources
- [ ] **Release:** instance of a chart
- [ ] **Repository:** collection of charts
- [ ] **Values:** configuration parameters

### Helm Architecture
- [ ] Helm CLI
- [ ] Chart structure
- [ ] Templates + Values = Manifests

## Thực Hành - Install Helm

### Install Helm trên macOS
- [ ] Install with Homebrew:
  ```bash
  brew install helm
  helm version
  ```

- [ ] Add repositories:
  ```bash
  helm repo add stable https://charts.helm.sh/stable
  helm repo add bitnami https://charts.bitnami.com/bitnami
  helm repo update
  ```

- [ ] Search charts:
  ```bash
  helm search repo nginx
  helm search repo mysql
  ```

## Thực Hành - Deploy với Helm

### Install Chart
- [ ] Install nginx:
  ```bash
  helm install my-nginx bitnami/nginx
  kubectl get all
  ```

- [ ] Check release:
  ```bash
  helm list
  helm status my-nginx
  ```

- [ ] Uninstall:
  ```bash
  helm uninstall my-nginx
  ```

### Custom Values
- [ ] View default values:
  ```bash
  helm show values bitnami/nginx > values.yaml
  ```

- [ ] Edit `values.yaml`:
  ```yaml
  replicaCount: 3
  service:
    type: LoadBalancer
  ```

- [ ] Install with custom values:
  ```bash
  helm install my-nginx bitnami/nginx -f values.yaml
  ```

- [ ] Override specific values:
  ```bash
  helm install my-nginx bitnami/nginx \
    --set replicaCount=5 \
    --set service.type=LoadBalancer
  ```

## Thực Hành - Create Custom Chart

### Generate Chart
- [ ] Create chart structure:
  ```bash
  helm create myapp
  cd myapp
  tree
  ```

- [ ] Chart structure:
  ```
  myapp/
  ├── Chart.yaml        # chart metadata
  ├── values.yaml       # default values
  ├── templates/        # K8s manifests
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   ├── ingress.yaml
  │   └── _helpers.tpl  # template helpers
  └── charts/           # dependencies
  ```

### Customize Chart
- [ ] Edit `Chart.yaml`:
  ```yaml
  apiVersion: v2
  name: myapp
  description: My Node.js application
  type: application
  version: 0.1.0
  appVersion: "1.0"
  ```

- [ ] Edit `values.yaml`:
  ```yaml
  replicaCount: 3
  
  image:
    repository: username/myapp
    pullPolicy: IfNotPresent
    tag: "v1"
  
  service:
    type: ClusterIP
    port: 80
    targetPort: 3000
  
  ingress:
    enabled: true
    className: nginx
    hosts:
      - host: myapp.local
        paths:
          - path: /
            pathType: Prefix
  
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "200m"
  ```

- [ ] Edit `templates/deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: {{ include "myapp.fullname" . }}
  spec:
    replicas: {{ .Values.replicaCount }}
    selector:
      matchLabels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    template:
      metadata:
        labels:
          {{- include "myapp.selectorLabels" . | nindent 10 }}
      spec:
        containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
          - containerPort: {{ .Values.service.targetPort }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
  ```

### Deploy Custom Chart
- [ ] Lint chart:
  ```bash
  helm lint .
  ```

- [ ] Dry run:
  ```bash
  helm install myapp . --dry-run --debug
  ```

- [ ] Install:
  ```bash
  helm install myapp .
  kubectl get all
  ```

### Update Release
- [ ] Modify values:
  ```bash
  helm upgrade myapp . --set replicaCount=5
  ```

- [ ] Rollback:
  ```bash
  helm rollback myapp 1
  ```

- [ ] History:
  ```bash
  helm history myapp
  ```

## Thực Hành - Chart Dependencies

### Add Dependencies
- [ ] Edit `Chart.yaml`:
  ```yaml
  dependencies:
  - name: mongodb
    version: 13.x.x
    repository: https://charts.bitnami.com/bitnami
  ```

- [ ] Update dependencies:
  ```bash
  helm dependency update
  ```

- [ ] Override dependency values:
  ```yaml
  # values.yaml
  mongodb:
    auth:
      rootPassword: secretpass
    persistence:
      size: 1Gi
  ```

## Mini Project Week 3
- [ ] Create Helm chart cho full-stack app:
  - Frontend chart
  - Backend chart
  - Database dependency (MongoDB/PostgreSQL)
- [ ] Parameterize everything:
  - Image tags
  - Replica counts
  - Resource limits
  - Environment variables
  - Ingress configuration
- [ ] Multiple values files:
  - `values-dev.yaml`
  - `values-staging.yaml`
  - `values-prod.yaml`
- [ ] Test installations:
  - Dev: `helm install myapp -f values-dev.yaml .`
  - Staging: `helm install myapp -f values-staging.yaml .`
- [ ] Test upgrades và rollbacks

---

# Tuần 4: StatefulSets & Advanced Concepts

## Học - StatefulSets

### StatefulSets vs Deployments
- [ ] Deployments: stateless applications
- [ ] StatefulSets: stateful applications
- [ ] Stable network identities
- [ ] Ordered deployment/scaling
- [ ] Persistent storage per pod

### When to Use StatefulSets
- [ ] Databases (MongoDB, PostgreSQL, MySQL)
- [ ] Distributed systems (Kafka, Elasticsearch)
- [ ] Applications needing stable hostname
- [ ] Applications with ordered startup

### StatefulSet Features
- [ ] Predictable pod names: `pod-0`, `pod-1`, `pod-2`
- [ ] Stable DNS: `pod-0.service.namespace.svc.cluster.local`
- [ ] Ordered scaling: 0→1→2, 2→1→0
- [ ] Persistent volumes per pod

## Thực Hành - MongoDB StatefulSet

### Create StatefulSet
- [ ] `mongodb-statefulset.yaml`:
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: mongodb-headless
  spec:
    clusterIP: None  # headless service
    selector:
      app: mongodb
    ports:
    - port: 27017
  ---
  apiVersion: apps/v1
  kind: StatefulSet
  metadata:
    name: mongodb
  spec:
    serviceName: mongodb-headless
    replicas: 3
    selector:
      matchLabels:
        app: mongodb
    template:
      metadata:
        labels:
          app: mongodb
      spec:
        containers:
        - name: mongodb
          image: mongo:6
          ports:
          - containerPort: 27017
          volumeMounts:
          - name: data
            mountPath: /data/db
          env:
          - name: MONGO_INITDB_ROOT_USERNAME
            value: admin
          - name: MONGO_INITDB_ROOT_PASSWORD
            value: password
    volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
  ```

- [ ] Deploy:
  ```bash
  kubectl apply -f mongodb-statefulset.yaml
  kubectl get statefulsets
  kubectl get pods -w  # watch ordered creation
  ```

### Test StatefulSet
- [ ] Check pod names:
  ```bash
  kubectl get pods
  # mongodb-0, mongodb-1, mongodb-2
  ```

- [ ] Check DNS:
  ```bash
  kubectl run test --image=busybox:1.28 --rm -it --restart=Never -- sh
  nslookup mongodb-0.mongodb-headless
  nslookup mongodb-1.mongodb-headless
  ```

- [ ] Test persistence:
  ```bash
  kubectl delete pod mongodb-0
  # Pod recreates with same name and volume
  ```

## Thực Hành - DaemonSets

### What are DaemonSets?
- [ ] Run one pod per node
- [ ] Used for node-level services:
  - Log collectors
  - Monitoring agents
  - Network plugins

### Create DaemonSet
- [ ] `log-collector-daemonset.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: DaemonSet
  metadata:
    name: log-collector
  spec:
    selector:
      matchLabels:
        app: log-collector
    template:
      metadata:
        labels:
          app: log-collector
      spec:
        containers:
        - name: fluentd
          image: fluent/fluentd:latest
          volumeMounts:
          - name: varlog
            mountPath: /var/log
            readOnly: true
        volumes:
        - name: varlog
          hostPath:
            path: /var/log
  ```

- [ ] Deploy:
  ```bash
  kubectl apply -f log-collector-daemonset.yaml
  kubectl get daemonsets
  kubectl get pods -o wide
  ```

## Thực Hành - Jobs & CronJobs

### One-Time Jobs
- [ ] Create job:
  ```yaml
  apiVersion: batch/v1
  kind: Job
  metadata:
    name: database-backup
  spec:
    template:
      spec:
        containers:
        - name: backup
          image: mongo:6
          command: ['mongodump', '--host=mongodb-0.mongodb-headless', '--out=/backup']
          volumeMounts:
          - name: backup
            mountPath: /backup
        restartPolicy: Never
        volumes:
        - name: backup
          emptyDir: {}
  ```

- [ ] Run job:
  ```bash
  kubectl apply -f backup-job.yaml
  kubectl get jobs
  kubectl logs job/database-backup
  ```

### Scheduled CronJobs
- [ ] Create cronjob:
  ```yaml
  apiVersion: batch/v1
  kind: CronJob
  metadata:
    name: daily-backup
  spec:
    schedule: "0 2 * * *"  # Daily at 2 AM
    jobTemplate:
      spec:
        template:
          spec:
            containers:
            - name: backup
              image: mongo:6
              command: ['mongodump', '--host=mongodb-0.mongodb-headless']
            restartPolicy: OnFailure
  ```

- [ ] Deploy:
  ```bash
  kubectl apply -f cronjob.yaml
  kubectl get cronjobs
  ```

## Thực Hành - Namespace Organization

### Create Namespaces
- [ ] Development:
  ```bash
  kubectl create namespace development
  ```

- [ ] Staging:
  ```bash
  kubectl create namespace staging
  ```

- [ ] Production:
  ```bash
  kubectl create namespace production
  ```

### Deploy to Namespaces
- [ ] Deploy to specific namespace:
  ```bash
  kubectl apply -f deployment.yaml -n development
  kubectl get pods -n development
  ```

- [ ] Set default namespace:
  ```bash
  kubectl config set-context --current --namespace=development
  ```

### Resource Quotas
- [ ] Create quota:
  ```yaml
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: dev-quota
    namespace: development
  spec:
    hard:
      requests.cpu: "4"
      requests.memory: 8Gi
      pods: "20"
  ```

## Mini Project Week 4
- [ ] Production-ready MongoDB cluster:
  - StatefulSet với 3 replicas
  - Persistent volumes
  - Headless service
  - Backup CronJob
- [ ] Application deployment:
  - Multiple namespaces (dev/staging/prod)
  - Resource quotas per namespace
  - Network policies (basic)
- [ ] Monitoring DaemonSet:
  - Deploy log collector
  - Deploy metrics exporter
- [ ] Scheduled tasks:
  - Daily database backup
  - Weekly cleanup job

---

# CAPSTONE PROJECT: Production Kubernetes Application

## Objective
Deploy production-grade application lên Kubernetes với all best practices.

## Application Stack
- [ ] React frontend (3 replicas)
- [ ] Express API (5 replicas)
- [ ] MongoDB StatefulSet (3 replicas)
- [ ] Redis cache (1 replica)
- [ ] Nginx Ingress Controller

## Requirements Checklist

### [ ] 1. Infrastructure
- [ ] Multiple namespaces: dev, staging, prod
- [ ] Resource quotas per namespace
- [ ] Network policies (basic isolation)

### [ ] 2. Deployments
- [ ] Frontend Deployment:
  - 3 replicas
  - Rolling update strategy
  - Liveness & readiness probes
  - Resource limits
  - ConfigMap for API URL
- [ ] Backend Deployment:
  - 5 replicas
  - HPA (Horizontal Pod Autoscaler)
  - Health checks
  - Secrets for credentials
  - ConfigMap for settings
- [ ] MongoDB StatefulSet:
  - 3 replicas
  - Persistent volumes
  - Headless service
  - Init container for configuration
- [ ] Redis Deployment:
  - 1 replica
  - Persistent volume

### [ ] 3. Services & Networking
- [ ] ClusterIP services cho internal communication
- [ ] LoadBalancer service cho external access (optional)
- [ ] Ingress với:
  - Path-based routing
  - TLS enabled
  - Multiple hosts (optional)

### [ ] 4. Configuration Management
- [ ] ConfigMaps:
  - Application settings
  - Feature flags
  - Environment-specific configs
- [ ] Secrets:
  - Database credentials
  - API keys
  - TLS certificates
- [ ] Mounted as volumes và environment variables

### [ ] 5. Storage
- [ ] PersistentVolumeClaims for:
  - MongoDB data
  - Redis data
  - Upload storage
- [ ] Test data persistence after pod deletion

### [ ] 6. Health & Monitoring
- [ ] Liveness probes: all deployments
- [ ] Readiness probes: all deployments
- [ ] Resource monitoring: `kubectl top`
- [ ] Logging: centralized (optional)

### [ ] 7. Helm Chart
- [ ] Package entire application
- [ ] Parameterized values:
  - Image tags
  - Replica counts
  - Resource limits
  - Domain names
  - Feature toggles
- [ ] Multiple values files:
  - values-dev.yaml
  - values-staging.yaml
  - values-prod.yaml

### [ ] 8. Automation & CI/CD Integration
- [ ] GitHub Actions workflow:
  - Build Docker images
  - Push to registry
  - Update Helm values
  - Deploy to cluster (preview)
- [ ] Rolling updates tested
- [ ] Rollback procedure documented

### [ ] 9. Testing
- [ ] Functional tests:
  - All endpoints accessible
  - Database connectivity
  - Cache working
- [ ] Resilience tests:
  - Delete pods, verify recovery
  - Scale up/down
  - Simulate node failure
- [ ] Load tests (optional):
  - Test autoscaling

### [ ] 10. Documentation
- [ ] README with:
  - Architecture diagram
  - Setup instructions
  - Deployment process
  - Troubleshooting guide
- [ ] Helm chart documentation
- [ ] Operations runbook:
  - How to scale
  - How to update
  - How to rollback
  - How to backup/restore

## Bonus Challenges
- [ ] Multi-cluster deployment (dev + prod clusters)
- [ ] Service mesh preview (Istio/Linkerd)
- [ ] Observability stack (Prometheus + Grafana)
- [ ] GitOps with ArgoCD
- [ ] Blue-Green deployment
- [ ] Canary deployment

---

# Self-Assessment Checklist

After Month 4-5, you should be able to:

### Kubernetes Basics
- [ ] Explain K8s architecture
- [ ] Understand Pod, Deployment, Service concepts
- [ ] Use kubectl confidently
- [ ] Write YAML manifests from scratch
- [ ] Debug pod issues

### Deployments & Scaling
- [ ] Create and manage Deployments
- [ ] Perform rolling updates
- [ ] Rollback deployments
- [ ] Scale applications
- [ ] Implement self-healing

### Networking
- [ ] Create different service types
- [ ] Configure Ingress resources
- [ ] Understand DNS in K8s
- [ ] Setup TLS
- [ ] Debug networking issues

### Configuration
- [ ] Use ConfigMaps and Secrets
- [ ] Mount configurations
- [ ] Manage sensitive data
- [ ] Environment-specific configs

### Storage
- [ ] Create PersistentVolumeClaims
- [ ] Attach volumes to pods
- [ ] Understand storage classes
- [ ] Data persistence

### Advanced Resources
- [ ] Work with StatefulSets
- [ ] Create Jobs and CronJobs
- [ ] Use DaemonSets
- [ ] Organize with Namespaces

### Helm
- [ ] Install charts
- [ ] Customize values
- [ ] Create custom charts
- [ ] Manage releases
- [ ] Template YAML

---

# Resources

## Official Documentation
- [ ] Kubernetes Docs: https://kubernetes.io/docs
- [ ] kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet
- [ ] Helm Docs: https://helm.sh/docs

## Interactive Learning
- [ ] Kubernetes Playground: https://labs.play-with-k8s.com
- [ ] Katacoda Kubernetes: https://katacoda.com/courses/kubernetes
- [ ] K8s by Example: http://kubernetesbyexample.com

## Video Courses
- [ ] Kubernetes for Beginners (FreeCodeCamp)
- [ ] Kubernetes Tutorial (TechWorld with Nana)
- [ ] Certified Kubernetes Administrator (Udemy)

## Books
- [ ] Kubernetes Up & Running (O'Reilly)
- [ ] Kubernetes in Action (Manning)

## Tools
- [ ] k9s: https://k9scli.io
- [ ] kubectx/kubens: https://github.com/ahmetb/kubectx
- [ ] Lens: https://k8slens.dev

---

# Common Issues & Solutions

## Pods Not Starting
- [ ] Check image pull: `kubectl describe pod`
- [ ] Verify resources available: `kubectl top nodes`
- [ ] Check events: `kubectl get events --sort-by=.lastTimestamp`

## Services Not Accessible
- [ ] Verify selectors match: `kubectl describe service`
- [ ] Check endpoints: `kubectl get endpoints`
- [ ] Test DNS: `nslookup service-name`

## Storage Issues
- [ ] Check PVC status: `kubectl get pvc`
- [ ] Verify StorageClass: `kubectl get storageclass`
- [ ] Review pod events for mount errors

## Ingress Not Working
- [ ] Verify Ingress Controller running
- [ ] Check ingress resource: `kubectl describe ingress`
- [ ] Verify DNS/hosts file
- [ ] Check backend service exists

---

# Next Steps (Month 6-7 Preview)

After mastering Kubernetes basics, you'll learn:

- **Advanced CI/CD**: Deploy to K8s from pipelines
- **Monitoring**: Prometheus & Grafana on K8s
- **Logging**: ELK/EFK stack
- **GitOps**: ArgoCD, Flux
- **Security**: RBAC, Pod Security, Network Policies

**Practice Kubernetes daily** - it's the industry standard for container orchestration!

---

# Progress Tracking

## Month 4 - Week 1
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 4 - Week 2
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 4 - Week 3
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 4 - Week 4
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 5 - Week 1
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 5 - Week 2
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 5 - Week 3
- Date Started: ___________
- Completed Tasks: ___ / ___

## Month 5 - Week 4
- Date Started: ___________
- Completed Tasks: ___ / ___

## Capstone Project
- Date Started: ___________
- Date Completed: ___________
- GitHub Repo: ___________
- Key Achievements: ___________

---

**Kubernetes is complex but powerful! 🚀**

*Remember: K8s is declarative - describe what you want, let K8s figure out how to achieve it!*
