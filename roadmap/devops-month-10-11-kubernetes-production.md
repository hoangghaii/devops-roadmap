# Tháng 10-11: Kubernetes Production & Advanced Topics

> **Prerequisites:** Hoàn thành Tháng 1-9 (K8s basics, AWS, Monitoring)
> **Focus:** Production-grade Kubernetes, Security, High Availability, Multi-cluster
> **Main Tools:** RBAC, Network Policies, Sealed Secrets, Cert-Manager, Velero, Istio

---

## Mục Tiêu Tháng 10-11

Sau 2 tháng này, bạn sẽ:
- [ ] Implement Kubernetes security best practices
- [ ] Setup RBAC và Pod Security Standards
- [ ] Configure Network Policies
- [ ] Manage secrets securely
- [ ] High availability architecture
- [ ] Multi-cluster management
- [ ] Disaster recovery strategies
- [ ] Service Mesh basics (Istio)
- [ ] Advanced monitoring & tracing
- [ ] Production readiness checklist

---

# THÁNG 10

# Tuần 1: Security Fundamentals & RBAC

## Học - Kubernetes Security Layers

### Security Concepts
- [ ] **4C's of Cloud Native Security:**
  - Cloud/Infrastructure
  - Cluster
  - Container
  - Code
- [ ] Defense in depth
- [ ] Principle of least privilege
- [ ] Zero trust networking

### Kubernetes Security Components
- [ ] **Authentication:** Who are you?
  - Service Accounts
  - User accounts (via IAM, OIDC)
  - Certificates
- [ ] **Authorization:** What can you do?
  - RBAC
  - ABAC (Attribute-Based)
  - Webhook
- [ ] **Admission Control:** Can you really do that?
  - Admission Controllers
  - Validating webhooks
  - Mutating webhooks

## Thực Hành - RBAC (Role-Based Access Control)

### RBAC Components
- [ ] **Role:** permissions within namespace
- [ ] **ClusterRole:** cluster-wide permissions
- [ ] **RoleBinding:** bind Role to subjects
- [ ] **ClusterRoleBinding:** bind ClusterRole to subjects
- [ ] **Subjects:** Users, Groups, ServiceAccounts

### Create Roles
- [ ] Create namespace-scoped Role:
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    namespace: development
    name: pod-reader
  rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  ```

- [ ] Apply role:
  ```bash
  kubectl apply -f pod-reader-role.yaml
  ```

### Create RoleBinding
- [ ] Bind role to service account:
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: read-pods
    namespace: development
  subjects:
  - kind: ServiceAccount
    name: dev-user
    namespace: development
  roleRef:
    kind: Role
    name: pod-reader
    apiGroup: rbac.authorization.k8s.io
  ```

### ClusterRole Examples
- [ ] Cluster admin role:
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    name: namespace-admin
  rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["*"]
    verbs: ["*"]
  ```

- [ ] Read-only cluster role:
  ```yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    name: view-all
  rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["get", "list", "watch"]
  ```

## Thực Hành - Service Accounts

### Create Service Account
- [ ] Create service account:
  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: app-service-account
    namespace: production
  ```

- [ ] Create token:
  ```bash
  kubectl create token app-service-account -n production
  ```

### Use in Deployment
- [ ] Assign to pods:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapp
  spec:
    template:
      spec:
        serviceAccountName: app-service-account
        containers:
        - name: myapp
          image: myapp:latest
  ```

### Access Kubernetes API
- [ ] From inside pod:
  ```bash
  # Get service account token
  TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
  
  # Call Kubernetes API
  curl -H "Authorization: Bearer $TOKEN" \
    https://kubernetes.default.svc/api/v1/namespaces/default/pods
  ```

## Thực Hành - RBAC Testing

### Test Permissions
- [ ] Check permissions:
  ```bash
  # Can I create pods?
  kubectl auth can-i create pods --namespace=development
  
  # Can service account list secrets?
  kubectl auth can-i list secrets \
    --as=system:serviceaccount:dev:dev-user \
    --namespace=development
  ```

### Impersonate Users
- [ ] Test as different user:
  ```bash
  kubectl get pods --as=dev-user --namespace=development
  ```

### Audit RBAC
- [ ] List roles:
  ```bash
  kubectl get roles --all-namespaces
  kubectl get clusterroles
  ```

- [ ] Describe bindings:
  ```bash
  kubectl describe rolebinding read-pods -n development
  kubectl describe clusterrolebinding cluster-admin
  ```

## Mini Project Week 1
- [ ] RBAC setup cho multi-team cluster:
  - **Namespace:** development, staging, production
  - **Teams:** developers, operators, viewers
  - **Roles:**
    - Developers: full access in dev, read in staging
    - Operators: full access in staging/prod
    - Viewers: read-only everywhere
  - **Service accounts:**
    - Per application
    - Minimal permissions
    - Token generation
- [ ] Test all permissions
- [ ] Document RBAC structure
- [ ] Create onboarding guide for new team members

---

# Tuần 2: Pod Security & Network Policies

## Học - Pod Security Standards

### Pod Security Levels
- [ ] **Privileged:** unrestricted (for system components)
- [ ] **Baseline:** minimally restrictive
- [ ] **Restricted:** hardened (for most apps)

### Security Context
- [ ] **Pod level:** applies to all containers
- [ ] **Container level:** specific to container
- [ ] Settings:
  - runAsUser
  - runAsGroup
  - fsGroup
  - readOnlyRootFilesystem
  - allowPrivilegeEscalation
  - capabilities

## Thực Hành - Security Context

### Non-Root User
- [ ] Run as non-root:
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: secure-pod
  spec:
    securityContext:
      runAsNonRoot: true
      runAsUser: 1000
      fsGroup: 2000
    containers:
    - name: app
      image: myapp:latest
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
          - ALL
        readOnlyRootFilesystem: true
  ```

