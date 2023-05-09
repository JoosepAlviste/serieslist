# Serieslist API

## Getting started

## Code checks

### ESLint

```sh
npm run lint
```


## Database

To migrate the database:

```sh
npm run migrate
```

This also runs `kysely-codegen` to generate TypeScript types for the database.

To add a new migration:

```sh
npm run migration createUserTable
```
