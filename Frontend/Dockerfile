FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para desarrollo (Puede ser reescrito en compose.)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]