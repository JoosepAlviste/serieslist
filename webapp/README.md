# Serieslist webapp

The front-end for the Serieslist web application.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Code checks

### ESLint

```sh
npm run lint
```


### TypeScript

```sh
npm run tsc
```


### Tests

```sh
npm t
```


### E2E tests

First, run the back-end:

```sh
cd api
# Migrate the e2e database
npm run migrate:e2e
# Run the server
npm run start:e2e
```

Then, run the e2e tests in another terminal tab:

```sh
cd webapp
# Install the playwright dependencies if they haven't been yet
npx playwright install chromium --with-deps
npm run test:e2e
```
