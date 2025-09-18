FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

FROM base AS dev-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN  npm run build


FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dev-builder /app/public ./public
COPY --from=dev-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=dev-builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

ENV NODE_ENV=production

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
