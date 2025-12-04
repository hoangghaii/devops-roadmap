# Tháng 6-7: Advanced CI/CD & GitOps

> **Prerequisites:** Hoàn thành Tháng 1-5 (Docker, Kubernetes basics, GitHub Actions)
> **Focus:** CI/CD to Kubernetes, GitOps, Monitoring & Logging
> **Main Tools:** GitHub Actions, ArgoCD, Prometheus, Grafana, ELK Stack

---

## Mục Tiêu Tháng 6-7

Sau 2 tháng này, bạn sẽ:
- [ ] Deploy applications to Kubernetes via CI/CD
- [ ] Implement GitOps với ArgoCD
- [ ] Setup monitoring với Prometheus & Grafana
- [ ] Implement centralized logging
- [ ] Security scanning in pipelines
- [ ] Multi-environment deployments
- [ ] Automated testing trong K8s

---

# THÁNG 6

# Tuần 1: CI/CD to Kubernetes

## Học - Kubernetes Deployment Strategies

### Deployment Methods
- [ ] kubectl apply (manual)
- [ ] Helm install/upgrade
- [ ] GitOps (declarative)
- [ ] CI/CD pipelines (automated)

### CI/CD Considerations
- [ ] Image building and tagging
- [ ] Registry authentication
- [ ] kubectl authentication to cluster
- [ ] Environment-specific configurations
- [ ] Deployment verification
- [ ] Rollback strategies

### Best Practices
- [ ] Immutable deployments
- [ ] Semantic versioning
- [ ] Image scanning
- [ ] Progressive delivery
- [ ] Automated testing

## Thực Hành - GitHub Actions to Kubernetes

