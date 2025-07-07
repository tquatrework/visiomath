########################
# 1/ Dépendances complètes
########################
FROM node:18-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

########################
# 2/ Build NestJS
########################
FROM node:18-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build        # ← le binaire `nest` est présent

########################
# 3/ Image d’exécution
########################
FROM node:18-slim AS prod
RUN useradd -m -r nodeusr
WORKDIR /app

# On ré-utilise les modules puis on enlève les dev
COPY --from=deps  /app/node_modules ./node_modules
RUN npm prune --omit=dev        # réduit la taille sans retélécharger
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production \
    PORT=5000
EXPOSE 5000
USER nodeusr
CMD ["node", "dist/main.js"]
