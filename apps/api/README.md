# Serieslist API

## Code checks

### ESLint

```sh
pnpm lint
```

### TypeScript

```sh
pnpm tsc
```

### Tests

```sh
pnpm test
```

In tests, use the `executeOperation` function in `testUtils.ts` to make 
GraphQL requests. This requires generating the TypeScript types based on the 
queries with:

```sh
pnpm codegen
```


## Database

To migrate the database:

```sh
pnpm migrate
```

This also runs `kysely-codegen` to generate TypeScript types for the database.

To add a new migration:

```sh
pnpm migration createUserTable
```

Then, fill out the migration functions in 
`src/migrations/...-createUserTable.ts`.