### Setup Kubernetes Access
- [ ] Create service account:
  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: github-deployer
    namespace: default
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    name: deployer
  rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["*"]
    verbs: ["*"]
  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRoleBinding
  metadata:
    name: github-deployer
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: deployer
  subjects:
  - kind: ServiceAccount
    name: github-deployer
    namespace: default
  ```

- [ ] Get service account token:
  ```bash
  kubectl create token github-deployer --duration=87600h
  ```

- [ ] Add to GitHub Secrets:
  - `KUBE_CONFIG`: kubeconfig file content
  - `KUBE_TOKEN`: service account token
  - `KUBE_SERVER`: cluster API server URL

### Build and Deploy Workflow
- [ ] Create `.github/workflows/k8s-deploy.yml`:
  ```yaml
  name: Build and Deploy to Kubernetes
  
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
      outputs:
        image-tag: ${{ steps.meta.outputs.tags }}
      
      steps:
        - name: Checkout
          uses: actions/checkout@v3
        
        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v2
        
        - name: Log in to registry
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
              type=sha,prefix={{branch}}-
              type=semver,pattern={{version}}
              type=ref,event=branch
        
        - name: Build and push
          uses: docker/build-push-action@v4
          with:
            context: .
            push: true
            tags: ${{ steps.meta.outputs.tags }}
            cache-from: type=gha
            cache-to: type=gha,mode=max
    
    deploy:
      needs: build
      runs-on: ubuntu-latest
      
      steps:
        - name: Checkout
          uses: actions/checkout@v3
        
        - name: Setup kubectl
          uses: azure/setup-kubectl@v3
          with:
            version: 'latest'
        
        - name: Set K8s context
          uses: azure/k8s-set-context@v3
          with:
            method: kubeconfig
            kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
        - name: Deploy to Kubernetes
          run: |
            kubectl set image deployment/myapp \
              myapp=${{ needs.build.outputs.image-tag }} \
              -n production
            kubectl rollout status deployment/myapp -n production
        
        - name: Verify deployment
          run: |
            kubectl get pods -n production
            kubectl get services -n production
  ```

### Helm-Based Deployment
- [ ] Create `.github/workflows/helm-deploy.yml`:
  ```yaml
  name: Helm Deploy
  
  on:
    push:
      branches: [main]
  
  jobs:
    deploy:
      runs-on: ubuntu-latest
      
      steps:
        - name: Checkout
          uses: actions/checkout@v3
        
        - name: Setup Helm
          uses: azure/setup-helm@v3
          with:
            version: 'latest'
        
        - name: Setup kubectl
          uses: azure/setup-kubectl@v3
        
        - name: Set K8s context
          uses: azure/k8s-set-context@v3
          with:
            method: kubeconfig
            kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
        - name: Deploy with Helm
          run: |
            helm upgrade --install myapp ./charts/myapp \
              --namespace production \
              --create-namespace \
              --set image.tag=${{ github.sha }} \
              --set environment=production \
              --wait \
              --timeout 5m
        
        - name: Verify deployment
          run: |
            helm status myapp -n production
            kubectl get all -n production
  ```

## Thực Hành - Multi-Environment Deployment

### Environment-Specific Workflows
- [ ] Development auto-deploy:
  ```yaml
  name: Deploy to Development
  
  on:
    push:
      branches: [develop]
  
  jobs:
    deploy-dev:
      runs-on: ubuntu-latest
      environment: development
      
      steps:
        # ... build steps ...
        
        - name: Deploy to dev cluster
          run: |
            kubectl config use-context dev-cluster
            helm upgrade --install myapp ./charts/myapp \
              -f values-dev.yaml \
              --set image.tag=${{ github.sha }}
  ```

- [ ] Staging manual approval:
  ```yaml
  name: Deploy to Staging
  
  on:
    push:
      branches: [main]
  
  jobs:
    deploy-staging:
      runs-on: ubuntu-latest
      environment:
        name: staging
        url: https://staging.myapp.com
      
      steps:
        # Requires manual approval in GitHub
        - name: Deploy to staging
          run: |
            helm upgrade --install myapp ./charts/myapp \
              -f values-staging.yaml \
              --set image.tag=${{ github.sha }}
  ```

- [ ] Production deployment:
  ```yaml
  name: Deploy to Production
  
  on:
    workflow_dispatch:
      inputs:
        version:
          description: 'Version to deploy'
          required: true
  
  jobs:
    deploy-prod:
      runs-on: ubuntu-latest
      environment: 
        name: production
        url: https://myapp.com
      
      steps:
        - name: Deploy to production
          run: |
            helm upgrade --install myapp ./charts/myapp \
              -f values-prod.yaml \
              --set image.tag=${{ github.event.inputs.version }} \
              --wait \
              --timeout 10m
  ```

## Thực Hành - Deployment Verification

### Health Checks
- [ ] Add verification steps:
  ```yaml
  - name: Wait for rollout
    run: |
      kubectl rollout status deployment/myapp -n production
      kubectl wait --for=condition=available \
        --timeout=5m \
        deployment/myapp -n production
  
  - name: Smoke tests
    run: |
      ENDPOINT=$(kubectl get svc myapp -n production -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
      curl --fail http://$ENDPOINT/health || exit 1
      curl --fail http://$ENDPOINT/api/version || exit 1
  ```

### Automated Rollback
- [ ] Add rollback on failure:
  ```yaml
  - name: Deploy
    id: deploy
    run: |
      helm upgrade --install myapp ./charts/myapp \
        --set image.tag=${{ github.sha }} \
        --wait --timeout 5m
    continue-on-error: true
  
  - name: Rollback on failure
    if: steps.deploy.outcome == 'failure'
    run: |
      echo "Deployment failed, rolling back"
      helm rollback myapp -n production
      exit 1
  ```

## Mini Project Week 1
- [ ] Complete CI/CD pipeline to Kubernetes:
  - Build Docker images
  - Push to registry
  - Deploy to dev (automatic)
  - Deploy to staging (manual approval)
  - Deploy to production (manual trigger)
- [ ] Multiple deployment methods:
  - kubectl apply
  - Helm upgrade
- [ ] Deployment verification:
  - Health checks
  - Smoke tests
  - Automated rollback on failure
- [ ] Environment-specific configurations

---

# Tuần 2: GitOps với ArgoCD

## Học - GitOps Principles

### What is GitOps?
- [ ] Git as single source of truth
- [ ] Declarative infrastructure
- [ ] Automatic synchronization
- [ ] Self-healing capabilities
- [ ] Audit trail via Git history

### GitOps Benefits
- [ ] Version control for infra
- [ ] Easy rollbacks (Git revert)
- [ ] Collaboration via Pull Requests
- [ ] Automated deployments
- [ ] Disaster recovery

### GitOps Tools
- [ ] **ArgoCD:** declarative GitOps tool
- [ ] Flux: CNCF project
- [ ] Jenkins X: opinionated CI/CD

## Thực Hành - Install ArgoCD

### Install on Kubernetes
- [ ] Create namespace:
  ```bash
  kubectl create namespace argocd
  ```

- [ ] Install ArgoCD:
  ```bash
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
  ```

- [ ] Verify installation:
  ```bash
  kubectl get pods -n argocd
  kubectl get svc -n argocd
  ```

### Access ArgoCD UI
- [ ] Port forward:
  ```bash
  kubectl port-forward svc/argocd-server -n argocd 8080:443
  ```

- [ ] Get initial password:
  ```bash
  kubectl -n argocd get secret argocd-initial-admin-secret \
    -o jsonpath="{.data.password}" | base64 -d
  ```

- [ ] Login:
  - URL: https://localhost:8080
  - Username: admin
  - Password: (from above command)

### Install ArgoCD CLI
- [ ] Install on macOS:
  ```bash
  brew install argocd
  ```

- [ ] Login via CLI:
  ```bash
  argocd login localhost:8080
  argocd account update-password
  ```

## Thực Hành - Create GitOps Repository

### Repository Structure
- [ ] Create Git repository: `myapp-gitops`
- [ ] Structure:
  ```
  myapp-gitops/
  ├── apps/
  │   ├── development/
  │   │   ├── myapp/
  │   │   │   ├── deployment.yaml
  │   │   │   ├── service.yaml
  │   │   │   └── kustomization.yaml
  │   ├── staging/
  │   │   └── myapp/
  │   └── production/
  │       └── myapp/
  ├── base/
  │   └── myapp/
  │       ├── deployment.yaml
  │       ├── service.yaml
  │       └── kustomization.yaml
  └── README.md
  ```

### Base Configuration
- [ ] Create `base/myapp/deployment.yaml`:
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: myapp
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
          image: ghcr.io/username/myapp:latest
          ports:
          - containerPort: 3000
  ```

- [ ] Create `base/myapp/kustomization.yaml`:
  ```yaml
  apiVersion: kustomize.config.k8s.io/v1beta1
  kind: Kustomization
  
  resources:
    - deployment.yaml
    - service.yaml
  ```

### Environment Overlays
- [ ] `apps/development/myapp/kustomization.yaml`:
  ```yaml
  apiVersion: kustomize.config.k8s.io/v1beta1
  kind: Kustomization
  
  namespace: development
  
  bases:
    - ../../../base/myapp
  
  images:
    - name: ghcr.io/username/myapp
      newTag: develop-abc123
  
  replicas:
    - name: myapp
      count: 1
  ```

## Thực Hành - Create ArgoCD Application

### Via UI
- [ ] Click "New App"
- [ ] Fill details:
  - Application Name: myapp-dev
  - Project: default
  - Sync Policy: Automatic
  - Repository URL: https://github.com/username/myapp-gitops
  - Path: apps/development/myapp
  - Cluster: https://kubernetes.default.svc
  - Namespace: development
- [ ] Click "Create"

### Via CLI
- [ ] Create application:
  ```bash
  argocd app create myapp-dev \
    --repo https://github.com/username/myapp-gitops \
    --path apps/development/myapp \
    --dest-server https://kubernetes.default.svc \
    --dest-namespace development \
    --sync-policy automated \
    --self-heal \
    --auto-prune
  ```

### Via YAML
- [ ] Create `argocd-app.yaml`:
  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: myapp-dev
    namespace: argocd
  spec:
    project: default
    source:
      repoURL: https://github.com/username/myapp-gitops
      targetRevision: HEAD
      path: apps/development/myapp
    destination:
      server: https://kubernetes.default.svc
      namespace: development
    syncPolicy:
      automated:
        prune: true
        selfHeal: true
      syncOptions:
        - CreateNamespace=true
  ```

- [ ] Apply:
  ```bash
  kubectl apply -f argocd-app.yaml
  ```

## Thực Hành - GitOps Workflow

### Update Deployment
- [ ] Update image tag in Git:
  ```yaml
  # apps/development/myapp/kustomization.yaml
  images:
    - name: ghcr.io/username/myapp
      newTag: develop-xyz789  # new tag
  ```

- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "Update image to xyz789"
  git push origin main
  ```

- [ ] Watch ArgoCD sync:
  ```bash
  argocd app sync myapp-dev
  argocd app wait myapp-dev
  ```

### Manual Sync
- [ ] Sync via CLI:
  ```bash
  argocd app sync myapp-dev
  ```

- [ ] Sync via UI:
  - Click application
  - Click "Sync"
  - Select resources
  - Click "Synchronize"

### Rollback
- [ ] Via Git revert:
  ```bash
  git revert HEAD
  git push origin main
  ```

- [ ] Via ArgoCD history:
  ```bash
  argocd app history myapp-dev
  argocd app rollback myapp-dev 3
  ```

## Thực Hành - CI/CD + GitOps Integration

### Update CI/CD Pipeline
- [ ] CI builds and pushes image
- [ ] CI updates GitOps repo:
  ```yaml
  - name: Update GitOps repo
    run: |
      git clone https://github.com/username/myapp-gitops
      cd myapp-gitops
      
      # Update kustomization with new image tag
      cd apps/development/myapp
      kustomize edit set image ghcr.io/username/myapp:${{ github.sha }}
      
      # Commit and push
      git config user.name "GitHub Actions"
      git config user.email "actions@github.com"
      git add .
      git commit -m "Update image to ${{ github.sha }}"
      git push
  ```

### Automated Image Update
- [ ] Use image updater:
  ```yaml
  # Add annotation to ArgoCD app
  metadata:
    annotations:
      argocd-image-updater.argoproj.io/image-list: myapp=ghcr.io/username/myapp
      argocd-image-updater.argoproj.io/myapp.update-strategy: latest
  ```

## Mini Project Week 2
- [ ] Setup complete GitOps workflow:
  - GitOps repository với Kustomize
  - Base configurations
  - Environment overlays (dev/staging/prod)
  - ArgoCD installed
  - Applications configured
- [ ] CI/CD integration:
  - Build image
  - Push to registry
  - Update GitOps repo
  - ArgoCD auto-syncs
- [ ] Test scenarios:
  - Update image → auto deploy
  - Change replicas → auto sync
  - Rollback via Git revert
  - Manual sync via ArgoCD UI

---

# Tuần 3: Monitoring với Prometheus & Grafana

## Học - Monitoring Fundamentals

### Why Monitoring?
- [ ] Detect issues early
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] SLA compliance
- [ ] Debugging and troubleshooting

