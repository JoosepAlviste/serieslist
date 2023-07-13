FROM node:16-alpine AS base

RUN npm i -g pnpm@8


FROM base AS dependencies

WORKDIR /app

# Install dependencies for compiling node-gyp (since there is no pre-built 
# binary for Alpine)
# https://stackoverflow.com/a/59538284/7044732
RUN apk add g++ make python3

COPY . .

RUN pnpm --filter api --prod deploy pruned


FROM dependencies AS build

WORKDIR /app

RUN rm -rf node_modules && pnpm install
RUN pnpm -C api build


FROM base AS production

WORKDIR /app

COPY --from=build /app/api/dist dist
COPY --from=build /app/api/package.json .
COPY --from=dependencies /app/pruned/node_modules node_modules

CMD [ "pnpm", "start:prod" ]
