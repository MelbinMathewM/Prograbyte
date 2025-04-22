FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 5003

CMD ["npm", "run", "dev"]
