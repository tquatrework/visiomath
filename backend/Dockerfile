# Utiliser une image Node.js officielle
FROM node:18-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer le CLI de NestJS globalement
RUN npm install -g @nestjs/cli

# Créer un projet NestJS (seulement si ce n'est pas déjà fait)
# RUN nest new vma-app --skip-install  --package-manager npm

# Copier le reste de l'application
COPY . .

# Builder l'application NestJS
RUN npm run build

# Exposer le port utilisé par NestJS
EXPOSE 5000

# Lancer l'application
CMD ["npm", "run", "start:prod"]