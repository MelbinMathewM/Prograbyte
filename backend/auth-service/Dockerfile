FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

EXPOSE 5007

CMD ["npm","run","start"]