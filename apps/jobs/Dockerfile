FROM node:20-alpine AS base

RUN npm i -g pnpm@8


FROM base AS dependencies

WORKDIR /app

# Install dependencies for compiling node-gyp (since there is no pre-built 
# binary for Alpine)
# https://stackoverflow.com/a/59538284/7044732
RUN apk add g++ make python3

COPY . .

RUN pnpm -F api --prod deploy pruned


FROM dependencies AS build

WORKDIR /app

RUN rm -rf node_modules && rm -rf pruned && pnpm install
RUN pnpm exec nx build @serieslist/api


FROM base AS production

WORKDIR /app

COPY --from=build /app/apps/api/dist dist
COPY --from=build /app/apps/api/package.json .
COPY --from=dependencies /app/pruned/node_modules node_modules

CMD [ "pnpm", "start:prod" ]
