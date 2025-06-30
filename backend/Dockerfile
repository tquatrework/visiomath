# ────────────────────────────
# Étape 1 : build (dev deps)
# ────────────────────────────
FROM node:18-slim AS build

WORKDIR /app

# 1. Déps uniquement – npm ci = réplicabilité
COPY package*.json ./
RUN npm ci

# 2. Source + compilation
COPY . .
RUN npm run build          # => dist/

# ────────────────────────────
# Étape 2 : runtime (prod only)
# ────────────────────────────
FROM node:18-slim AS prod

# • Réduire la surface d’attaque
RUN useradd -m -r nodeusr

WORKDIR /app

# 1. Déps prod seulement
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 2. Code compilé + assets
COPY --from=build /app/dist ./dist
# (copie éventuelle des fichiers static, .env.example, etc.)

# 3. Variables env et port
ENV NODE_ENV=production \
    PORT=5000
EXPOSE 5000

USER nodeusr

CMD ["npm", "run", "start:prod"]
