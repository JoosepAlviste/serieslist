FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

RUN npm run build


FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json .
RUN npm ci --production

COPY --from=builder /app/dist dist

CMD [ "npm", "run", "start:prod" ]
