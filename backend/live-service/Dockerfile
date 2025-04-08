FROM alfg/nginx-rtmp:latest

COPY nginx.conf /etc/nginx/nginx.conf

RUN apk update && apk add --no-cache nodejs npm

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 1935 5005

CMD ["sh", "-c", "nginx & npm run dev"]