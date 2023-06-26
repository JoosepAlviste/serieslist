# Serieslist

Keep track of series' seen episodes. Very work in progress!

![Screenshot of 
Serieslist](https://raw.githubusercontent.com/JoosepAlviste/serieslist/master/img/serieslist.png)


## Set up

```bash
git clone https://github.com/JoosepAlviste/serieslist.git

cd api
npm install
cd ..
./bin/generate-secret-token.sh
```

Next, [generate a new TMDB API token](https://www.themoviedb.org/settings/api) 
and add it into the [`.env`](.env) file.


## Production

TODO: Instructions here!

Running in production mode with Docker:

```sh
docker-compose up
```

### Sentry

Error monitoring in Sentry requires setting up a few environment variables:

- `API_SENTRY_DSN`: The API project DSN
- `VITE_APP_SENTRY_DSN`: The webapp project DSN
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`: Generate from 
  https://sentry.io/settings/account/api/auth-tokens/, requires the 
  `project:releases` and `org:read` scopes
