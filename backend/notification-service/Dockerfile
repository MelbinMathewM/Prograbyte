FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5006

CMD ["npm", "start"]
