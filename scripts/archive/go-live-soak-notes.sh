#!/bin/bash
# Post go-live soak checklist (print-only). Do not delete volumes or the old host yet.
set -euo pipefail

CANONICAL_URL="${CANONICAL_URL:-https://www.eagleford.co.za}"
CANONICAL_HOST="${CANONICAL_HOST:-www.eagleford.co.za}"
APEX_HOST="${APEX_HOST:-eagleford.co.za}"
VPS_IP="${VPS_IP:-207.180.197.46}"
BACKUP_HINT="${BACKUP_HINT:-$HOME/emf-cutover-backups}"
MOTOR_CITY_URL="${MOTOR_CITY_LIVE_URL:-https://www.eaglemotorcity.co.za}"

cat <<EOF
========================================
Eagle Ford — soak / retire checklist
========================================

DONE by cutover automation:
  - Mongo + media backups under $BACKUP_HINT/
  - App rebuilt with NEXT_PUBLIC_SERVER_URL=$CANONICAL_URL
  - ALLOW_SEARCH_INDEXING=true (verify robots allow indexing)
  - MOTOR_CITY_STOCK_API_URL=$MOTOR_CITY_URL
  - DNS A for @ and www should be $VPS_IP
  - aaPanel-shaped nginx for $CANONICAL_HOST -> localhost:4411
  - Apex $APEX_HOST -> 301 https://$CANONICAL_HOST

If www/apex still 502 or wrong site (other-brand bleed):
  sudo bash $(ls -d $BACKUP_HINT/*/ | tail -n1)APPLY-NGINX.sh
  # Or aaPanel -> Website -> Reload; SSL -> Let's Encrypt for both hosts
  # Proxy MUST be http://127.0.0.1:4411 (Ford), NEVER :4511 (Motor City), :4711 (Mazda), :4611 (Suzuki), or :4811 (Mahindra)
  # Conf path: /www/server/panel/vhost/nginx/<host>.conf
  # Do NOT proxy /.well-known/acme-challenge/ to Next (keep CERT-APPLY-CHECK include)

Verify:
  curl -sf $CANONICAL_URL/api/health
  curl -sfI $CANONICAL_URL/ | head
  curl -sfI https://$APEX_HOST/ | head   # expect 301 -> www
  # title/canonical must say Eagle Ford / $CANONICAL_URL (not staging host / other brands)
  # Staging host eagle-ford-dev.tallmancode.co.za must still work on :4411

Integrations:
  Stock/leads already via Motor City — confirm MOTOR_CITY_STOCK_API_URL=$MOTOR_CITY_URL
  No Meta webhooks on this satellite

Keep for 48-72 hours:
  - Staging hostname eagle-ford-dev.tallmancode.co.za (same stack)
  - Backups under $BACKUP_HINT/

Retire only after soak:
  - Optionally remove old legacy Ford host files if any remain elsewhere
  - Optionally remove eagle-ford-dev vhost (never docker volume rm)
  - Submit sitemap in Search Console

NEVER:
  docker compose down -v
  docker volume rm *data* / *media*
  Change DATABASE_URL database name
EOF
