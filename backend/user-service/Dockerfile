FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

COPY proto/ proto/

EXPOSE 5002

CMD ["npm", "start"]
