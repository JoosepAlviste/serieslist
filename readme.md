# Serieslist

[![travis](https://api.travis-ci.org/JoosepAlviste/serieslist.svg)](https://travis-ci.org/JoosepAlviste/serieslist)
[![codecov](https://codecov.io/gh/JoosepAlviste/serieslist/branch/master/graph/badge.svg)](https://codecov.io/gh/JoosepAlviste/serieslist)

Keep track of series' seen episodes. Very work in progress!

![Screenshot of 
Serieslist](https://raw.githubusercontent.com/JoosepAlviste/serieslist/master/img/serieslist.png)

## Set up

```bash
git clone https://github.com/JoosepAlviste/serieslist.git

composer install

cp .env.example .env
# Fill .env file with your db info

php artisan key:generate

php artisan migrate

# To run the server:
php artisan serve
```


### Using Docker

An environment variable `CURRENT_UID` is used to give files correct permissions 
and access rights inside the Docker containers. This is in the format `UID:GID`
of your user. 

You could either add this to your `.zshrc`/`.bashrc`:

```bash
export CURRENT_UID=$(id -u):$(id -g)
```

Or just prefix all `docker-compose` commands with 
`CURRENT_UID=$(id -u):$(id -g)`.

```bash
git clone https://github.com/JoosepAlviste/serieslist.git

docker-compose build
# Or
CURRENT_UID=$(id -u):$(id -g) docker-compose build

cp .env.example .env

# Generate a secure key to be used by Laravel
docker-compose run --rm php artisan key:generate
# Link the storage to public folder
docker-compose run --rm php artisan storage:link

# Run the application
docker-compose up
```

You can now open `localhost:8000` in your browser!


## Production

TODO: Instructions here!
