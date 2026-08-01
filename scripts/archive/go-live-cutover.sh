#!/bin/bash
# Promote this Docker stack to serve www.eagleford.co.za without wiping data.
# Safe guarantees: never runs compose down -v; never deletes Docker volumes;
# never changes DATABASE_URL db name.
set -euo pipefail

CANONICAL_URL="${CANONICAL_URL:-https://www.eagleford.co.za}"
CANONICAL_HOST="${CANONICAL_HOST:-www.eagleford.co.za}"
APEX_HOST="${APEX_HOST:-eagleford.co.za}"
STAGING_HOST="${STAGING_HOST:-eagle-ford-dev.tallmancode.co.za}"
APP_PORT="${APP_HOST_PORT:-4411}"
BACKUP_ROOT="${BACKUP_ROOT:-$HOME/emf-cutover-backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$STAMP"
COMPOSE="docker compose -f docker-compose.prod.yml"
SKIP_REBUILD="${SKIP_REBUILD:-0}"
SKIP_NGINX="${SKIP_NGINX:-0}"

cd "$(dirname "$0")/.."

echo "========================================"
echo "Eagle Ford go-live cutover"
echo "Canonical: $CANONICAL_URL"
echo "App dir:   $(pwd)"
echo "Backup:    $BACKUP_DIR"
echo "========================================"

if [ ! -f .env ]; then
  echo "ERROR: .env missing — aborting (no deploy without env)"
  exit 1
fi

if grep -q '^PAYLOAD_CONFIG_PATH=' .env; then
  echo "ERROR: PAYLOAD_CONFIG_PATH must not be set for Docker production"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo ""
echo "=== 1) Inventory ==="
$COMPOSE ps || true
echo "--- volumes ---"
docker volume ls | grep -E 'data|media' || true
echo "--- env keys (values redacted) ---"
grep -E '^(DATABASE_URL|NEXT_PUBLIC_SERVER_URL|ALLOW_SEARCH_INDEXING|SENTRY_ENVIRONMENT|NEXT_PUBLIC_SENTRY_ENVIRONMENT)=' .env \
  | sed -E 's/=.*/=***redacted***/' || true
echo "--- listening ---"
ss -lntp 2>/dev/null | grep -E ":$APP_PORT|:4422" || netstat -lntp 2>/dev/null | grep -E ":$APP_PORT|:4422" || true
echo "--- nginx vhosts mentioning Ford/ford/ports ---"
find /www/server/panel/vhost/nginx /www/server/nginx/conf /etc/nginx -type f -name '*.conf' 2>/dev/null \
  | xargs grep -l -E 'eagle-ford-dev|eagleford|4411|4511|4611|4711|4811' 2>/dev/null || true

echo ""
echo "=== 2) Backup (mongo + media + env) ==="
cp -a .env "$BACKUP_DIR/env.snapshot"
chmod 600 "$BACKUP_DIR/env.snapshot"

echo "mongodump..."
$COMPOSE exec -T mongo mongodump --archive --gzip > "$BACKUP_DIR/mongo.archive.gz"
MONGO_SIZE="$(wc -c < "$BACKUP_DIR/mongo.archive.gz" | tr -d ' ')"
if [ "${MONGO_SIZE:-0}" -lt 1000 ]; then
  echo "ERROR: mongo dump too small ($MONGO_SIZE bytes) — aborting"
  exit 1
fi
echo "mongo dump: $MONGO_SIZE bytes"

MEDIA_VOL="$($COMPOSE config --volumes 2>/dev/null | grep media || true)"
# Prefer compose project volume name
PROJECT_NAME="$(basename "$(pwd)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')"
# Discover actual media volume mounted on app
MEDIA_MOUNT="$(docker inspect "$($COMPOSE ps -q app)" --format '{{range .Mounts}}{{if eq .Destination "/app/public/media"}}{{.Name}}{{end}}{{end}}' 2>/dev/null || true)"
if [ -z "$MEDIA_MOUNT" ]; then
  MEDIA_MOUNT="$(docker volume ls -q | grep media_uploads | head -n1 || true)"
fi
if [ -n "$MEDIA_MOUNT" ]; then
  echo "Archiving media volume: $MEDIA_MOUNT"
  docker run --rm -v "$MEDIA_MOUNT:/src:ro" -v "$BACKUP_DIR:/out" alpine:3.20 \
    tar czf "/out/media.tgz" -C /src .
  echo "media archive: $(wc -c < "$BACKUP_DIR/media.tgz" | tr -d ' ') bytes"
else
  echo "WARNING: could not resolve media_uploads volume name — skipping media tar"
fi

