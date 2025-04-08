FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]
