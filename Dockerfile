FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]