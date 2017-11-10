#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    read -r -d '' SSH_COMMAND << EOM
    cd /var/www/html/serieslist &&
    git pull &&
    composer install &&
    php artisan migrate --force
EOM
    ssh -o "StrictHostKeyChecking no" -i deploy/deploy-key deploy@serieslist.joosep.xyz $SSH_COMMAND
else
    echo "Not deploying, since this branch isn't master."
fi
