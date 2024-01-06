#!/usr/bin/env bash

# Deploy the project in the server, requires the containers to be published into 
# the container registry.
#
# To use this manually, fill the following variables in `.env`:
# - DEPLOYMENT_SSH_HOST
# - DEPLOYMENT_SSH_USER

GREEN="\033[0;32m"
RED="\033[0;31m"
COFF="\033[0m"

# If the required environment variables already exist (e.g., in GitHub
# Actions), then we don't need to read the `.env` file
if [[ -z "${DEPLOYMENT_SSH_HOST}" ]]; then
  source .env
fi

ssh "${DEPLOYMENT_SSH_USER}@${DEPLOYMENT_SSH_HOST}" <<ENDSSH
cd ~/projects/serieslist
git pull

echo "Pulling images..."
docker compose -f docker-compose.production.yml pull
echo "Starting containers..."
docker compose -f docker-compose.production.yml up -d
echo "Migrating database..."
docker compose -f docker-compose.production.yml exec api pnpm migrate:prod
ENDSSH

if [[ $? = 0 ]]; then
  printf "${GREEN}Deployment successful!${COFF}\n"
else
  printf "${RED}Deployment failed!${COFF}\n" >&2
  exit 1
fi