### Monitoring Types
- [ ] Metrics: numeric measurements
- [ ] Logs: event records
- [ ] Traces: request flows
- [ ] Alerts: notifications

### Prometheus
- [ ] Time-series database
- [ ] Pull-based metrics collection
- [ ] PromQL query language
- [ ] Service discovery
- [ ] Alerting rules

### Grafana
- [ ] Visualization platform
- [ ] Multiple data sources
- [ ] Pre-built dashboards
- [ ] Alerting
- [ ] Templating

## Thực Hành - Install Prometheus Stack

### Using Helm
- [ ] Add Prometheus repo:
  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
  ```

- [ ] Install kube-prometheus-stack:
  ```bash
  helm install prometheus prometheus-community/kube-prometheus-stack \
    --namespace monitoring \
    --create-namespace \
    --set grafana.adminPassword=admin123
  ```

- [ ] Verify installation:
  ```bash
  kubectl get pods -n monitoring
  kubectl get svc -n monitoring
  ```

### Access Services
- [ ] Port forward Prometheus:
  ```bash
  kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
  ```
  - URL: http://localhost:9090

- [ ] Port forward Grafana:
  ```bash
  kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
  ```
  - URL: http://localhost:3000
  - Username: admin
  - Password: admin123

## Thực Hành - Instrument Application

### Add Metrics Endpoint
- [ ] Install prom-client:
  ```bash
  npm install prom-client
  ```

- [ ] Add to Express app:
  ```javascript
  const client = require('prom-client');
  const register = new client.Registry();
  
  // Default metrics
  client.collectDefaultMetrics({ register });
  
  // Custom metrics
  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
  });
  
  const httpRequestTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
  });
  
  // Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
      httpRequestTotal.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
    });
    next();
  });
  
  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  ```

### Create ServiceMonitor
- [ ] Create `servicemonitor.yaml`:
  ```yaml
  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: myapp
    namespace: monitoring
    labels:
      release: prometheus
  spec:
    selector:
      matchLabels:
        app: myapp
    endpoints:
    - port: http
      path: /metrics
      interval: 30s
    namespaceSelector:
      matchNames:
      - default
  ```

- [ ] Apply:
  ```bash
  kubectl apply -f servicemonitor.yaml
  ```

## Thực Hành - PromQL Queries

### Basic Queries
- [ ] Current metric value:
  ```promql
  http_requests_total
  ```

- [ ] Filter by labels:
  ```promql
  http_requests_total{method="GET", status_code="200"}
  ```

- [ ] Rate over time:
  ```promql
  rate(http_requests_total[5m])
  ```

### Aggregation
- [ ] Sum by label:
  ```promql
  sum(rate(http_requests_total[5m])) by (status_code)
  ```

- [ ] Average response time:
  ```promql
  rate(http_request_duration_seconds_sum[5m]) 
  / 
  rate(http_request_duration_seconds_count[5m])
  ```

### Resource Metrics
- [ ] CPU usage:
  ```promql
  rate(container_cpu_usage_seconds_total{pod="myapp-xyz"}[5m])
  ```

- [ ] Memory usage:
  ```promql
  container_memory_usage_bytes{pod="myapp-xyz"}
  ```

## Thực Hành - Grafana Dashboards

### Create Dashboard
- [ ] Login to Grafana
- [ ] Create → Dashboard
- [ ] Add panel
- [ ] Configure visualization:
  - Data source: Prometheus
  - Query: `rate(http_requests_total[5m])`
  - Legend: `{{method}} - {{status_code}}`
  - Title: "Request Rate"

### Common Panels
- [ ] Request rate:
  ```promql
  sum(rate(http_requests_total[5m])) by (status_code)
  ```

- [ ] Error rate:
  ```promql
  sum(rate(http_requests_total{status_code=~"5.."}[5m])) 
  / 
  sum(rate(http_requests_total[5m]))
  ```

- [ ] Response time (p95):
  ```promql
  histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
  ```

- [ ] Active pods:
  ```promql
  count(kube_pod_status_phase{pod=~"myapp-.*", phase="Running"})
  ```

### Import Pre-built Dashboards
- [ ] Kubernetes cluster monitoring:
  - Dashboard ID: 315
  - https://grafana.com/grafana/dashboards/315

- [ ] Node Exporter:
  - Dashboard ID: 1860

- [ ] Import process:
  - Dashboards → Import
  - Enter dashboard ID
  - Select Prometheus data source
  - Import

## Thực Hành - Alerting

### PrometheusRule
- [ ] Create alert rules:
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
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m])) 
          / 
          sum(rate(http_requests_total[5m])) 
          > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod is crash looping"
  ```

