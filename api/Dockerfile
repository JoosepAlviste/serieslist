FROM node:16-alpine AS builder

WORKDIR /app

# Install dependencies for compiling node-gyp (since there is no pre-built 
# binary for Alpine)
# https://stackoverflow.com/a/59538284/7044732
RUN apk add g++ make python3

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
