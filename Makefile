migrate:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose run --rm php php artisan migrate

up-prod:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml up -d

up-prod-foreground:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml up

migrate-prod:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml run --rm php php artisan migrate

bash-prod:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml run --rm php bash