### Read-Only Root Filesystem
- [ ] Configure read-only FS:
  ```yaml
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /app/cache
  volumes:
  - name: tmp
    emptyDir: {}
  - name: cache
    emptyDir: {}
  ```

## Thực Hành - Pod Security Admission

### Enable Pod Security Admission
- [ ] Label namespace with security level:
  ```bash
  kubectl label namespace production \
    pod-security.kubernetes.io/enforce=restricted \
    pod-security.kubernetes.io/audit=restricted \
    pod-security.kubernetes.io/warn=restricted
  ```

### Test Security Policies
- [ ] Try to create privileged pod:
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: privileged-pod
    namespace: production
  spec:
    containers:
    - name: nginx
      image: nginx
      securityContext:
        privileged: true  # This will be blocked!
  ```

- [ ] Apply:
  ```bash
  kubectl apply -f privileged-pod.yaml
  # Error: violates PodSecurity "restricted:latest"
  ```

## Học - Network Policies

### Why Network Policies?
- [ ] By default, all pods can talk to all pods
- [ ] Network Policies = firewall rules for pods
- [ ] Define allowed ingress/egress traffic
- [ ] Label-based selection

### Network Policy Types
- [ ] **Ingress:** incoming traffic to pods
- [ ] **Egress:** outgoing traffic from pods
- [ ] Both can be combined

## Thực Hành - Network Policies

### Deny All by Default
- [ ] Create deny-all policy:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: deny-all
    namespace: production
  spec:
    podSelector: {}
    policyTypes:
    - Ingress
    - Egress
  ```

### Allow Specific Traffic
- [ ] Allow frontend → backend:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-frontend-to-backend
    namespace: production
  spec:
    podSelector:
      matchLabels:
        app: backend
    policyTypes:
    - Ingress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            app: frontend
      ports:
      - protocol: TCP
        port: 3000
  ```

### Allow DNS
- [ ] Allow DNS queries:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-dns
    namespace: production
  spec:
    podSelector: {}
    policyTypes:
    - Egress
    egress:
    - to:
      - namespaceSelector:
          matchLabels:
            name: kube-system
      - podSelector:
          matchLabels:
            k8s-app: kube-dns
      ports:
      - protocol: UDP
        port: 53
  ```

