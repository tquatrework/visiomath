# Utiliser une image Node.js officielle
FROM node:18-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Builder l'application React
RUN npm run build

# Exposer le port utilisé par l'application React
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]