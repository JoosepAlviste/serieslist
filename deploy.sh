#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    ssh -o "StrictHostKeyChecking no" -i deploy-key deploy@serieslist.joosep.xyz 'cd /var/www/html/serieslist && git pull'
else
    echo "Not deploying, since this branch isn't master."
fi