### Allow External APIs
- [ ] Allow egress to external APIs:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: allow-external-apis
    namespace: production
  spec:
    podSelector:
      matchLabels:
        app: backend
    policyTypes:
    - Egress
    egress:
    - to:
      - ipBlock:
          cidr: 0.0.0.0/0
          except:
          - 10.0.0.0/8
          - 172.16.0.0/12
          - 192.168.0.0/16
      ports:
      - protocol: TCP
        port: 443
  ```

## Thực Hành - Testing Network Policies

### Test Connectivity
- [ ] Deploy test pods:
  ```bash
  # Frontend pod
  kubectl run frontend --image=busybox -l app=frontend --command -- sleep 3600
  
  # Backend pod
  kubectl run backend --image=nginx -l app=backend
  ```

- [ ] Test connection:
  ```bash
  # Should work (allowed by policy)
  kubectl exec frontend -- wget -qO- http://backend
  
  # Should fail (not allowed)
  kubectl exec frontend -- wget -qO- http://database
  ```

### Debug Network Policies
- [ ] Check policies:
  ```bash
  kubectl get networkpolicies
  kubectl describe networkpolicy allow-frontend-to-backend
  ```

- [ ] Use network policy viewer (optional):
  ```bash
  # Install tool
  kubectl krew install np-viewer
  
  # Visualize policies
  kubectl np-viewer
  ```

## Mini Project Week 2
- [ ] Secure multi-tier application:
  - **Frontend:** publicly accessible
  - **Backend API:** only from frontend
  - **Database:** only from backend
  - **Redis:** only from backend
- [ ] Security configurations:
  - All pods run as non-root
  - Read-only root filesystem
  - No privilege escalation
  - Drop all capabilities
  - Pod Security Standards: restricted
- [ ] Network policies:
  - Deny all by default
  - Explicit allow rules only
  - DNS allowed
  - External HTTPS allowed (backend only)
- [ ] Test scenarios:
  - Frontend can reach backend ✅
  - Frontend cannot reach database ❌
  - Backend can reach database ✅
  - Pods can resolve DNS ✅

---

# Tuần 3: Secrets Management & TLS

## Học - Secrets Management

### Kubernetes Secrets Limitations
- [ ] Base64 encoded (not encrypted!)
- [ ] Stored in etcd
- [ ] Anyone with API access can read
- [ ] Not version controlled (security risk)

### Better Solutions
- [ ] **Sealed Secrets:** encrypt secrets in Git
- [ ] **External Secrets Operator:** sync from external
- [ ] **HashiCorp Vault:** enterprise secret management
- [ ] **AWS Secrets Manager / Parameter Store**

## Thực Hành - Sealed Secrets

### Install Sealed Secrets Controller
- [ ] Install with Helm:
  ```bash
  helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
  helm repo update
  
  helm install sealed-secrets sealed-secrets/sealed-secrets \
    --namespace kube-system
  ```

- [ ] Install kubeseal CLI:
  ```bash
  brew install kubeseal
  ```

### Create Sealed Secret
- [ ] Create regular secret:
  ```bash
  kubectl create secret generic db-credentials \
    --from-literal=username=admin \
    --from-literal=password=secretpass123 \
    --dry-run=client \
    -o yaml > secret.yaml
  ```

- [ ] Seal the secret:
  ```bash
  kubeseal -f secret.yaml -w sealed-secret.yaml
  ```

- [ ] Check sealed-secret.yaml:
  ```yaml
  apiVersion: bitnami.com/v1alpha1
  kind: SealedSecret
  metadata:
    name: db-credentials
  spec:
    encryptedData:
      username: AgCQz7... (encrypted!)
      password: AgBKx9... (encrypted!)
  ```

### Use Sealed Secret
- [ ] Commit to Git:
  ```bash
  git add sealed-secret.yaml
  git commit -m "Add encrypted database credentials"
  git push
  ```

- [ ] Apply to cluster:
  ```bash
  kubectl apply -f sealed-secret.yaml
  ```

- [ ] Controller automatically creates regular Secret:
  ```bash
  kubectl get secret db-credentials
  ```

## Thực Hành - External Secrets Operator

### Install External Secrets
- [ ] Install with Helm:
  ```bash
  helm repo add external-secrets https://charts.external-secrets.io
  helm repo update
  
  helm install external-secrets \
    external-secrets/external-secrets \
    -n external-secrets-system \
    --create-namespace
  ```

### Configure AWS Secrets Manager
- [ ] Create SecretStore:
  ```yaml
  apiVersion: external-secrets.io/v1beta1
  kind: SecretStore
  metadata:
    name: aws-secrets
    namespace: production
  spec:
    provider:
      aws:
        service: SecretsManager
        region: us-east-1
        auth:
          jwt:
            serviceAccountRef:
              name: external-secrets-sa
  ```

### Create ExternalSecret
- [ ] Define external secret:
  ```yaml
  apiVersion: external-secrets.io/v1beta1
  kind: ExternalSecret
  metadata:
    name: database-credentials
    namespace: production
  spec:
    refreshInterval: 1h
    secretStoreRef:
      name: aws-secrets
      kind: SecretStore
    target:
      name: db-credentials
      creationPolicy: Owner
    data:
    - secretKey: username
      remoteRef:
        key: prod/database
        property: username
    - secretKey: password
      remoteRef:
        key: prod/database
        property: password
  ```

## Học - TLS Certificates

### Why TLS?
- [ ] Encrypt traffic
- [ ] Authenticate services
- [ ] Industry standard (HTTPS)

### Certificate Management
- [ ] Manual: create and manage yourself
- [ ] cert-manager: automate with Let's Encrypt
- [ ] Cloud providers: ACM, GCP Certificate Manager

## Thực Hành - Cert-Manager

### Install Cert-Manager
- [ ] Install with Helm:
  ```bash
  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  
  helm install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --set installCRDs=true
  ```

### Create ClusterIssuer
- [ ] Let's Encrypt issuer:
  ```yaml
  apiVersion: cert-manager.io/v1
  kind: ClusterIssuer
  metadata:
    name: letsencrypt-prod
  spec:
    acme:
      server: https://acme-v02.api.letsencrypt.org/directory
      email: your-email@example.com
      privateKeySecretRef:
        name: letsencrypt-prod
      solvers:
      - http01:
          ingress:
            class: nginx
  ```

### Request Certificate
- [ ] Via Ingress annotation:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: myapp
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
  spec:
    tls:
    - hosts:
      - myapp.example.com
      secretName: myapp-tls
    rules:
    - host: myapp.example.com
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: myapp
              port:
                number: 80
  ```

### Monitor Certificate
- [ ] Check certificate status:
  ```bash
  kubectl get certificate
  kubectl describe certificate myapp-tls
  ```

- [ ] View generated secret:
  ```bash
  kubectl get secret myapp-tls -o yaml
  ```

## Mini Project Week 3
- [ ] Secure secrets management:
  - Sealed Secrets installed
  - All secrets encrypted in Git
  - External Secrets for production (AWS/Vault)
  - No plain-text secrets in manifests
- [ ] TLS everywhere:
  - cert-manager installed
  - ClusterIssuer configured
  - All ingresses use HTTPS
  - Auto-renewal working
- [ ] Application deployment:
  - Database credentials via Sealed Secrets
  - API keys via External Secrets
  - TLS certificates auto-generated
  - All traffic encrypted
- [ ] Documentation:
  - Secret rotation procedure
  - Certificate renewal process
  - Troubleshooting guide

---

# Tuần 4: High Availability & Disaster Recovery

