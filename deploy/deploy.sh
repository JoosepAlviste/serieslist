#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    read -r -d '' SSH_COMMAND << EOM
    cd /var/www/html/serieslist &&
    git pull &&
    /not/a/normal/path &&
    composer install &&
    php artisan migrate --force
EOM
    ssh -o "StrictHostKeyChecking no" -i deploy/deploy-key deploy@46.101.147.166 $SSH_COMMAND || return 1
else
    echo "Not deploying, since this branch isn't master."
fi