### Alertmanager Configuration
- [ ] Configure notifications (Slack example):
  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: alertmanager-prometheus-kube-prometheus-alertmanager
    namespace: monitoring
  stringData:
    alertmanager.yaml: |
      global:
        slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'
      
      route:
        group_by: ['alertname', 'cluster']
        group_wait: 10s
        group_interval: 10s
        repeat_interval: 12h
        receiver: 'slack'
      
      receivers:
      - name: 'slack'
        slack_configs:
        - channel: '#alerts'
          title: 'Alert: {{ .GroupLabels.alertname }}'
          text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
  ```

## Mini Project Week 3
- [ ] Complete monitoring stack:
  - Prometheus installed
  - Grafana installed
  - Application instrumented
  - ServiceMonitor configured
- [ ] Custom dashboards:
  - Application metrics
  - Request rate, errors, latency
  - Resource usage (CPU, memory)
  - Pod health
- [ ] Alerting rules:
  - High error rate
  - High latency
  - Pod failures
  - Resource exhaustion
- [ ] Notifications configured (Slack/Email)

---

# Tuần 4: Logging với ELK Stack

## Học - Centralized Logging

### Why Centralized Logging?
- [ ] Distributed systems produce scattered logs
- [ ] Pods are ephemeral
- [ ] Need unified view
- [ ] Search and analysis
- [ ] Compliance and auditing

### ELK Stack
- [ ] **Elasticsearch:** storage and search
- [ ] **Logstash:** log processing (optional)
- [ ] **Kibana:** visualization
- [ ] **Filebeat/Fluentd:** log shipping

### EFK Stack (Alternative)
- [ ] Fluentd instead of Logstash
- [ ] More cloud-native
- [ ] Lower resource usage

## Thực Hành - Install EFK Stack

### Install Elasticsearch
- [ ] Using Helm:
  ```bash
  helm repo add elastic https://helm.elastic.co
  helm repo update
  
  helm install elasticsearch elastic/elasticsearch \
    --namespace logging \
    --create-namespace \
    --set replicas=1 \
    --set minimumMasterNodes=1 \
    --set resources.requests.memory=2Gi
  ```

- [ ] Verify:
  ```bash
  kubectl get pods -n logging
  ```

### Install Kibana
- [ ] Install:
  ```bash
  helm install kibana elastic/kibana \
    --namespace logging \
    --set elasticsearchHosts=http://elasticsearch-master:9200
  ```

- [ ] Port forward:
  ```bash
  kubectl port-forward -n logging svc/kibana-kibana 5601:5601
  ```
  - URL: http://localhost:5601

### Install Fluentd
- [ ] Create ConfigMap:
  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: fluentd-config
    namespace: logging
  data:
    fluent.conf: |
      <source>
        @type tail
        path /var/log/containers/*.log
        pos_file /var/log/fluentd-containers.log.pos
        tag kubernetes.*
        read_from_head true
        <parse>
          @type json
          time_format %Y-%m-%dT%H:%M:%S.%NZ
        </parse>
      </source>
      
      <filter kubernetes.**>
        @type kubernetes_metadata
      </filter>
      
      <match **>
        @type elasticsearch
        host elasticsearch-master
        port 9200
        logstash_format true
        logstash_prefix kubernetes
      </match>
  ```

