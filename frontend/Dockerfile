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

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG BACKEND_ENDPOINT


ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
ENV BACKEND_ENDPOINT=${BACKEND_ENDPOINT}
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
RUN  npm run build


FROM base AS runtime
WORKDIR /app


# ENV NODE_ENV=production
# ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
# ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
# ENV BACKEND_ENDPOINT=${BACKEND_ENDPOINT}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN apk add curl

COPY --from=dev-builder /app/public ./public
COPY --from=dev-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=dev-builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
