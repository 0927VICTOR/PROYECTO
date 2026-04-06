FROM node:16-alpine

WORKDIR /app

# Aumentar la memoria para evitar errores durante el inicio de React 17
ENV NODE_OPTIONS=--max_old_space_size=4096

COPY package*.json ./
# React 17 puede requerir --legacy-peer-deps según sus dependencias
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
