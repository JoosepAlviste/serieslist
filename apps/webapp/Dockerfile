FROM ghcr.io/joosepalviste/serieslist-dependencies:latest AS dependencies

WORKDIR /app

COPY . .

RUN pnpm -F webapp --prod deploy pruned


FROM dependencies AS build

WORKDIR /app

# Environment variables are used during the build step, but the build step does 
# NOT get access to the system's environment variables. So, we need to 
# explicitly use build arguments to pass in the variables...
# More info here: https://vsupalov.com/docker-arg-env-variable-guide
ARG VITE_APP_PORT
ARG VITE_API_URL
ARG VITE_API_INTERNAL_URL
ARG VITE_OTEL_ENDPOINT
ARG VITE_OTEL_DATASET
ARG VITE_OTEL_AUTH_TOKEN

ENV VITE_APP_PORT=$VITE_APP_PORT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_INTERNAL_URL=$VITE_API_INTERNAL_URL
ENV VITE_OTEL_ENDPOINT=$VITE_OTEL_ENDPOINT
ENV VITE_OTEL_DATASET=$VITE_OTEL_DATASET
ENV VITE_OTEL_AUTH_TOKEN=$VITE_OTEL_AUTH_TOKEN

RUN rm -rf node_modules && rm -rf pruned && pnpm install
RUN pnpm -F webapp deploy pruned
RUN cd pruned && pnpm build


FROM ghcr.io/joosepalviste/serieslist-base:latest AS production

WORKDIR /app

COPY --from=build /app/pruned/dist dist
COPY --from=build /app/pruned/package.json .
COPY --from=dependencies /app/pruned/node_modules node_modules

CMD [ "pnpm", "start:prod" ]
