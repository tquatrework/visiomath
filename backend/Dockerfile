########################
# 1. Dépendances complètes
########################
FROM node:18-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

########################
# 2. Build NestJS
########################
FROM node:18-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

########################
# 3. Image d’exécution
########################
FROM node:18-slim AS prod
RUN useradd -m -r nodeusr
WORKDIR /app

COPY --from=deps  /app/node_modules ./node_modules
RUN npm prune --omit=dev

COPY --from=build /app/dist          ./dist
COPY --from=build /app/package.json  ./

ENV NODE_ENV=production
EXPOSE 5000
USER nodeusr

CMD ["npm", "run", "start:prod"]