- [ ] Deploy DaemonSet:
  ```yaml
  apiVersion: apps/v1
  kind: DaemonSet
  metadata:
    name: fluentd
    namespace: logging
  spec:
    selector:
      matchLabels:
        app: fluentd
    template:
      metadata:
        labels:
          app: fluentd
      spec:
        serviceAccountName: fluentd
        containers:
        - name: fluentd
          image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
          env:
          - name: FLUENT_ELASTICSEARCH_HOST
            value: "elasticsearch-master"
          - name: FLUENT_ELASTICSEARCH_PORT
            value: "9200"
          volumeMounts:
          - name: varlog
            mountPath: /var/log
          - name: varlibdockercontainers
            mountPath: /var/lib/docker/containers
            readOnly: true
          - name: config
            mountPath: /fluentd/etc
        volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: config
          configMap:
            name: fluentd-config
  ```

## Thực Hành - Structured Logging

### Application Logging
- [ ] Install Winston:
  ```bash
  npm install winston
  ```

- [ ] Configure logger:
  ```javascript
  const winston = require('winston');
  
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { 
      service: 'myapp',
      environment: process.env.NODE_ENV 
    },
    transports: [
      new winston.transports.Console()
    ]
  });
  
  // Usage
  logger.info('Server started', { port: 3000 });
  logger.error('Database connection failed', { error: err.message });
  ```

