#!/bin/bash
set -x
read -r -d '' SSH_COMMAND << EOM
    cd /projects/serieslist &&
    git pull &&
    docker-compose build &&
    docker-compose up &&
EOM

ssh -o "StrictHostKeyChecking no" -i deploy/deploy-key deploy@46.101.147.166 $SSH_COMMAND || exit 1