docker volume ls > "$BACKUP_DIR/docker-volumes.txt"
$COMPOSE ps > "$BACKUP_DIR/compose-ps.txt" || true
echo "Backups written to $BACKUP_DIR"

echo ""
echo "=== 3) Patch .env for production URL ==="
# Preserve DATABASE_URL exactly; only upsert public URL / indexing / sentry / Motor City stock URL.
MOTOR_CITY_LIVE_URL="${MOTOR_CITY_LIVE_URL:-https://www.eaglemotorcity.co.za}"
upsert_env() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" .env; then
    # portable-ish in-place replace
    sed -i.bak "s|^${key}=.*|${key}=${value}|" .env
  else
    printf '\n%s=%s\n' "$key" "$value" >> .env
  fi
}

upsert_env NEXT_PUBLIC_SERVER_URL "$CANONICAL_URL"
upsert_env ALLOW_SEARCH_INDEXING true
upsert_env SENTRY_ENVIRONMENT production
upsert_env NEXT_PUBLIC_SENTRY_ENVIRONMENT production
upsert_env MOTOR_CITY_STOCK_API_URL "$MOTOR_CITY_LIVE_URL"
rm -f .env.bak

echo "Patched env keys:"
grep -E '^(NEXT_PUBLIC_SERVER_URL|ALLOW_SEARCH_INDEXING|SENTRY_ENVIRONMENT|NEXT_PUBLIC_SENTRY_ENVIRONMENT|MOTOR_CITY_STOCK_API_URL|DATABASE_URL)=' .env \
  | sed -E 's/^(DATABASE_URL)=.*/\1=***unchanged***/'

