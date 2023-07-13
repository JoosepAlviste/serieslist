# Serieslist

Keep track of your series and seen episodes.

The series are automatically imported from [The Movie Database (TMDB)](https://www.themoviedb.org/).

![Screenshot of Serieslist](https://github.com/JoosepAlviste/serieslist/assets/9450943/28e12199-4d9c-4e05-8c9b-3648e4e7f482)


## Tech stack

The goal of the tech stack is to be as fully statically typed as possible, all 
the way from the database to the front-end, while being as simple as possible. 
[`pnpm`](https://pnpm.io/) is used to manage the multiple workspaces.

The front-end is an SPA with server-side rendering:

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/), [`vite-plugin-ssr`](https://vite-plugin-ssr.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Radix UI](https://www.radix-ui.com/)
- [Vanilla Extract](https://vanilla-extract.style/)
- [React Hook Form](https://react-hook-form.com/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/)

The back-end is a GraphQL API with full type safety:

- [Node](https://nodejs.org/)
- [Fastify](https://www.fastify.io/), [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server), [Pothos GraphQL](https://pothos-graphql.dev/)
- [Kysely](https://github.com/koskimas/kysely)
- [PostgreSQL](https://www.postgresql.org/)

And of course, all code is checked with:

- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](prettier.io/)

Finally, the project is continuously deployed to a 
[DigitalOcean](digitalocean.com/) droplet with the help of:

- [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Caddy](https://caddyserver.com/)


## Set up

### Requirements

- [Node.js](https://nodejs.org/)
- [`pnpm`](https://pnpm.io/)
- See the required versions in [`package.json`](package.json), `engines` field

```bash
git clone https://github.com/JoosepAlviste/serieslist.git

pnpm install
./bin/generate-secret-token.sh
```

Next, [generate a new TMDB API token](https://www.themoviedb.org/settings/api) 
and add it into the [`.env`](.env) file. Make sure to check the rest of the 
`.env` file for any other variables that should be updated.

### Run the project in development mode

First, run the Redis and database containers and migrate the database:

```sh
docker-compose up -d
pnpm migrate
# Migrate the test database
pnpm migrate:test
```

Then, run the application (both the API and the web application):

```sh
pnpm start
```

For more specific information about the webapp and the API, check out their 
respective READMEs.

The development server is accessible at http://localhost:3000.


### File structure

Both the API and the webapp follow a similar file structure where the folders 
are split into features. The `src` folders contain some general, "global" files, 
while the `src/features` folders contain feature-specific code.


## Production

The project is deployed to a DigitalOcean droplet and is continuously deployed 
with GitHub Actions whenever anything is merged to `master`.

In production, the API and the webapp are run inside Docker like so:

```sh
docker-compose -f docker-compose.production.yml up
```

The pipeline builds Docker images, pushes them to the GitHub registry, SSH-es 
into the server, and pulls the images.

### Sentry

Error monitoring in Sentry requires setting up a few environment variables:

- `API_SENTRY_DSN`: The API project DSN
- `VITE_APP_SENTRY_DSN`: The webapp project DSN
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`: Generate from 
  https://sentry.io/settings/account/api/auth-tokens/, requires the 
  `project:releases` and `org:read` scopes


## E2E tests

There are some end-to-end tests, but they are still a work in progress.

First, migrate the test database:

```sh
pnpm migrate:test
```

Then, run the e2e tests:

```sh
# Install the playwright dependencies if they haven't been yet
(cd webapp && pnpm dlx playwright install chromium --with-deps)
pnpm test:e2e
```
