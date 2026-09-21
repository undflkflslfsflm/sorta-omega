FROM node:22.19-bookworm-slim AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/local-worker/package.json apps/local-worker/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN corepack prepare pnpm@10.15.1 --activate && pnpm install --frozen-lockfile

COPY apps ./apps
COPY packages ./packages
RUN pnpm build

FROM node:22.19-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/packages/contracts ./packages/contracts

EXPOSE 3210
RUN mkdir -p /var/lib/sorta/blob-storage/blobs && chown -R node:node /var/lib/sorta
USER node
CMD ["sh", "-c", "node apps/api/dist/migrate.js && node apps/api/dist/server.js"]
