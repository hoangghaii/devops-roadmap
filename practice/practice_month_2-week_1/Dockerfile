FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm install

COPY . .
RUN npm run dev

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build


FROM builder AS tester

RUN npm run test

RUN npm run lint

RUN npm run coverage

FROM base AS production

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN echo "console.log('Hello from my Docker image!')" > index.js

CMD ["node", "index.js"]
