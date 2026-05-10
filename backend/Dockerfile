FROM node:20-alpine

WORKDIR /app

#copiar e instalar dependencias
COPY package*.json ./
RUN npm install --production

#copiar resto de codigo
COPY . .

EXPOSE 3000