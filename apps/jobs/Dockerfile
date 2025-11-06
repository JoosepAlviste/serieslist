FROM ghcr.io/joosepalviste/serieslist-dependencies:latest AS dependencies

WORKDIR /app

COPY . .

RUN pnpm -F api --prod deploy pruned


FROM dependencies AS build

WORKDIR /app

RUN rm -rf node_modules && rm -rf pruned && pnpm install
RUN pnpm exec nx build @serieslist/jobs


FROM ghcr.io/joosepalviste/serieslist-base:latest AS production

WORKDIR /app

COPY --from=build /app/apps/jobs/dist dist
COPY --from=build /app/apps/jobs/package.json .
COPY --from=dependencies /app/pruned/node_modules node_modules

CMD [ "pnpm", "start:prod" ]
