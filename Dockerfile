FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3001

CMD ["node", "dist/main"]