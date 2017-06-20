# Serieslist

[![codecov](https://codecov.io/gh/Zeizig/serieslist/branch/master/graph/badge.svg)](https://codecov.io/gh/Zeizig/serieslist)

Keep track of series' seen episodes. Very work in progress!

## Set up

```bash
git clone https://github.com/zeizig/serieslist.git

composer install

cp .env.example .env
# Fill .env file with your db info
php artisan key:generate

php artisan migrate

# To run the server:
php artisan serve
```
