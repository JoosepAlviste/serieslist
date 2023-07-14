FROM node:16-alpine AS base

RUN npm i -g pnpm@8


FROM base AS dependencies

WORKDIR /app

# Install dependencies for compiling node-gyp (since there is no pre-built 
# binary for Alpine)
# https://stackoverflow.com/a/59538284/7044732
RUN apk add g++ make python3

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
ARG VITE_API_HOST
ARG VITE_API_PORT

ENV VITE_APP_PORT=$VITE_APP_PORT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_INTERNAL_URL=$VITE_API_INTERNAL_URL
ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_API_PORT=$VITE_API_PORT

RUN rm -rf node_modules && pnpm install
RUN pnpm -F webapp deploy pruned
RUN cd pruned && pnpm build


FROM base AS production

WORKDIR /app

COPY --from=build /app/pruned/dist dist
COPY --from=build /app/pruned/package.json .
COPY --from=dependencies /app/pruned/node_modules node_modules

CMD [ "pnpm", "start:prod" ]
