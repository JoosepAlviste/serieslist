run-prod:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml up -d

migrate:
	@CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker-compose.production.yml run --rm php php artisan migrate
