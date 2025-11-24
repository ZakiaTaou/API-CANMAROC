FROM node:18

# Crée un dossier dans le container
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie le reste du projet
COPY . .

# Port sur lequel ton API tourne
EXPOSE 5000

# Fichier d’entrée de ton backend
CMD ["node", "src/server.js"]
