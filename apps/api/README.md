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

To add a new migration, first change the schema files in 
[`packages/db/src/drizzle`](./packages/db/src/drizzle/). Then, generate the 
migration SQL files:

```sh
pnpm migration
```