## Học - High Availability Concepts

### HA Components
- [ ] **Multi-AZ:** spread across availability zones
- [ ] **Pod Disruption Budgets:** maintain minimum replicas
- [ ] **Anti-affinity:** pods on different nodes
- [ ] **Health checks:** liveness & readiness
- [ ] **Auto-scaling:** HPA & VPA

### Single Points of Failure
- [ ] Database: use managed services or StatefulSets
- [ ] Ingress: multiple replicas
- [ ] DNS: redundant
- [ ] Storage: replicated

## Thực Hành - Pod Disruption Budgets

### Create PDB
- [ ] Define PDB:
  ```yaml
  apiVersion: policy/v1
  kind: PodDisruptionBudget
  metadata:
    name: myapp-pdb
  spec:
    minAvailable: 2
    selector:
      matchLabels:
        app: myapp
  ```

- [ ] Alternative (percentage):
  ```yaml
  apiVersion: policy/v1
  kind: PodDisruptionBudget
  metadata:
    name: myapp-pdb
  spec:
    maxUnavailable: 25%
    selector:
      matchLabels:
        app: myapp
  ```

### Test PDB
- [ ] Try to drain node:
  ```bash
  kubectl drain <node-name> --ignore-daemonsets
  # PDB will prevent draining if it violates minAvailable
  ```

## Thực Hành - Pod Anti-Affinity

### Spread Across Zones
- [ ] Zone anti-affinity:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapp
  spec:
    replicas: 3
    template:
      spec:
        affinity:
          podAntiAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: myapp
                topologyKey: topology.kubernetes.io/zone
        containers:
        - name: myapp
          image: myapp:latest
  ```

### Spread Across Nodes
- [ ] Node anti-affinity:
  ```yaml
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: myapp
        topologyKey: kubernetes.io/hostname
  ```

## Học - Disaster Recovery

### Backup Strategies
- [ ] **Configuration:** Git (GitOps)
- [ ] **Persistent Data:** volume snapshots
- [ ] **Cluster State:** Velero
- [ ] **Databases:** native tools

### Recovery Time Objectives
- [ ] **RTO:** Recovery Time Objective (how long?)
- [ ] **RPO:** Recovery Point Objective (how much data loss?)

## Thực Hành - Velero Backup

### Install Velero
- [ ] Install CLI:
  ```bash
  brew install velero
  ```

- [ ] Install server (AWS example):
  ```bash
  velero install \
    --provider aws \
    --plugins velero/velero-plugin-for-aws:v1.8.0 \
    --bucket velero-backups-bucket \
    --backup-location-config region=us-east-1 \
    --snapshot-location-config region=us-east-1 \
    --secret-file ./credentials-velero
  ```

### Create Backup
- [ ] Backup namespace:
  ```bash
  velero backup create myapp-backup --include-namespaces production
  ```

- [ ] Backup specific resources:
  ```bash
  velero backup create app-backup \
    --include-namespaces production \
    --include-resources deployments,services,configmaps,secrets
  ```

- [ ] Schedule recurring backups:
  ```bash
  velero schedule create daily-backup \
    --schedule="0 2 * * *" \
    --include-namespaces production
  ```

### Restore from Backup
- [ ] List backups:
  ```bash
  velero backup get
  ```

- [ ] Restore:
  ```bash
  velero restore create --from-backup myapp-backup
  ```

- [ ] Restore to different namespace:
  ```bash
  velero restore create --from-backup myapp-backup \
    --namespace-mappings production:production-restored
  ```

## Thực Hành - Database Backups

### PostgreSQL Backups
- [ ] Create CronJob for pg_dump:
  ```yaml
  apiVersion: batch/v1
  kind: CronJob
  metadata:
    name: postgres-backup
  spec:
    schedule: "0 2 * * *"
    jobTemplate:
      spec:
        template:
          spec:
            containers:
            - name: backup
              image: postgres:14
              command:
              - /bin/sh
              - -c
              - |
                pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | \
                gzip > /backup/backup-$(date +%Y%m%d).sql.gz
                aws s3 cp /backup/backup-$(date +%Y%m%d).sql.gz \
                  s3://my-backups/postgres/
              env:
              - name: DB_HOST
                value: postgres-service
              - name: DB_USER
                valueFrom:
                  secretKeyRef:
                    name: postgres-creds
                    key: username
              - name: PGPASSWORD
                valueFrom:
                  secretKeyRef:
                    name: postgres-creds
                    key: password
              volumeMounts:
              - name: backup
                mountPath: /backup
            volumes:
            - name: backup
              emptyDir: {}
            restartPolicy: OnFailure
  ```

## Mini Project Week 4
- [ ] High availability setup:
  - Multi-AZ deployment
  - Pod Disruption Budgets
  - Anti-affinity rules
  - Auto-scaling (HPA)
  - Load balancer redundancy
- [ ] Disaster recovery:
  - Velero installed
  - Scheduled daily backups
  - Database backups automated
  - Backup retention policy
  - Documented restore procedures
- [ ] Testing:
  - Simulate node failure
  - Test pod eviction with PDB
  - Perform backup restore
  - Verify RTO/RPO targets
- [ ] Documentation:
  - DR runbook
  - Backup/restore procedures
  - Escalation procedures
  - Post-incident checklist

---

# THÁNG 11

# Tuần 1: Service Mesh Basics (Istio)

## Học - Service Mesh Concepts

### What is Service Mesh?
- [ ] Infrastructure layer for service-to-service communication
- [ ] Traffic management
- [ ] Security (mTLS)
- [ ] Observability
- [ ] Without changing application code

### Why Service Mesh?
- [ ] Microservices complexity
- [ ] Circuit breaking
- [ ] Retries & timeouts
- [ ] Traffic splitting (canary, A/B)
- [ ] Distributed tracing
- [ ] Security policies

### Popular Service Meshes
- [ ] **Istio:** full-featured, complex
- [ ] **Linkerd:** lightweight, simple
- [ ] **Consul Connect:** HashiCorp ecosystem
- [ ] **AWS App Mesh:** AWS native

## Thực Hành - Install Istio

### Install Istio CLI
- [ ] Download istioctl:
  ```bash
  brew install istioctl
  istioctl version
  ```

### Install Istio on Cluster
- [ ] Install with demo profile:
  ```bash
  istioctl install --set profile=demo -y
  ```

- [ ] Verify installation:
  ```bash
  kubectl get pods -n istio-system
  ```

### Enable Sidecar Injection
- [ ] Label namespace:
  ```bash
  kubectl label namespace default istio-injection=enabled
  ```

- [ ] Deploy application:
  ```bash
  kubectl apply -f myapp-deployment.yaml
  ```

- [ ] Verify sidecar injected:
  ```bash
  kubectl get pods
  # Should show 2/2 (app + istio-proxy)
  ```

## Thực Hành - Traffic Management

### Virtual Service
- [ ] Create virtual service:
  ```yaml
  apiVersion: networking.istio.io/v1beta1
  kind: VirtualService
  metadata:
    name: myapp
  spec:
    hosts:
    - myapp
    http:
    - route:
      - destination:
          host: myapp
          subset: v1
        weight: 90
      - destination:
          host: myapp
          subset: v2
        weight: 10
  ```

### Destination Rule
- [ ] Define subsets:
  ```yaml
  apiVersion: networking.istio.io/v1beta1
  kind: DestinationRule
  metadata:
    name: myapp
  spec:
    host: myapp
    subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
  ```

### Canary Deployment
- [ ] Deploy v2 with canary:
  ```bash
  # Deploy v2
  kubectl apply -f myapp-v2-deployment.yaml
  
  # Apply traffic split
  kubectl apply -f virtual-service-canary.yaml
  ```

- [ ] Gradually increase traffic:
  ```yaml
  # 50/50 split
  - destination:
      host: myapp
      subset: v1
    weight: 50
  - destination:
      host: myapp
      subset: v2
    weight: 50
  ```

## Thực Hành - Observability

### Kiali Dashboard
- [ ] Install Kiali:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml
  ```

