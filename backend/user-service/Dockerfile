FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

EXPOSE 5001

CMD ["npm","run","start"]