- [ ] Add to application:
  ```javascript
  app.use((req, res, next) => {
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip
    });
    next();
  });
  
  app.use((err, req, res, next) => {
    logger.error('Error occurred', {
      error: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path
    });
    res.status(500).json({ error: 'Internal server error' });
  });
  ```

## Thực Hành - Kibana Setup

### Create Index Pattern
- [ ] Open Kibana: http://localhost:5601
- [ ] Navigate to Management → Stack Management
- [ ] Click "Index Patterns"
- [ ] Create pattern: `kubernetes-*`
- [ ] Select time field: `@timestamp`

### Discover Logs
- [ ] Navigate to Discover
- [ ] Select index pattern
- [ ] Search logs:
  - `kubernetes.namespace_name:"default"`
  - `kubernetes.pod_name:"myapp-*"`
  - `log:"error"`

### Create Visualizations
- [ ] Log volume over time:
  - Visualization: Line chart
  - Metrics: Count
  - Buckets: Date histogram

- [ ] Logs by pod:
  - Visualization: Pie chart
  - Metrics: Count
  - Buckets: Terms → kubernetes.pod_name

- [ ] Error rate:
  - Filter: `log:"error" OR log:"ERROR"`
  - Visualization: Line chart

### Build Dashboard
- [ ] Create Dashboard
- [ ] Add visualizations
- [ ] Configure layout
- [ ] Save dashboard

