# ---------------------------------------------------------------------
# Install dependencies stage
# ---------------------------------------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

# ---------------------------------------------------------------------
# Build stage
# ---------------------------------------------------------------------
FROM node:24-alpine AS buidler

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

RUN yarn install --frozen-lockfile --production=true

# ---------------------------------------------------------------------
# Production stage
# ---------------------------------------------------------------------
FROM node:24-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

COPY --from=buidler --chown=nestjs:nodejs /app/dist /dist
COPY --from=buidler --chown=nestjs:nodejs /app/node_modules /node_modules
COPY --from=buidler --chown=nestjs:nodejs /app/package.json /package.json

USER nestjs

ENTRYPOINT [ "dumb-init", "--" ]

CMD [ "node", "dist/main" ]