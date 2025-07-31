FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

COPY proto/ proto/

COPY certs/ certs/

EXPOSE 5001

EXPOSE 50051

CMD ["npm", "start"]