## Thực Hành - Log Analysis

### Search Queries
- [ ] Find errors:
  ```
  log:"error" OR level:"error"
  ```

- [ ] Filter by pod:
  ```
  kubernetes.pod_name:"myapp-*" AND log:"database"
  ```

- [ ] Time range:
  ```
  @timestamp:[now-1h TO now]
  ```

### Log Correlation
- [ ] Add correlation IDs:
  ```javascript
  const { v4: uuidv4 } = require('uuid');
  
  app.use((req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', req.correlationId);
    next();
  });
  
  logger.info('Request processed', {
    correlationId: req.correlationId,
    userId: req.user?.id
  });
  ```

## Mini Project Week 4
- [ ] Complete logging solution:
  - EFK stack deployed
  - Fluentd collecting all pod logs
  - Application using structured logging
  - Correlation IDs implemented
- [ ] Kibana configuration:
  - Index patterns created
  - Custom dashboards
  - Saved searches
  - Visualizations for:
    - Log volume
    - Error rate
    - Top pods by logs
    - Slow requests
- [ ] Alerting (optional):
  - High error rate alerts
  - Application-specific alerts

---

# CAPSTONE PROJECT: Production-Ready Observability

## Objective
Implement complete CI/CD, GitOps, monitoring, and logging for production application.

## Requirements Checklist

### [ ] 1. CI/CD Pipeline
- [ ] Build and test on push
- [ ] Build Docker images
- [ ] Push to registry with semantic tags
- [ ] Security scanning (Trivy/Snyk)
- [ ] Deploy to dev automatically
- [ ] Deploy to staging with approval
- [ ] Deploy to production manually

