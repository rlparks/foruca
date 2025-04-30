FROM node:22 as builder

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:22-slim as server

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

RUN npm i --omit=dev

# internal port
EXPOSE 3000

CMD [ "node", "build" ]
