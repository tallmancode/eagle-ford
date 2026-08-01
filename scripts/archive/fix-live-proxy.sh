#!/bin/bash
# Diagnose + fix eagleford nginx routing to Ford :4411
set -euo pipefail
APP_PORT="${APP_HOST_PORT:-4411}"
STAGING_HOST="${STAGING_HOST:-eagle-ford-dev.tallmancode.co.za}"
CANONICAL_HOST="${CANONICAL_HOST:-www.eagleford.co.za}"
APEX_HOST="${APEX_HOST:-eagleford.co.za}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/emf-cutover-backups/proxy-fix-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$BACKUP_DIR"

echo "=== Discover nginx files mentioning eagleford / 4411 / staging ==="
docker run --rm -v /www:/www -v "$BACKUP_DIR:/backup" alpine:3.20 sh -c '
  echo "--- find by name ---"
  find /www/server -iname "*eagleford*" -o -iname "*ford*" 2>/dev/null | head -n 100
  echo "--- grep conf hits ---"
  find /www/server/panel/vhost /www/server/nginx -type f 2>/dev/null \
    | while read -r f; do
        case "$f" in
          *.conf|*.conf.backup|*proxy*) ;;
          *) continue ;;
        esac
        if grep -qE "eagleford|eagle-ford-dev|4411|4511|4611|4711|4811|eagle-ford" "$f" 2>/dev/null; then
          echo "HIT $f"
          grep -nE "server_name|proxy_pass|ssl_certificate|listen" "$f" | head -n 40 || true
          echo "----"
        fi
      done
  echo "--- panel vhost tree ---"
  ls -la /www/server/panel/vhost 2>/dev/null || true
  ls -la /www/server/panel/vhost/nginx 2>/dev/null || true
  find /www/server/panel/vhost/nginx -maxdepth 3 -type f 2>/dev/null | head -n 80 || true
'

echo "=== Clone staging conf to live hosts if found ==="
docker run --rm -v /www:/www -v "$BACKUP_DIR:/backup" \
  -e STAGING_HOST="$STAGING_HOST" \
  -e CANONICAL_HOST="$CANONICAL_HOST" \
  -e APEX_HOST="$APEX_HOST" \
  -e APP_PORT="$APP_PORT" \
  alpine:3.20 sh -c '
  set -e
  STAGING_CONF=""
  for d in /www/server/panel/vhost/nginx /www/server/nginx/conf/vhost; do
    if [ -f "$d/${STAGING_HOST}.conf" ]; then
      STAGING_CONF="$d/${STAGING_HOST}.conf"
      break
    fi
  done
  if [ -z "$STAGING_CONF" ]; then
    STAGING_CONF=$(find /www/server -type f -name "*${STAGING_HOST}*" 2>/dev/null | head -n1 || true)
  fi
  echo "STAGING_CONF=$STAGING_CONF"
  if [ -n "$STAGING_CONF" ] && [ -f "$STAGING_CONF" ]; then
    cp -a "$STAGING_CONF" /backup/staging-source.conf
    for host in "$CANONICAL_HOST" "$APEX_HOST"; do
      for d in /www/server/panel/vhost/nginx /www/server/nginx/conf/vhost; do
        [ -d "$d" ] || continue
        out="$d/${host}.conf"
        if [ -f "$out" ]; then
          cp -a "$out" "/backup/before-${host}-$(basename $d).conf"
        fi
        sed -e "s/${STAGING_HOST}/${host}/g" \
            -e "s/127.0.0.1:4511/127.0.0.1:${APP_PORT}/g" \
            -e "s/127.0.0.1:4611/127.0.0.1:${APP_PORT}/g" \
            -e "s/127.0.0.1:4711/127.0.0.1:${APP_PORT}/g" \
            -e "s/127.0.0.1:4811/127.0.0.1:${APP_PORT}/g" \
            -e "s/127.0.0.1:4471/127.0.0.1:${APP_PORT}/g" \
            "$STAGING_CONF" > "$out"
        if ! grep -q "127.0.0.1:${APP_PORT}\|localhost:${APP_PORT}" "$out"; then
          sed -i -E "s#proxy_pass[[:space:]]+http://(127\\.0\\.0\\.1|localhost):[0-9]+#proxy_pass http://127.0.0.1:${APP_PORT}#g" "$out"
        fi
        mkdir -p "/www/server/panel/vhost/nginx/well-known"
        touch "/www/server/panel/vhost/nginx/well-known/${host}.conf"
        echo "Wrote $out"
        grep -nE "server_name|proxy_pass|ssl_certificate" "$out" | head -n 20 || true
      done
    done
  else
    echo "No staging conf found to clone"
  fi

  # Force-retarget ANY remaining eagleford files + strip from other brand vhosts
  find /www/server/panel/vhost /www/server/nginx/conf -type f 2>/dev/null \
    | while read -r f; do
        if grep -q "eagleford.co.za" "$f" 2>/dev/null; then
          sed -i \
            -e "s#127.0.0.1:4511#127.0.0.1:${APP_PORT}#g" \
            -e "s#127.0.0.1:4611#127.0.0.1:${APP_PORT}#g" \
            -e "s#127.0.0.1:4711#127.0.0.1:${APP_PORT}#g" \
            -e "s#127.0.0.1:4811#127.0.0.1:${APP_PORT}#g" \
            -e "s#127.0.0.1:4471#127.0.0.1:${APP_PORT}#g" \
            "$f"
          echo "Retargeted $f"
        fi
      done

  find /www/server/panel/vhost/nginx /www/server/nginx/conf -type f -name "*.conf" 2>/dev/null \
    | while read -r f; do
        case "$f" in
          */${CANONICAL_HOST}.conf|*/${APEX_HOST}.conf|*emf-cutover-bak*) continue ;;
        esac
        if grep -qE "server_name[[:space:]].*eagleford\\.co\\.za" "$f" 2>/dev/null; then
          cp -a "$f" "/backup/strip-$(echo "$f" | tr '/.' '__')" 2>/dev/null || true
          sed -i \
            -e "s/[[:space:]]www\\.eagleford\\.co\\.za//g" \
            -e "s/[[:space:]]eagleford\\.co\\.za//g" \
            "$f"
          echo "Stripped eagleford server_name from $f"
        fi
      done
'

echo "=== Reload nginx ==="
reloaded=0
for pidfile in /www/server/nginx/logs/nginx.pid /run/nginx.pid /var/run/nginx.pid; do
  if docker run --rm --pid=host -v "$pidfile:/pid:ro" alpine:3.20 \
    sh -c 'test -s /pid && kill -HUP "$(cat /pid)"' 2>/dev/null; then
    echo "nginx HUP ok from $pidfile"
    reloaded=1
    break
  fi
done
if [ "$reloaded" -eq 0 ]; then
  docker run --rm --pid=host --privileged alpine:3.20 \
    sh -c 'pid=$(pgrep -o "nginx: master" || true); echo pid=$pid; [ -n "$pid" ] && kill -HUP "$pid"' \
    && echo "nginx HUP via pgrep" || echo "HUP failed"
fi

echo "=== Local smoke ==="
curl -sf -H "Host: $CANONICAL_HOST" "http://127.0.0.1:${APP_PORT}/api/health" || true
echo
curl -skI --resolve "${CANONICAL_HOST}:443:127.0.0.1" "https://${CANONICAL_HOST}/api/health" | head -n 15 || true
echo "Backup: $BACKUP_DIR"