### [ ] 2. GitOps Setup
- [ ] GitOps repository
- [ ] Kustomize base + overlays
- [ ] ArgoCD installed
- [ ] Applications configured:
  - Development
  - Staging
  - Production
- [ ] Auto-sync enabled
- [ ] Self-healing enabled
- [ ] CI updates GitOps repo

### [ ] 3. Monitoring
- [ ] Prometheus stack deployed
- [ ] Application instrumented:
  - Request metrics
  - Error metrics
  - Duration metrics
  - Business metrics
- [ ] ServiceMonitor configured
- [ ] Grafana dashboards:
  - Application overview
  - RED metrics (Rate, Errors, Duration)
  - Resource usage
  - Kubernetes cluster
- [ ] Alerting rules:
  - High error rate
  - High latency
  - Pod failures
  - Resource exhaustion
- [ ] Notifications (Slack/Email)

### [ ] 4. Logging
- [ ] EFK stack deployed
- [ ] All pods logging to Elasticsearch
- [ ] Structured logging in application
- [ ] Correlation IDs
- [ ] Kibana dashboards:
  - Error logs
  - Access logs
  - Performance logs
- [ ] Log retention policy
- [ ] Saved searches for common queries

### [ ] 5. Security
- [ ] Container image scanning
- [ ] Secrets management (Sealed Secrets)
- [ ] RBAC configured
- [ ] Network policies
- [ ] Pod security policies/standards

### [ ] 6. Documentation
- [ ] Architecture diagram
- [ ] CI/CD flow documentation
- [ ] GitOps workflow guide
- [ ] Monitoring runbook
- [ ] Logging guide
- [ ] Incident response procedures
- [ ] Rollback procedures

### [ ] 7. Testing
- [ ] Unit tests in CI
- [ ] Integration tests
- [ ] Smoke tests after deployment
- [ ] Load testing (optional)
- [ ] Chaos testing (optional)

## Bonus Challenges
- [ ] Multi-cluster deployment
- [ ] Canary deployments
- [ ] Feature flags
- [ ] A/B testing
- [ ] Cost monitoring
- [ ] SLI/SLO tracking
- [ ] On-call rotation setup

---

# Self-Assessment

After Month 6-7, you should be able to:

### CI/CD to Kubernetes
- [ ] Deploy applications to K8s via pipelines
- [ ] Implement multi-environment deployments
- [ ] Health checks and smoke tests
- [ ] Automated rollbacks

### GitOps
- [ ] Explain GitOps principles
- [ ] Setup ArgoCD
- [ ] Create GitOps repositories
- [ ] Manage applications declaratively

### Monitoring
- [ ] Install Prometheus stack
- [ ] Instrument applications
- [ ] Write PromQL queries
- [ ] Create Grafana dashboards
- [ ] Configure alerting

### Logging
- [ ] Deploy EFK stack
- [ ] Implement structured logging
- [ ] Search and analyze logs
- [ ] Create Kibana visualizations
- [ ] Debug issues with logs

---

# Resources

## Documentation
- [ ] ArgoCD: https://argo-cd.readthedocs.io
- [ ] Prometheus: https://prometheus.io/docs
- [ ] Grafana: https://grafana.com/docs
- [ ] Fluentd: https://docs.fluentd.org

## Courses
- [ ] GitOps with ArgoCD (YouTube)
- [ ] Prometheus Deep Dive (Udemy)
- [ ] ELK Stack Tutorial (FreeCodeCamp)

## Communities
- [ ] CNCF Slack
- [ ] Prometheus Users Google Group
- [ ] ArgoCD Community

---

# Progress Tracking

## Month 6 - Week 1-4
- Week 1: ___ / ___
- Week 2: ___ / ___
- Week 3: ___ / ___
- Week 4: ___ / ___

## Month 7 - Capstone
- Date Started: ___________
- Date Completed: ___________
- GitHub Repos: ___________

---

**You're building production-grade systems! 🚀**

*Remember: Observability is not optional - it's essential for reliable systems!*
