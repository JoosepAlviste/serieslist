up-prod:
	@docker-compose -f docker-compose.production.yml up

run-prod:
	@docker-compose -f docker-compose.production.yml up -d

migrate-prod:
	@docker-compose -f docker-compose.production.yml run --rm php php artisan migrate

bash-prod:
	@docker-compose -f docker-compose.production.yml run --rm php bash

