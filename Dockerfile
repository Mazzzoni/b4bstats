# syntax=docker/dockerfile:1
FROM node:24.22.1-bookworm-slim AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.6 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=env_local,target=/app/.env.local pnpm build

FROM node:24.22.1-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1

COPY --from=build --chown=node:node /app/.next/main/standalone ./
COPY --from=build --chown=node:node /app/.next/main/static ./.next/main/static
COPY --from=build --chown=node:node /app/public ./public
USER node

EXPOSE 3000

CMD ["node", "server.js"]