- [ ] Access dashboard:
  ```bash
  istioctl dashboard kiali
  ```

- [ ] Explore:
  - Service graph
  - Traffic flow
  - Metrics
  - Traces

### Jaeger Tracing
- [ ] Install Jaeger:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml
  ```

- [ ] Access UI:
  ```bash
  istioctl dashboard jaeger
  ```

### Prometheus & Grafana
- [ ] Install Istio integrations:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml
  kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/grafana.yaml
  ```

- [ ] Access Grafana:
  ```bash
  istioctl dashboard grafana
  ```

## Mini Project Week 1
- [ ] Istio service mesh setup:
  - Istio installed (demo profile)
  - Sidecar injection enabled
  - All services in mesh
- [ ] Traffic management:
  - Virtual Services configured
  - Destination Rules defined
  - Canary deployment (90/10 split)
  - A/B testing setup
- [ ] Observability:
  - Kiali for visualization
  - Jaeger for tracing
  - Grafana dashboards
  - Request metrics flowing
- [ ] Test scenarios:
  - Canary rollout
  - Traffic shift
  - Circuit breaking
  - Timeout policies

---

# Tuần 2: Advanced Monitoring & Tracing

## Học - Distributed Tracing

### Why Tracing?
- [ ] Track requests across services
- [ ] Identify bottlenecks
- [ ] Debug failures
- [ ] Performance optimization

### OpenTelemetry
- [ ] Vendor-neutral standard
- [ ] Traces, metrics, logs
- [ ] Auto-instrumentation
- [ ] Multiple backends (Jaeger, Zipkin, etc.)

## Thực Hành - Instrument Application

### Add OpenTelemetry
- [ ] Install SDK:
  ```bash
  npm install @opentelemetry/sdk-node
  npm install @opentelemetry/auto-instrumentations-node
  npm install @opentelemetry/exporter-jaeger
  ```

- [ ] Configure tracing:
  ```javascript
  // tracing.js
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
  const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
  
  const sdk = new NodeSDK({
    traceExporter: new JaegerExporter({
      endpoint: 'http://jaeger-collector:14268/api/traces',
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });
  
  sdk.start();
  ```

- [ ] Load in application:
  ```javascript
  // index.js
  require('./tracing');
  const express = require('express');
  // ... rest of app
  ```

