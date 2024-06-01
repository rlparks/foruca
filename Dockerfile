FROM node:22 as builder

WORKDIR /app

COPY package.json ./

RUN yarn install

# copy code
COPY . .

# build
RUN yarn build

# lighter image
FROM node:22-slim as server

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# internal port
EXPOSE 3000

# run!
CMD [ "node", "build" ]