FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Next.js corre por defecto en el puerto 3001 para no chocar con el frontend
EXPOSE 3001

CMD ["npm", "run", "dev"]
