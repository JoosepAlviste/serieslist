#!/usr/bin/env bash

# Deploy the project in the server, requires the containers to be published into 
# the container registry.
#
# To use this manually, fill the following variables in `.env`:
# - DEPLOYMENT_SSH_HOST
# - DEPLOYMENT_SSH_USER
deploy() {
  # If the required environment variables already exist (e.g., in GitHub
  # Actions), then we don't need to read the `.env` file
  if [[ -z "${DEPLOYMENT_SSH_HOST}" ]]; then
    source .env
  fi

  ssh "${DEPLOYMENT_SSH_USER}@${DEPLOYMENT_SSH_HOST}" <<ENDSSH
cd ~/projects/serieslist
git pull

echo "Pulling images..."
docker-compose -f docker-compose.production.yml pull
echo "Starting containers..."
docker-compose -f docker-compose.production.yml up -d
echo "Migrating database..."
docker-compose -f docker-compose.production.yml exec api npm run migrate:prod
ENDSSH

  echo "Project deployed!"
}

deploy
