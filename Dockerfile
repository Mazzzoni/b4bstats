# syntax=docker/dockerfile:1
ARG NODE_VERSION=22-bookworm-slim
FROM node:${NODE_VERSION} AS build

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.18.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM build AS generate

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Next.js reads .env.local during the build. Mount it without storing the file
# in an image layer; NEXT_PUBLIC_* values are embedded in the browser assets.
RUN --mount=type=secret,id=env_local,target=/app/.env.local,required=true \
    yarn export

FROM scratch AS export
COPY --from=generate /app/out/ /
