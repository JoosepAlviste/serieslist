# Serieslist API

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
npm run test
```

In tests, use the `executeOperation` function in `testUtils.ts` to make 
GraphQL requests. This requires generating the TypeScript types based on the 
queries with:

```sh
npm run codegen
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

Then, fill out the migration functions in 
`src/migrations/...-createUserTable.ts`.
