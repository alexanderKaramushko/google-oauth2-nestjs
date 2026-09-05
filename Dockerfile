FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm config set strict-ssl false

RUN npm install -g pnpm@10.15.0 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm config set strict-ssl false

RUN npm install -g pnpm@10.15.0 && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
