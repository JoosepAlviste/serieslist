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
