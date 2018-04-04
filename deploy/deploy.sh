#!/bin/bash
set -x
read -r -d '' SSH_COMMAND << EOM
    cd /var/www/html/serieslist &&
    git pull &&
    composer install &&
    php artisan migrate --force
EOM

ssh -o "StrictHostKeyChecking no" -i deploy-key deploy@46.101.147.166 $SSH_COMMAND || exit 1
