FROM node:24-alpine AS deps
ENV NODE_ENV=production
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM deps AS build-deps
RUN pnpm install --frozen-lockfile
COPY index.html vite.config.ts tsconfig.json ./
COPY ./src ./src

FROM build-deps AS build-backend
RUN pnpm run build:backend

FROM build-deps AS build-frontend
RUN pnpm run build:frontend

FROM deps AS runner

COPY --from=build-backend /app/dist ./dist
COPY --from=build-frontend /app/dist/frontend ./dist/frontend

EXPOSE 3000
CMD ["node", "dist/index.js"]