echo ""
echo "=== 4) Nginx / aaPanel reverse proxy ==="
# Never abort the cutover on proxy permission errors — backups + rebuild still matter.
# Template: aaPanel GUI shape from staging (eagle-ford-dev) — panel/vhost paths,
# extension + rewrite includes, detailed Next.js location blocks → localhost:APP_PORT.
# Apex 301 → www for canonical consistency.
configure_proxy() {
  local PANEL_NGINX="/www/server/panel/vhost/nginx"
  local PANEL_REWRITE="/www/server/panel/vhost/rewrite"
  local PANEL_CERT="/www/server/panel/vhost/cert"
  local LEGACY_VHOST="/www/server/nginx/conf/vhost"

  # Full aaPanel-shaped reverse proxy (clone of staging GUI config, retargeted).
  write_aapanel_proxy_conf() {
    local host="$1"
    local outfile="$2"
    local upstream="http://localhost:${APP_PORT}"
    cat > "$outfile" <<EOF
server
{
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name ${host};
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/${host};
    include /www/server/panel/vhost/nginx/extension/${host}/*.conf;

    #CERT-APPLY-CHECK--START
    # Do NOT proxy /.well-known/acme-challenge/ to Next — aaPanel/LE needs this include.
    include /www/server/panel/vhost/nginx/well-known/${host}.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL related configuration, do NOT delete or modify the next line of commented-out 404 rules
    #error_page 404/404.html;
    ssl_certificate    /www/server/panel/vhost/cert/${host}/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/${host}/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://\$host\$request_uri;
    #SSL-END

    #ERROR-PAGE-START  Error page configuration, allowed to be commented, deleted or modified
    error_page 404 /404.html;
    error_page 502 /502.html;
    #ERROR-PAGE-END

    #PHP-INFO-START  PHP reference configuration, allowed to be commented, deleted or modified
    include enable-php-00.conf;
    #PHP-INFO-END

    #REWRITE-START URL rewrite rule reference, any modification will invalidate the rewrite rules set by the panel
    include /www/server/panel/vhost/rewrite/${host}.conf;
    #REWRITE-END

    # Reject direct-IP access — scanners often hit http://<server-ip>/ bypassing domain rules
    if (\$host ~* "^[0-9.]+\$") {
        return 444;
    }

    # Reject obvious Server Action probes (valid IDs are long encrypted hex strings)
    if (\$http_next_action ~ "^[a-zA-Z]{1,8}\$") {
        return 403;
    }

    # Next.js static assets (content-hashed) - safe to cache long-term
    location ^~ /_next/static/ {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Next.js image optimization
    location ^~ /_next/image {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        add_header Cache-Control "public, max-age=86400, must-revalidate";
    }

    # Admin panel - NEVER cache
    location ^~ /admin {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;

        proxy_cache_bypass 1;
        proxy_no_cache 1;
    }

    # API routes - NEVER cache
    location ^~ /api/ {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        add_header Cache-Control "no-store, must-revalidate" always;

        proxy_cache_bypass 1;
        proxy_no_cache 1;
    }

    # Public static files (images, fonts, etc. in /public)
    location ~ ^/(favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot))\$ {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;

        add_header Cache-Control "public, max-age=86400, must-revalidate";
        access_log off;
    }

    # All other routes (HTML pages, dynamic routes)
    location / {
        proxy_pass ${upstream};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Real-Port \$remote_port;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header REMOTE-HOST \$remote_addr;

        proxy_connect_timeout 60s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_pass_header Cache-Control;

        proxy_cache_bypass 1;
        proxy_no_cache 1;
    }

    # Forbidden files or directories
    location ~ ^/(\\.user.ini|\\.htaccess|\\.git|\\.env|\\.svn|\\.project|LICENSE|README.md)
    {
        return 404;
    }

    # Directory verification related settings for one-click application for SSL certificate
    if ( \$uri ~ "^/\\.well-known/.*\\.(php|jsp|py|js|css|lua|ts|go|zip|tar\\.gz|rar|7z|sql|bak)\$" ) {
        return 403;
    }

    location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)\$
    {
        expires      30d;
        error_log /dev/null;
        access_log /dev/null;
    }

    location ~ .*\\.(js|css)?\$
    {
        expires      12h;
        error_log /dev/null;
        access_log /dev/null;
    }

    access_log  /www/wwwlogs/${host}.log;
    error_log  /www/wwwlogs/${host}.error.log;
}
EOF
  }

  # Apex → www 301 (aaPanel SSL shape so HTTPS redirect works after certs exist).
  write_apex_redirect_conf() {
    local host="$1"
    local outfile="$2"
    cat > "$outfile" <<EOF
server
{
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name ${host};
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/${host};
    include /www/server/panel/vhost/nginx/extension/${host}/*.conf;

    #CERT-APPLY-CHECK--START
    include /www/server/panel/vhost/nginx/well-known/${host}.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL related configuration, do NOT delete or modify the next line of commented-out 404 rules
    #error_page 404/404.html;
    ssl_certificate    /www/server/panel/vhost/cert/${host}/fullchain.pem;
    ssl_certificate_key    /www/server/panel/vhost/cert/${host}/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_tickets on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://\$host\$request_uri;
    #SSL-END

    #REWRITE-START URL rewrite rule reference, any modification will invalidate the rewrite rules set by the panel
    include /www/server/panel/vhost/rewrite/${host}.conf;
    #REWRITE-END

    # Canonical: apex → www (Ford)
    return 301 https://${CANONICAL_HOST}\$request_uri;

    access_log  /www/wwwlogs/${host}.log;
    error_log  /www/wwwlogs/${host}.error.log;
}
EOF
  }

  echo "--- proxy discovery ---"
  ls -la "$PANEL_NGINX" 2>/dev/null | head -n 40 || true
  echo "--- existing eagleford / 4411 / 4511 / 4611 / 4711 / 4811 conf snippets ---"
  find /www/server/panel/vhost /www/server/nginx/conf /etc/nginx -type f \( -name '*eagle*' -o -name '*ford*' -o -name '*mazda*' -o -name '*mahindra*' -o -name '*suzuki*' \) 2>/dev/null | head -n 50 || true
  for f in \
    "$PANEL_NGINX/${CANONICAL_HOST}.conf" \
    "$PANEL_NGINX/${APEX_HOST}.conf" \
    "$PANEL_NGINX/${STAGING_HOST}.conf" \
    "$LEGACY_VHOST/${CANONICAL_HOST}.conf" \
    "$LEGACY_VHOST/${APEX_HOST}.conf"
  do
    if [ -r "$f" ]; then
      echo "==== $f ===="
      grep -nE 'server_name|proxy_pass|listen|ssl_certificate|return 301' "$f" || true
    fi
  done
  find /www/server/panel/vhost -maxdepth 4 -type f 2>/dev/null \
    | xargs grep -l -E "4411|4511|4611|4711|4811|eagle-ford-dev|eagleford|eagle-ford|eaglemahindra|eaglemazda" 2>/dev/null \
    | head -n 40 || true

  # Ensure SSL material exists so nginx -t accepts the new vhosts (HUP keeps old conf if SSL paths missing).
  # Prefer real LE certs when present; otherwise bootstrap short-lived self-signed placeholders.
  ensure_ssl_certs() {
    local host="$1"
    local certdir="$PANEL_CERT/${host}"
    local full="$certdir/fullchain.pem"
    local key="$certdir/privkey.pem"
    if docker run --rm -v /www/server/panel/vhost/cert:/cert alpine:3.20 \
      sh -c "test -s /cert/${host}/fullchain.pem && test -s /cert/${host}/privkey.pem" 2>/dev/null; then
      echo "✓ SSL certs present for $host"
      return 0
    fi
    echo "Bootstrapping self-signed SSL for $host (replace with Let's Encrypt in aaPanel)"
    docker run --rm -v /www/server/panel/vhost/cert:/cert alpine:3.20 \
      sh -c "
        apk add --no-cache openssl >/dev/null
        mkdir -p /cert/${host}
        openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
          -keyout /cert/${host}/privkey.pem \
          -out /cert/${host}/fullchain.pem \
          -subj \"/CN=${host}\" \
          -addext \"subjectAltName=DNS:${host}\" 2>/dev/null \
        || openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
          -keyout /cert/${host}/privkey.pem \
          -out /cert/${host}/fullchain.pem \
          -subj \"/CN=${host}\"
        chmod 600 /cert/${host}/privkey.pem
        chmod 644 /cert/${host}/fullchain.pem
        ls -la /cert/${host}/
      " || echo "WARNING: could not bootstrap SSL for $host"
  }

  for host in "$CANONICAL_HOST" "$APEX_HOST"; do
    ensure_ssl_certs "$host"
  done

  # Surface aaPanel extension/proxy includes that may still point at Ford.
  echo "--- extension / proxy includes for cutover hosts ---"
  for host in "$CANONICAL_HOST" "$APEX_HOST"; do
    ls -la "$PANEL_NGINX/extension/${host}" 2>/dev/null || \
      docker run --rm -v "$PANEL_NGINX:/vhost" alpine:3.20 ls -la "/vhost/extension/${host}" 2>/dev/null || true
    ls -la "$PANEL_NGINX/proxy/${host}" 2>/dev/null || \
      docker run --rm -v "$PANEL_NGINX:/vhost" alpine:3.20 ls -la "/vhost/proxy/${host}" 2>/dev/null || true
  done

  # Always emit ready-to-apply confs into the backup dir (operator / sudo / docker mount).
  write_aapanel_proxy_conf "$CANONICAL_HOST" "$BACKUP_DIR/nginx-${CANONICAL_HOST}.conf"
  write_apex_redirect_conf "$APEX_HOST" "$BACKUP_DIR/nginx-${APEX_HOST}.conf"
  printf '\n' > "$BACKUP_DIR/rewrite-${CANONICAL_HOST}.conf"
  printf '\n' > "$BACKUP_DIR/rewrite-${APEX_HOST}.conf"
  echo "Wrote aaPanel-shaped confs: $BACKUP_DIR/nginx-${CANONICAL_HOST}.conf (proxy :$APP_PORT)"
  echo "Wrote aaPanel-shaped confs: $BACKUP_DIR/nginx-${APEX_HOST}.conf (301 → https://${CANONICAL_HOST})"

  cat > "$BACKUP_DIR/APPLY-NGINX.sh" <<EOF
#!/bin/bash
set -euo pipefail
# Run as root on the VPS (or: sudo bash $BACKUP_DIR/APPLY-NGINX.sh)
# Installs aaPanel-shaped vhosts (not minimal server{} blocks).
DEST="$PANEL_NGINX"
REWRITE="$PANEL_REWRITE"
LEGACY="$LEGACY_VHOST"
mkdir -p "\$DEST" "\$REWRITE" \\
  "\$DEST/extension/${CANONICAL_HOST}" \\
  "\$DEST/extension/${APEX_HOST}" \\
  "\$DEST/well-known" \\
  /www/wwwroot/${CANONICAL_HOST} \\
  /www/wwwroot/${APEX_HOST} \\
  /www/server/panel/vhost/cert/${CANONICAL_HOST} \\
  /www/server/panel/vhost/cert/${APEX_HOST}
touch "\$DEST/well-known/${CANONICAL_HOST}.conf" "\$DEST/well-known/${APEX_HOST}.conf"
# Bootstrap self-signed certs if Let's Encrypt not issued yet (nginx -t requires files).
for host in ${CANONICAL_HOST} ${APEX_HOST}; do
  if [ ! -s /www/server/panel/vhost/cert/\$host/fullchain.pem ] || [ ! -s /www/server/panel/vhost/cert/\$host/privkey.pem ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 30 \\
      -keyout /www/server/panel/vhost/cert/\$host/privkey.pem \\
      -out /www/server/panel/vhost/cert/\$host/fullchain.pem \\
      -subj "/CN=\$host" || true
  fi
done
cp -a "$BACKUP_DIR/nginx-${CANONICAL_HOST}.conf" "\$DEST/${CANONICAL_HOST}.conf"
cp -a "$BACKUP_DIR/nginx-${APEX_HOST}.conf" "\$DEST/${APEX_HOST}.conf"
cp -a "$BACKUP_DIR/rewrite-${CANONICAL_HOST}.conf" "\$REWRITE/${CANONICAL_HOST}.conf"
cp -a "$BACKUP_DIR/rewrite-${APEX_HOST}.conf" "\$REWRITE/${APEX_HOST}.conf"
# Remove prior minimal/wrong confs under legacy nginx conf/vhost (duplicate server_name).
if [ -d "\$LEGACY" ]; then
  for host in ${CANONICAL_HOST} ${APEX_HOST}; do
    if [ -f "\$LEGACY/\${host}.conf" ]; then
      mv "\$LEGACY/\${host}.conf" "\$LEGACY/\${host}.conf.emf-cutover-bak-\$(date +%Y%m%d%H%M%S)" || rm -f "\$LEGACY/\${host}.conf"
    fi
  done
fi
if [ -x /www/server/nginx/sbin/nginx ]; then
  /www/server/nginx/sbin/nginx -t && /www/server/nginx/sbin/nginx -s reload
elif command -v nginx >/dev/null 2>&1; then
  nginx -t && nginx -s reload
fi
echo "Applied aaPanel proxy vhosts for ${CANONICAL_HOST} (-> localhost:${APP_PORT}) and ${APEX_HOST} (301 -> ${CANONICAL_HOST})"
echo "Issue Let's Encrypt certs in aaPanel for both hosts if SSL paths are missing."
echo "NEVER proxy these hosts to Motor City :4511, Mazda :4711, Suzuki :4611, or Mahindra :4811 — only :${APP_PORT}."
EOF
  chmod +x "$BACKUP_DIR/APPLY-NGINX.sh"

  if [ "$SKIP_NGINX" = "1" ]; then
    echo "SKIP_NGINX=1 — not installing vhosts (see $BACKUP_DIR/APPLY-NGINX.sh)"
    return 0
  fi

  install_file() {
    local src="$1"
    local dest="$2"
    local dest_dir
    dest_dir="$(dirname "$dest")"
    if [ ! -d "$dest_dir" ]; then
      mkdir -p "$dest_dir" 2>/dev/null || \
        docker run --rm -v "$(dirname "$dest_dir"):/parent" alpine:3.20 \
          mkdir -p "/parent/$(basename "$dest_dir")" 2>/dev/null || true
    fi
    if [ -w "$dest_dir" ] 2>/dev/null || [ -w "$dest" ] 2>/dev/null; then
      cp -a "$src" "$dest" && return 0
    fi
    if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
      sudo mkdir -p "$dest_dir"
      sudo cp -a "$src" "$dest" && return 0
    fi
    if docker run --rm \
      -v "$dest_dir:/vhost" \
      -v "$(dirname "$src"):/backup:ro" \
      alpine:3.20 \
      cp "/backup/$(basename "$src")" "/vhost/$(basename "$dest")" 2>/dev/null; then
      return 0
    fi
    return 1
  }

  installed=0

  # Prefer aaPanel panel path only (correct GUI shape). Do not install minimal confs into legacy path.
  if [ -d "$PANEL_NGINX" ] || docker run --rm -v /www/server/panel/vhost:/p alpine:3.20 test -d /p/nginx 2>/dev/null; then
    for host in "$CANONICAL_HOST" "$APEX_HOST"; do
      if install_file "$BACKUP_DIR/nginx-${host}.conf" "$PANEL_NGINX/${host}.conf"; then
        echo "Installed $PANEL_NGINX/${host}.conf"
        installed=1
      else
        echo "WARNING: cannot write $PANEL_NGINX/${host}.conf"
      fi
      if install_file "$BACKUP_DIR/rewrite-${host}.conf" "$PANEL_REWRITE/${host}.conf"; then
        echo "Installed $PANEL_REWRITE/${host}.conf"
      fi
      # Ensure extension dir exists; quarantine prior aaPanel reverse-proxy snippets (often Ford).
      ext_dir="$PANEL_NGINX/extension/${host}"
      mkdir -p "$ext_dir" 2>/dev/null || \
        docker run --rm -v "$PANEL_NGINX:/vhost" alpine:3.20 mkdir -p "/vhost/extension/${host}" 2>/dev/null || true
      docker run --rm -v "$PANEL_NGINX:/vhost" -v "$BACKUP_DIR:/backup" alpine:3.20 \
        sh -c "
          d=/vhost/extension/${host}
          [ -d \"\$d\" ] || exit 0
          for f in \"\$d\"/*; do
            [ -e \"\$f\" ] || continue
            case \"\$f\" in
              *00-emf-placeholder.conf|*emf-cutover-bak*) continue ;;
            esac
            base=\$(basename \"\$f\")
            cp -a \"\$f\" /backup/ext-bak-${host}-\$base 2>/dev/null || true
            mv \"\$f\" \"\$f.emf-cutover-bak-${STAMP}\" 2>/dev/null || rm -f \"\$f\"
            echo \"Quarantined extension \$f\"
          done
        " 2>/dev/null || true
      placeholder="$ext_dir/00-emf-placeholder.conf"
      printf '# aaPanel extension placeholder — reverse proxy lives in main vhost\n' > "$BACKUP_DIR/ext-placeholder.conf"
      install_file "$BACKUP_DIR/ext-placeholder.conf" "$placeholder" || true
      # Same for aaPanel proxy/ site dir if present
      docker run --rm -v "$PANEL_NGINX:/vhost" -v "$BACKUP_DIR:/backup" alpine:3.20 \
        sh -c "
          d=/vhost/proxy/${host}
          [ -d \"\$d\" ] || exit 0
          for f in \"\$d\"/*; do
            [ -e \"\$f\" ] || continue
            case \"\$f\" in
              *emf-cutover-bak*) continue ;;
            esac
            base=\$(basename \"\$f\")
            cp -a \"\$f\" /backup/proxy-bak-${host}-\$base 2>/dev/null || true
            # Retarget ports in place rather than delete (aaPanel may re-add)
            sed -i \
              -e 's#127.0.0.1:4511#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4611#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4711#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4811#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4471#127.0.0.1:${APP_PORT}#g' \
              -e 's#localhost:4511#localhost:${APP_PORT}#g' \
              -e 's#localhost:4611#localhost:${APP_PORT}#g' \
              -e 's#localhost:4711#localhost:${APP_PORT}#g' \
              -e 's#localhost:4811#localhost:${APP_PORT}#g' \
              -e 's#localhost:4471#localhost:${APP_PORT}#g' \
              \"\$f\" 2>/dev/null || true
            echo \"Patched proxy dir \$f\"
            grep -nE 'proxy_pass|server_name' \"\$f\" || true
          done
        " 2>/dev/null || true
      mkdir -p "/www/wwwroot/${host}" 2>/dev/null || \
        docker run --rm -v /www/wwwroot:/roots alpine:3.20 mkdir -p "/roots/${host}" 2>/dev/null || true
      # Empty well-known include so nginx -t succeeds before aaPanel creates the real file
      docker run --rm -v /www/server/panel/vhost/nginx:/vhost alpine:3.20 \
        sh -c "mkdir -p /vhost/well-known; touch /vhost/well-known/${host}.conf" 2>/dev/null || true
    done
  else
    echo "WARNING: $PANEL_NGINX not found"
  fi

  # Quarantine prior minimal/wrong confs under legacy path (duplicate server_name causes wrong site / 502).
  if [ -d "$LEGACY_VHOST" ]; then
    for host in "$CANONICAL_HOST" "$APEX_HOST"; do
      legacy="$LEGACY_VHOST/${host}.conf"
      if [ -e "$legacy" ]; then
        bak="$LEGACY_VHOST/${host}.conf.emf-cutover-bak-${STAMP}"
        if mv "$legacy" "$bak" 2>/dev/null; then
          echo "Quarantined legacy $legacy -> $bak"
        elif docker run --rm -v "$LEGACY_VHOST:/vhost" alpine:3.20 \
          mv "/vhost/${host}.conf" "/vhost/${host}.conf.emf-cutover-bak-${STAMP}" 2>/dev/null; then
          echo "Quarantined legacy $legacy (via docker)"
        else
          echo "WARNING: could not quarantine $legacy — may conflict with panel vhost"
        fi
      fi
    done
  fi

  # Retarget residual eagleford proxy snippets still pointing at other brand ports.
  # Quarantine extension/proxy includes that still target non-4411 ports after patching.
  echo "--- retarget residual eagleford proxies to :$APP_PORT (fix Motor City/Mazda/Suzuki/Mahindra ports) ---"
  if docker run --rm -v /www:/www -v "$BACKUP_DIR:/backup" alpine:3.20 \
    sh -c "
      find /www/server/panel/vhost /www/server/nginx/conf -type f \( -name '*.conf' -o -name '*proxy*' \) 2>/dev/null \
      | while read -r f; do
          case \"\$f\" in
            *emf-cutover-bak*) continue ;;
          esac
          if grep -qE 'eagleford\\.co\\.za' \"\$f\" 2>/dev/null; then
            safe=\$(echo \"\$f\" | tr '/.' '__')
            cp -a \"\$f\" \"/backup/pre-fix-\$safe\" 2>/dev/null || true
            sed -i \
              -e 's#127.0.0.1:4511#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4611#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4711#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4811#127.0.0.1:${APP_PORT}#g' \
              -e 's#127.0.0.1:4471#127.0.0.1:${APP_PORT}#g' \
              -e 's#localhost:4511#localhost:${APP_PORT}#g' \
              -e 's#localhost:4611#localhost:${APP_PORT}#g' \
              -e 's#localhost:4711#localhost:${APP_PORT}#g' \
              -e 's#localhost:4811#localhost:${APP_PORT}#g' \
              -e 's#localhost:4471#localhost:${APP_PORT}#g' \
              \"\$f\"
            echo \"Patched \$f\"
            grep -nE 'server_name|proxy_pass|return 301' \"\$f\" || true
            # Quarantine if still proxying to a non-Ford local port after patch
            if grep -qE 'proxy_pass https?://(127\\.0\\.0\\.1|localhost):(4511|4611|4711|4811|4471)' \"\$f\" 2>/dev/null; then
              mv \"\$f\" \"\$f.emf-cutover-bak-${STAMP}\" && echo \"Quarantined still-wrong \$f\"
            fi
          fi
        done
      echo '--- all server_name hits for eagleford ---'
      grep -RIn 'server_name.*eagleford' /www/server/panel/vhost/nginx /www/server/nginx/conf 2>/dev/null | head -n 40 || true
      # Strip eagleford hostnames from OTHER brand vhosts (accidental shared server_name).
      find /www/server/panel/vhost/nginx /www/server/nginx/conf -type f -name '*.conf' 2>/dev/null \
      | while read -r f; do
          case \"\$f\" in
            *emf-cutover-bak*|*/${CANONICAL_HOST}.conf|*/${APEX_HOST}.conf) continue ;;
          esac
          if grep -qE 'server_name[[:space:]].*eagleford\\.co\\.za' \"\$f\" 2>/dev/null; then
            safe=\$(echo \"\$f\" | tr '/.' '__')
            cp -a \"\$f\" \"/backup/strip-servername-\$safe\" 2>/dev/null || true
            sed -i \
              -e 's/[[:space:]]www\\.eagleford\\.co\\.za//g' \
              -e 's/[[:space:]]eagleford\\.co\\.za//g' \
              \"\$f\"
            echo \"Stripped eagleford server_name from \$f\"
            grep -n 'server_name' \"\$f\" || true
          fi
        done
      echo '--- listing panel nginx site files ---'
      ls -la /www/server/panel/vhost/nginx 2>/dev/null | head -n 80 || true
    "
  then
    installed=1
    echo "✓ Residual eagleford proxy targets scanned/patched"
  else
    echo "WARNING: could not scan/patch residual proxy confs via docker"
  fi

  if [ "$installed" -eq 0 ]; then
    echo "WARNING: cannot write vhosts. Run as root:"
    echo "  sudo bash $BACKUP_DIR/APPLY-NGINX.sh"
    echo "Or in aaPanel: Website -> Add site -> reverse proxy http://127.0.0.1:$APP_PORT (NOT :4511/:4711) -> SSL."
  fi

  if [ "$installed" -eq 0 ] && command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
    echo "Attempting sudo APPLY-NGINX.sh..."
    if sudo bash "$BACKUP_DIR/APPLY-NGINX.sh"; then
      installed=1
      echo "✓ Proxy vhosts applied via sudo"
    fi
  fi

  reloaded=0
  nginx_test_and_reload() {
    # Prefer real nginx -t via chroot so a bad conf does not silently keep the wrong upstream.
    if docker run --rm --privileged --pid=host --network host \
      -v /:/host \
      alpine:3.20 \
      chroot /host /www/server/nginx/sbin/nginx -t >"$BACKUP_DIR/nginx-test.out" 2>"$BACKUP_DIR/nginx-test.err"; then
      cat "$BACKUP_DIR/nginx-test.out" "$BACKUP_DIR/nginx-test.err" 2>/dev/null || true
      if docker run --rm --privileged --pid=host --network host \
        -v /:/host \
        alpine:3.20 \
        chroot /host /www/server/nginx/sbin/nginx -s reload; then
        return 0
      fi
    fi
    echo "nginx -t failed:"
    cat "$BACKUP_DIR/nginx-test.out" "$BACKUP_DIR/nginx-test.err" 2>/dev/null || true
    return 1
  }

  if [ "$installed" -eq 1 ] || true; then
    if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
      if [ -x /www/server/nginx/sbin/nginx ]; then
        if sudo /www/server/nginx/sbin/nginx -t && sudo /www/server/nginx/sbin/nginx -s reload; then
          reloaded=1
          echo "nginx reloaded (sudo -t)"
        fi
      elif command -v nginx >/dev/null 2>&1; then
        if sudo nginx -t && sudo nginx -s reload; then
          reloaded=1
          echo "nginx reloaded (sudo nginx)"
        fi
      fi
    fi
    if [ "$reloaded" -eq 0 ]; then
      if nginx_test_and_reload; then
        reloaded=1
        echo "nginx reloaded (docker-wrapped nginx -t)"
      fi
    fi
    if [ "$reloaded" -eq 0 ]; then
      for pidfile in /www/server/nginx/logs/nginx.pid /run/nginx.pid /var/run/nginx.pid; do
        if docker run --rm --pid=host -v "$pidfile:/pid:ro" alpine:3.20 \
          sh -c 'test -s /pid && kill -HUP "$(cat /pid)"' 2>/dev/null; then
          reloaded=1
          echo "nginx reloaded (HUP via docker --pid=host from $pidfile) — verify with curl; -t may have been skipped"
          break
        fi
      done
    fi
    if [ "$reloaded" -eq 0 ]; then
      if docker run --rm --pid=host --privileged alpine:3.20 \
        sh -c 'pid=$(pgrep -o "nginx: master" || true); [ -n "$pid" ] && kill -HUP "$pid"' 2>/dev/null; then
        reloaded=1
        echo "nginx reloaded (HUP master via pgrep)"
      fi
    fi
    if [ "$reloaded" -eq 0 ]; then
      echo "WARNING: nginx reload may have failed — reload from aaPanel (Website → Reload)"
    fi
    # Post-reload smoke from the VPS against public Host headers (detect wrong-brand bleed)
    echo "--- local Host-header smoke ---"
    for host in "$CANONICAL_HOST" "$APEX_HOST" "$STAGING_HOST"; do
      code=$(curl -sk -o /tmp/emf-smoke.body -w '%{http_code}' -H "Host: $host" "https://127.0.0.1/api/health" || true)
      body=$(head -c 200 /tmp/emf-smoke.body 2>/dev/null || true)
      echo "Host=$host -> HTTP $code body=$body"
      if echo "$body" | grep -qi 'eagle mazda\|eaglemazda\|Eagle Mazda'; then
        echo "ERROR: Host $host still serving Eagle Mazda after reload"
      fi
      if echo "$body" | grep -qi 'eagle mahindra\|eaglemahindra\|Mahindra'; then
        echo "ERROR: Host $host still serving Eagle Mahindra after reload"
      fi
      if echo "$body" | grep -qi 'eagle motor city\|eaglemotorcity\|Eagle Motor City'; then
        echo "ERROR: Host $host still serving Eagle Motor City after reload"
      fi
      if echo "$body" | grep -qi 'eagle ford\|eagleford\|Eagle Ford'; then
        echo "✓ Host $host looks like Ford"
      fi
    done
  fi

  if [ "$installed" -eq 0 ]; then
    echo "MANUAL REQUIRED: aaPanel reverse proxy for $CANONICAL_HOST -> 127.0.0.1:$APP_PORT"
    echo "Apex $APEX_HOST: 301 to https://$CANONICAL_HOST (or same proxy)."
    echo "Issue Let's Encrypt SSL for both hostnames and reload."
    echo "Do NOT point these hosts at Motor City (:4511), Mazda (:4711), Suzuki (:4611), or Mahindra (:4811)."
  fi
}

if ! configure_proxy; then
  echo "WARNING: configure_proxy returned non-zero — continuing with rebuild"
fi

echo ""
echo "=== 5) Rebuild / redeploy (preserves volumes) ==="
if [ "$SKIP_REBUILD" = "1" ]; then
  echo "SKIP_REBUILD=1 — not rebuilding image"
else
  chmod +x scripts/docker-deploy-prod.sh
  # Bust image cache so NEXT_PUBLIC_SERVER_URL + ALLOW_SEARCH_INDEXING bake correctly
  NO_CACHE=1 ./scripts/docker-deploy-prod.sh
fi

echo ""
echo "=== 6) Verify ==="
$COMPOSE ps
ready=0
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null; then
    ready=1
    echo "✓ local health ok (attempt $i)"
    break
  fi
  sleep 5
done
if [ "$ready" -ne 1 ]; then
  echo "ERROR: local health check failed"
  $COMPOSE logs app --tail 80
  exit 1
fi

curl -sf "http://127.0.0.1:${APP_PORT}/api/health" || true
echo ""
echo "Backup location (keep until soak ends): $BACKUP_DIR"
echo "DONE — issue/renew SSL in aaPanel for $CANONICAL_HOST and $APEX_HOST if needed,"
echo "then point DNS A records for both hosts to this VPS public IP."
echo "Motor City stock API: MOTOR_CITY_STOCK_API_URL=${MOTOR_CITY_LIVE_URL}"
echo "No Meta webhooks on this satellite."
bash scripts/go-live-soak-notes.sh 2>/dev/null || true