### Custom Spans
- [ ] Add manual spans:
  ```javascript
  const { trace } = require('@opentelemetry/api');
  
  app.get('/api/users', async (req, res) => {
    const tracer = trace.getTracer('myapp');
    const span = tracer.startSpan('fetch-users');
    
    try {
      const users = await db.query('SELECT * FROM users');
      span.setStatus({ code: SpanStatusCode.OK });
      res.json(users);
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
  ```

## Thực Hành - Prometheus Operator

### Install Prometheus Operator
- [ ] Install with Helm:
  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm install prometheus prometheus-community/kube-prometheus-stack \
    -n monitoring
  ```

### Create ServiceMonitor
- [ ] Monitor custom metrics:
  ```yaml
  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: myapp
    namespace: monitoring
  spec:
    selector:
      matchLabels:
        app: myapp
    endpoints:
    - port: metrics
      interval: 30s
      path: /metrics
  ```

### Create PrometheusRule
- [ ] Define alerts:
  ```yaml
  apiVersion: monitoring.coreos.com/v1
  kind: PrometheusRule
  metadata:
    name: myapp-alerts
    namespace: monitoring
  spec:
    groups:
    - name: myapp
      interval: 30s
      rules:
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
      
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate
  ```

## Thực Hành - SLO Monitoring

### Define SLOs
- [ ] Service Level Objectives:
  ```yaml
  # Example SLO: 99.9% availability
  # Error budget: 0.1% = 43.2 minutes/month
  
  apiVersion: monitoring.coreos.com/v1
  kind: PrometheusRule
  metadata:
    name: slo-availability
  spec:
    groups:
    - name: slo
      rules:
      - record: slo:availability:ratio_rate5m
        expr: |
          (
            sum(rate(http_requests_total{status!~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          )
      
      - alert: SLOBudgetBurn
        expr: slo:availability:ratio_rate5m < 0.999
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: SLO budget burning fast
  ```

## Mini Project Week 2
- [ ] Advanced observability stack:
  - OpenTelemetry instrumentation
  - Distributed tracing end-to-end
  - Custom spans for business logic
  - Prometheus Operator
  - ServiceMonitors for all apps
- [ ] Dashboards:
  - RED metrics (Rate, Errors, Duration)
  - SLO tracking
  - Error budget visualization
  - Latency percentiles (p50, p95, p99)
  - Trace sampling & analysis
- [ ] Alerting:
  - SLO violations
  - Error budget exhaustion
  - Latency degradation
  - Runbook links in alerts

---

# Tuần 3: Multi-Cluster Management

## Học - Multi-Cluster Patterns

### Why Multiple Clusters?
- [ ] **Environment isolation:** dev/staging/prod
- [ ] **Region separation:** multi-region deployment
- [ ] **Team isolation:** per-team clusters
- [ ] **Compliance:** data sovereignty
- [ ] **Risk mitigation:** blast radius

### Multi-Cluster Tools
- [ ] **kubectx/kubens:** context switching
- [ ] **Rancher:** cluster management UI
- [ ] **ArgoCD:** multi-cluster GitOps
- [ ] **Cluster API:** cluster lifecycle

## Thực Hành - Multiple Clusters Setup

### Create Multiple Clusters
- [ ] Create dev cluster:
  ```bash
  eksctl create cluster \
    --name dev-cluster \
    --region us-east-1 \
    --nodes 2 \
    --node-type t3.medium
  ```

- [ ] Create prod cluster:
  ```bash
  eksctl create cluster \
    --name prod-cluster \
    --region us-west-2 \
    --nodes 3 \
    --node-type t3.large
  ```

### Manage Contexts
- [ ] Install kubectx:
  ```bash
  brew install kubectx
  ```

- [ ] List contexts:
  ```bash
  kubectl config get-contexts
  ```

- [ ] Switch contexts:
  ```bash
  kubectx dev-cluster
  kubectx prod-cluster
  ```

- [ ] Rename contexts:
  ```bash
  kubectx dev=arn:aws:eks:us-east-1:xxx:cluster/dev-cluster
  kubectx prod=arn:aws:eks:us-west-2:xxx:cluster/prod-cluster
  ```

## Thực Hành - ArgoCD Multi-Cluster

### Register Clusters
- [ ] Install ArgoCD on management cluster
- [ ] Register dev cluster:
  ```bash
  argocd cluster add dev-cluster \
    --name dev-cluster
  ```

- [ ] Register prod cluster:
  ```bash
  argocd cluster add prod-cluster \
    --name prod-cluster
  ```

### Deploy to Multiple Clusters
- [ ] ApplicationSet for multi-cluster:
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: myapp
  spec:
    generators:
    - list:
        elements:
        - cluster: dev-cluster
          url: https://dev-cluster-api
          environment: development
        - cluster: prod-cluster
          url: https://prod-cluster-api
          environment: production
    template:
      metadata:
        name: '{{cluster}}-myapp'
      spec:
        project: default
        source:
          repoURL: https://github.com/username/myapp-gitops
          targetRevision: HEAD
          path: apps/{{environment}}
        destination:
          server: '{{url}}'
          namespace: default
        syncPolicy:
          automated:
            prune: true
            selfHeal: true
  ```

## Thực Hành - Federation (Optional)

### KubeFed
- [ ] Install KubeFed:
  ```bash
  helm repo add kubefed-charts https://raw.githubusercontent.com/kubernetes-sigs/kubefed/master/charts
  helm install kubefed kubefed-charts/kubefed \
    --namespace kube-federation-system \
    --create-namespace
  ```

- [ ] Join clusters:
  ```bash
  kubefedctl join dev-cluster \
    --cluster-context dev-cluster \
    --host-cluster-context management-cluster
  
  kubefedctl join prod-cluster \
    --cluster-context prod-cluster \
    --host-cluster-context management-cluster
  ```

### Federated Resources
- [ ] Deploy to all clusters:
  ```yaml
  apiVersion: types.kubefed.io/v1beta1
  kind: FederatedDeployment
  metadata:
    name: myapp
    namespace: default
  spec:
    template:
      metadata:
        labels:
          app: myapp
      spec:
        replicas: 3
        selector:
          matchLabels:
            app: myapp
        template:
          metadata:
            labels:
              app: myapp
          spec:
            containers:
            - name: myapp
              image: myapp:latest
    placement:
      clusters:
      - name: dev-cluster
      - name: prod-cluster
  ```

## Mini Project Week 3
- [ ] Multi-cluster environment:
  - Dev cluster (smaller nodes)
  - Staging cluster (medium nodes)
  - Prod cluster (larger nodes, multi-region)
- [ ] GitOps deployment:
  - ArgoCD on management cluster
  - ApplicationSets for multi-cluster
  - Environment-specific configs
  - Automated sync to all clusters
- [ ] Context management:
  - kubectx for easy switching
  - Aliases for common clusters
  - Shell prompt shows current context
- [ ] Testing:
  - Deploy to dev → test → staging → prod
  - Rollback in one cluster
  - Independent cluster updates

---

# Tuần 4: Chaos Engineering & Production Readiness

## Học - Chaos Engineering

### What is Chaos Engineering?
- [ ] Proactively inject failures
- [ ] Test system resilience
- [ ] Identify weaknesses
- [ ] Build confidence

### Chaos Principles
- [ ] Start with hypothesis
- [ ] Define steady state
- [ ] Introduce chaos
- [ ] Observe and measure
- [ ] Fix issues found

### Types of Chaos
- [ ] Pod failures
- [ ] Network latency
- [ ] Resource exhaustion
- [ ] Node failures
- [ ] Zone outages

## Thực Hành - Chaos Mesh

### Install Chaos Mesh
- [ ] Install with Helm:
  ```bash
  helm repo add chaos-mesh https://charts.chaos-mesh.org
  helm install chaos-mesh chaos-mesh/chaos-mesh \
    --namespace chaos-mesh \
    --create-namespace
  ```

- [ ] Access dashboard:
  ```bash
  kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
  ```

### Pod Chaos
- [ ] Kill random pods:
  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: PodChaos
  metadata:
    name: pod-kill
  spec:
    action: pod-kill
    mode: one
    selector:
      namespaces:
        - production
      labelSelectors:
        app: myapp
    scheduler:
      cron: '@every 5m'
  ```

### Network Chaos
- [ ] Inject latency:
  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: NetworkChaos
  metadata:
    name: network-delay
  spec:
    action: delay
    mode: all
    selector:
      namespaces:
        - production
      labelSelectors:
        app: myapp
    delay:
      latency: "100ms"
      correlation: "25"
      jitter: "10ms"
    duration: "5m"
  ```

### Stress Testing
- [ ] CPU stress:
  ```yaml
  apiVersion: chaos-mesh.org/v1alpha1
  kind: StressChaos
  metadata:
    name: cpu-stress
  spec:
    mode: one
    selector:
      namespaces:
        - production
      labelSelectors:
        app: myapp
    stressors:
      cpu:
        workers: 2
        load: 80
    duration: "5m"
  ```

## Thực Hành - Production Readiness

### Readiness Checklist
- [ ] **Security:**
  - [ ] RBAC configured
  - [ ] Network policies enabled
  - [ ] Secrets encrypted
  - [ ] TLS everywhere
  - [ ] Pod Security Standards enforced
  - [ ] Regular security scans

- [ ] **High Availability:**
  - [ ] Multi-AZ deployment
  - [ ] Pod Disruption Budgets
  - [ ] Anti-affinity rules
  - [ ] Auto-scaling configured
  - [ ] Health checks comprehensive

- [ ] **Monitoring:**
  - [ ] Metrics collected
  - [ ] Logs centralized
  - [ ] Traces enabled
  - [ ] Dashboards created
  - [ ] Alerts configured
  - [ ] SLOs defined

- [ ] **Disaster Recovery:**
  - [ ] Backups automated
  - [ ] Restore procedures tested
  - [ ] RTO/RPO documented
  - [ ] DR plan exists
  - [ ] Regular drills conducted

- [ ] **Operational:**
  - [ ] GitOps implemented
  - [ ] CI/CD pipelines
  - [ ] Documentation complete
  - [ ] Runbooks written
  - [ ] On-call rotation
  - [ ] Incident response plan

### Pre-Launch Review
- [ ] Security review
- [ ] Performance testing
- [ ] Load testing
- [ ] Chaos testing
- [ ] DR testing
- [ ] Documentation review

## Mini Project Week 4
- [ ] Chaos experiments:
  - Pod failure scenarios
  - Network latency injection
  - Resource exhaustion tests
  - Zone failure simulation
  - Verify system recovery
- [ ] Production readiness:
  - Complete checklist
  - Fix all critical issues
  - Document all procedures
  - Train team members
  - Conduct fire drills
- [ ] Final testing:
  - End-to-end tests
  - Load testing (artillery, k6)
  - Security scanning
  - Penetration testing (optional)
- [ ] Go-live preparation:
  - Communication plan
  - Rollback procedures
  - Monitoring dashboard
  - On-call schedule

---

# CAPSTONE PROJECT: Enterprise Kubernetes Platform

## Objective
Build production-ready, enterprise-grade Kubernetes platform with all best practices.

## Requirements Checklist

### [ ] 1. Multi-Cluster Architecture
- [ ] Management cluster
- [ ] Development cluster
- [ ] Staging cluster
- [ ] Production cluster (multi-region)
- [ ] ArgoCD for multi-cluster GitOps

### [ ] 2. Security Hardened
- [ ] RBAC per team/namespace
- [ ] Network Policies (deny by default)
- [ ] Pod Security Standards (restricted)
- [ ] Sealed Secrets / External Secrets
- [ ] cert-manager for TLS
- [ ] Security scanning (Trivy)
- [ ] Runtime security (Falco optional)

### [ ] 3. High Availability
- [ ] Multi-AZ deployments
- [ ] Pod Disruption Budgets
- [ ] Anti-affinity rules
- [ ] Auto-scaling (HPA/VPA)
- [ ] Load balancer redundancy
- [ ] Database Multi-AZ

### [ ] 4. Service Mesh
- [ ] Istio installed
- [ ] mTLS enabled
- [ ] Traffic management
- [ ] Circuit breakers
- [ ] Retry policies
- [ ] Timeout configurations

### [ ] 5. Observability Stack
- [ ] Prometheus Operator
- [ ] Grafana dashboards
- [ ] Jaeger tracing
- [ ] EFK logging
- [ ] SLO tracking
- [ ] Alert management

### [ ] 6. Disaster Recovery
- [ ] Velero backups
- [ ] Database backups
- [ ] Regular restore tests
- [ ] DR documentation
- [ ] Failover procedures

### [ ] 7. CI/CD Integration
- [ ] GitHub Actions
- [ ] Automated testing
- [ ] Security scans
- [ ] Multi-environment pipeline
- [ ] GitOps deployment
- [ ] Canary releases

### [ ] 8. Chaos Engineering
- [ ] Chaos Mesh installed
- [ ] Regular chaos experiments
- [ ] Gamedays scheduled
- [ ] Incident response tested
- [ ] Resilience validated

### [ ] 9. Documentation
- [ ] Architecture diagrams
- [ ] Network topology
- [ ] Security model
- [ ] Disaster recovery plan
- [ ] Runbooks
- [ ] Onboarding guide
- [ ] API documentation

### [ ] 10. Compliance & Auditing
- [ ] Audit logging enabled
- [ ] Policy enforcement (OPA)
- [ ] Compliance dashboards
- [ ] Regular audits
- [ ] Incident reports

---

# Self-Assessment

After Month 10-11, you should be able to:

### Security
- [ ] Implement RBAC
- [ ] Configure Network Policies
- [ ] Manage secrets securely
- [ ] Enforce Pod Security Standards
- [ ] Setup TLS everywhere

### High Availability
- [ ] Design multi-AZ architecture
- [ ] Configure auto-scaling
- [ ] Implement pod anti-affinity
- [ ] Set up disaster recovery
- [ ] Test failover scenarios

### Service Mesh
- [ ] Install and configure Istio
- [ ] Implement traffic management
- [ ] Setup observability
- [ ] Configure security policies
- [ ] Perform canary deployments

### Observability
- [ ] Distributed tracing
- [ ] Advanced monitoring
- [ ] SLO tracking
- [ ] Alert management
- [ ] Performance optimization

### Operations
- [ ] Multi-cluster management
- [ ] Chaos engineering
- [ ] Incident response
- [ ] Production readiness
- [ ] Team enablement

---

# Resources

## Documentation
- [ ] Kubernetes Security Best Practices
- [ ] Istio Documentation
- [ ] Prometheus Best Practices
- [ ] CNCF Landscape

## Books
- [ ] "Kubernetes Security" - Liz Rice
- [ ] "Istio: Up and Running"
- [ ] "Chaos Engineering" - Netflix

## Certifications
- [ ] CKS (Certified Kubernetes Security Specialist)
- [ ] CKAD (Certified Kubernetes Application Developer)

---

# Progress Tracking

## Month 10
- Week 1: ___ / ___
- Week 2: ___ / ___
- Week 3: ___ / ___
- Week 4: ___ / ___

## Month 11
- Week 1: ___ / ___
- Week 2: ___ / ___
- Week 3: ___ / ___
- Week 4: ___ / ___

## Capstone Project
- Date Started: ___________
- Date Completed: ___________
- Production Go-Live: ___________

---

**You're building enterprise-grade systems! 🚀**

*Remember: Production is where theory meets reality. Prepare, test, and validate everything!*
