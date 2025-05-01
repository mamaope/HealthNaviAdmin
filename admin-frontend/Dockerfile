# Base image for development and build stage
FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm cache clean --force

# Development stage
FROM base AS development

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

# Build stage
FROM base AS build

ENV NODE_ENV=production

COPY . .

RUN npm run build

# Production stage using serve to serve static files
FROM base AS production

ENV NODE_ENV=production

RUN npm install -g serve

COPY --from=build /app/build /app/build

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]
