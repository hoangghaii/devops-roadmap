# ---------------------------------------------------------------------
# Install dependencies stage
# ---------------------------------------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

# ---------------------------------------------------------------------
# Builder stage
# ---------------------------------------------------------------------
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG VITE_API_URL

ENV NODE_ENV=production
ENV NODE_ENV=production

RUN yarn build

# ---------------------------------------------------------------------
# Production stage
# ---------------------------------------------------------------------
FROM nginx:alpine AS production

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

RUN addgroup -g 1001 -S nginx-app && \
  adduser -S nginx-app -u 1001 && \
  chown -R nginx-app:nginx-app /usr/share/nginx/html && \
  chown -R nginx-app:nginx-app /var/cache/nginx && \
  chown -R nginx-app:nginx-app /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginx-app:nginx-app /var/run/nginx.pid

USER nginx-app

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
