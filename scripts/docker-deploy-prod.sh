#!/bin/sh
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
IMAGE="eagle-ford-app:latest"

if [ -f .env ] && grep -q '^PAYLOAD_CONFIG_PATH=' .env; then
  echo "ERROR: PAYLOAD_CONFIG_PATH must not be set for Docker production."
  echo "Remove it from .env — the container uses /app and resolves config via @payload-config."
  exit 1
fi

# 1. Start mongo and wait for it to be healthy
$COMPOSE up mongo -d --wait

# 2. Build the app image with env secrets and host network access for DB
docker build \
  --secret id=env,src=.env \
  --network=host \
  -t "$IMAGE" \
  .

# 3. Start / recreate the app container using the pre-built image
APP_IMAGE="$IMAGE" $COMPOSE up -d app --no-build --wait
