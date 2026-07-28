# syntax=docker/dockerfile:1.7
# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# pnpm-workspace.yaml + patches/ are required so patchedDependencies match the lockfile.
# Use pnpm 11 to match the lockfile (pnpm 10 fails with ERR_PNPM_LOCKFILE_CONFIG_MISMATCH on patches).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY patches ./patches
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  corepack enable && \
  corepack prepare pnpm@11.8.0 --activate && \
  pnpm config set store-dir /pnpm/store && \
  pnpm install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build with: docker build --secret id=env,src=.env --network=host -t esm-app:latest .
# Env is mounted at /run/secrets/env (not baked into image layers).
# BUILD_DATABASE_URL in .env overrides DATABASE_URL during build only (--network=host reaches port 4422).
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  --mount=type=secret,id=env,required=true --network=host \
  set -a && . /run/secrets/env && set +a && \
  export DATABASE_URL="${BUILD_DATABASE_URL:-$DATABASE_URL}" && \
  corepack enable && \
  corepack prepare pnpm@11.8.0 --activate && \
  pnpm config set store-dir /pnpm/store && \
  pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN mkdir -p public/media/uploads && chown -R nextjs:nodejs public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
