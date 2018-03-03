#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    read -r -d '' SSH_COMMAND << EOM
    cd /var/www/html/serieslist &&
    git pull &&
    composer install &&
    php artisan migrate --force &&
    php artisan db:seed --class=ProductionDatabaseSeeder
EOM
    ssh -o "StrictHostKeyChecking no" -i deploy/deploy-key deploy@46.101.147.166 $SSH_COMMAND
else
    echo "Not deploying, since this branch isn't master."
fi
