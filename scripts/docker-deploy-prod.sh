#!/bin/sh
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
IMAGE="eagle-ford-app:latest"   # confirm with: docker compose -f docker-compose.prod.yml config | grep image

# 1. Mongo first
$COMPOSE up mongo -d --wait --wait-timeout 120

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

# 2. Build
docker build \
  --secret id=env,src=.env \
  --network=host \
  -t "$IMAGE" \
  .

# 3. App (+ stock-jobs if this stack has it)
APP_IMAGE="$IMAGE" $COMPOSE up -d app --no-build --wait --wait-timeout 300
# if stock-jobs exists:
# APP_IMAGE="$IMAGE" $COMPOSE up -d app stock-jobs --no-build --wait --wait-timeout 300
