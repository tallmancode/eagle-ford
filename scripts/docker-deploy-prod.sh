#!/bin/bash
set -e

# Loads COMPOSE_PROJECT_NAME, APP_HOST_PORT, MONGO_HOST_PORT, APP_IMAGE from .env when present.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

COMPOSE="docker compose -f docker-compose.prod.yml"
APP_PORT="${APP_HOST_PORT:-4411}"
MONGO_PORT="${MONGO_HOST_PORT:-4422}"
IMAGE="${APP_IMAGE:-eagle-ford-app:latest}"

if [ -f .env ] && grep -q '^PAYLOAD_CONFIG_PATH=' .env; then
  echo "ERROR: PAYLOAD_CONFIG_PATH must not be set for Docker deploy."
  echo "Remove it from .env — the container uses /app and resolves config via @payload-config."
  exit 1
fi

echo "Compose project: ${COMPOSE_PROJECT_NAME:-(directory default)}"
echo "App port: $APP_PORT  Mongo port: $MONGO_PORT  Image: $IMAGE"

if ! $COMPOSE up mongo -d --wait --wait-timeout 120; then
  echo ""
  echo "=== MongoDB container logs ==="
  $COMPOSE logs mongo --tail 80
  echo "ERROR: MongoDB failed to become healthy. Check logs above."
  exit 1
fi

echo "Waiting for Mongo on 127.0.0.1:$MONGO_PORT..."
for i in $(seq 1 60); do
  if timeout 1 bash -c "echo > /dev/tcp/127.0.0.1/$MONGO_PORT" 2>/dev/null; then
    echo "Mongo ready"
    break
  fi
  sleep 1
done
timeout 1 bash -c "echo > /dev/tcp/127.0.0.1/$MONGO_PORT" 2>/dev/null \
  || { echo "Mongo not reachable on $MONGO_PORT"; exit 1; }

BUILD_ARGS=(--progress=plain --secret id=env,src=.env --network=host -t "$IMAGE")
if [ "${NO_CACHE:-0}" = "1" ]; then
  BUILD_ARGS=(--no-cache "${BUILD_ARGS[@]}")
  echo "Building with --no-cache"
fi
echo "Starting Docker build (often 10–15 minutes)..."
docker build "${BUILD_ARGS[@]}" . &
build_pid=$!
while kill -0 "$build_pid" 2>/dev/null; do
  echo "[deploy heartbeat $(date -u +%Y-%m-%dT%H:%M:%SZ)] docker build in progress..."
  sleep 45
done
if ! wait "$build_pid"; then
  echo "ERROR: docker build failed"
  exit 1
fi
echo "Docker build finished"

# 3. Start app from pre-built image
APP_IMAGE="$IMAGE" $COMPOSE up -d app --no-build --wait --wait-timeout 300
APP_IMAGE="$IMAGE" $COMPOSE up -d lead-jobs --no-build 2>/dev/null || true

echo "Pruning dangling Docker images..."
docker image prune -f >/dev/null || true
echo "Docker image prune finished"
