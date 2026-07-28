#!/bin/sh
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
DEPLOY_REVISION="${DEPLOY_REVISION:-$(git rev-parse --verify --short HEAD)}"
IMAGE="eagle-ford-app:${DEPLOY_REVISION}"
LATEST_IMAGE="eagle-ford-app:latest"

if [ -f .env ] && grep -q '^PAYLOAD_CONFIG_PATH=' .env; then
  echo "ERROR: PAYLOAD_CONFIG_PATH must not be set for Docker production."
  echo "Remove it from .env — the container uses /app and resolves config via @payload-config."
  exit 1
fi

# 1. Start mongo, wait for compose health + host port.
$COMPOSE up mongo -d --wait --wait-timeout 120

if [ -z "${MONGO_HOST_PORT:-}" ]; then
  MONGO_HOST_PORT="$($COMPOSE port mongo 27017 | awk -F: 'NR == 1 { print $NF }')"
fi

echo "Waiting for Mongo on 127.0.0.1:${MONGO_HOST_PORT}..."
for i in $(seq 1 60); do
  if timeout 1 bash -c "echo > /dev/tcp/127.0.0.1/${MONGO_HOST_PORT}" 2>/dev/null; then
    echo "Mongo ready"
    break
  fi
  sleep 1
done
timeout 1 bash -c "echo > /dev/tcp/127.0.0.1/${MONGO_HOST_PORT}" 2>/dev/null \
  || { echo "Mongo not reachable on ${MONGO_HOST_PORT}"; exit 1; }

# 2. Build (host network so BUILD_DATABASE_URL can reach published mongo)
docker build \
  --secret id=env,src=.env \
  --network=host \
  -t "$IMAGE" \
  -t "$LATEST_IMAGE" \
  .

# 3. Start app from pre-built image
APP_IMAGE="$IMAGE" $COMPOSE up -d app --no-build --wait --wait-timeout 300

printf '%s\n' "$DEPLOY_REVISION" > .deploy-revision
