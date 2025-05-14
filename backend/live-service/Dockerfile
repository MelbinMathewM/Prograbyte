FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 1935 5005

CMD ["npm", "run", "dev"]