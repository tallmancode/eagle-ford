# Data-safe production path migration — eagle-ford

Never run `docker compose down -v`.

| Env | APP_DIR | COMPOSE_PROJECT_NAME | Ports |
|-----|---------|----------------------|-------|
| production | `/www/wwwroot/eagle/ford/production` | pin current name, then `eagle-ford-production` | 4411/4422 |
| staging | `/www/wwwroot/eagle/ford/staging` | `eagle-ford-staging` | 5411/5422 |

1. Inventory: `docker compose ls`, `docker volume ls`, note project + volume names.
2. Add `COMPOSE_PROJECT_NAME=<current-implicit-name>` to `.env`.
3. `docker compose -f docker-compose.prod.yml stop`
4. Move checkout to `/www/wwwroot/eagle/ford/production`.
5. Update GitHub Environment **production** `APP_DIR`.
6. Start compose; `curl -sf http://127.0.0.1:4411/api/health`.
7. Confirm admin/media OK, then create staging checkout separately.

Staging hostname: `https://ford-stg.tallmancode.co.za` (Basic Auth). Satellites use `MOTOR_CITY_STOCK_API_URL=http://127.0.0.1:5511`.
