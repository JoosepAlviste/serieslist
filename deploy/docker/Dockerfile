FROM php:7.2-fpm

WORKDIR /app

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        libicu-dev \
        libpq-dev \
        libxpm-dev \
        libvpx-dev \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
#    && docker-php-ext-install -j$(nproc) mcrypt \
    && docker-php-ext-install gd \
#    && docker-php-ext-install -j$(nproc) intl \
#    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-install pdo \
    && docker-php-ext-install pgsql \
    && docker-php-ext-install pdo_pgsql \
#    && docker-php-ext-install -j$(nproc) exif
    && docker-php-ext-configure gd \
        --with-freetype-dir=/usr/include/ \
        --with-jpeg-dir=/usr/include/ \
        --with-xpm-dir=/usr/lib/x86_64-linux-gnu/ \
#        --with-vpx-dir=/usr/lib/x86_64-linux-gnu/ \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql
