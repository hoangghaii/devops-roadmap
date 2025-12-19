# Set environment/argument variables argument
ARG NODE_VERSION=20

# ---------------------------------------------------------------------
# Base stage
# ---------------------------------------------------------------------

# Use Alpine base images
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

COPY package*.json ./

# ---------------------------------------------------------------------
# Multi-stage builds
# ---------------------------------------------------------------------

# ---------------------------------------------------------------------
# Development stage
# ---------------------------------------------------------------------

FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ['npm', 'run', 'dev']

# ---------------------------------------------------------------------
# Builder stage
# ---------------------------------------------------------------------

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

# ---------------------------------------------------------------------
# Test stage
# ---------------------------------------------------------------------

FROM builder AS tester

RUN npm run test && \
    npm run lint && \
    npm run coverage

# # ---------------------------------------------------------------------
# # Production stage
# # ---------------------------------------------------------------------

# FROM nginx:alpine

# # [RUN] Loại bỏ file cấu hình mặc định của Nginx
# RUN rm -rf /etc/nginx/conf.d/default.conf

# # [COPY --from=builder] Sao chép các file tĩnh đã được build từ Giai đoạn 1
# # /app/build là thư mục mặc định của create-react-app.
# # /usr/share/nginx/html là thư mục mặc định của Nginx để phục vụ file tĩnh.
# COPY --from=builder /app/build /usr/share/nginx/html

# # [COPY] Sao chép file cấu hình Nginx tùy chỉnh (nếu có)
# # Ví dụ: file nginx.conf để xử lý routing cho React (SPA)
# # COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # [ENV] Thiết lập cổng mặc định (Dùng cho thông tin, Nginx mặc định chạy 80)
# ENV PORT 80

# # Mở cổng 80
# EXPOSE 80

# RUN echo "console.log('Hello from my Docker image!')" > index.js

# # [CMD] Đặt lệnh mặc định để chạy ứng dụng Nginx
# # Lệnh này sẽ khởi động Nginx ở chế độ foreground (tiền cảnh)
# CMD ["nginx", "-g", "daemon off;"]


# ---------------------------------------------------------------------
# Production stage
# ---------------------------------------------------------------------

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder /app/build ./build

# ===== CREATE NON-ROOT USER =====
# Step 1: Create group "nodejs" with GID 1001
# Step 2: Create user "nodejs" with UID 1001
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# ===== CHANGE OWNERSHIP =====
# Give nodejs user ownership of /app
RUN chown -R nodejs:nodejs /app

# ===== SWITCH TO NON-ROOT USER =====
# All commands after this run as nodejs user
USER nodejs

USER nodejs

EXPOSE 3000

ENTRYPOINT ['dumb-init', '--']

CMD ["node", "build/server.js"]

# docker run -d -p 3000:80 --name my-react-container my-react-app:latest