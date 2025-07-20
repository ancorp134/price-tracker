# frontend/myapp/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose port 3000 (Vite default)
EXPOSE 3000

CMD ["npm", "run", "dev"]
