#!/bin/bash
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
IMAGE="eagle-ford-app:latest"

if [ -f .env ] && grep -q '^PAYLOAD_CONFIG_PATH=' .env; then
  echo "ERROR: PAYLOAD_CONFIG_PATH must not be set for Docker production."
  echo "Remove it from .env — the container uses /app and resolves config via @payload-config."
  exit 1
fi

# 1. Start mongo, wait for compose health + host port (build uses 127.0.0.1:4422)
if ! $COMPOSE up mongo -d --wait --wait-timeout 120; then
  echo ""
  echo "=== MongoDB container logs ==="
  $COMPOSE logs mongo --tail 80
  echo "ERROR: MongoDB failed to become healthy. Check logs above."
  exit 1
fi

echo "Waiting for Mongo on 127.0.0.1:4422..."
for i in $(seq 1 60); do
  if timeout 1 bash -c 'echo > /dev/tcp/127.0.0.1/4422' 2>/dev/null; then
    echo "Mongo ready"
    break
  fi
  sleep 1
done
timeout 1 bash -c 'echo > /dev/tcp/127.0.0.1/4422' 2>/dev/null \
  || { echo "Mongo not reachable on 4422"; exit 1; }

# 2. Build (host network so BUILD_DATABASE_URL can reach published mongo)
docker build \
  --secret id=env,src=.env \
  --network=host \
  -t "$IMAGE" \
  .

# 3. Start app from pre-built image
APP_IMAGE="$IMAGE" $COMPOSE up -d app --no-build --wait --wait-timeout 300
