FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS dev-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN  npm run build


FROM base AS prod-builder
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev


FROM base AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV MONGODB_URI=mongodb://admin:password@127.0.0.1:27017/chatapp?authSource=admin
ENV JWT_SECRET=your_jwt_secret
ENV NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
	
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

RUN mkdir -p /app/logs
RUN chown -R nodejs:nodejs /app/logs

COPY --from=dev-builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=prod-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

USER nodejs

EXPOSE 3001

CMD ["node", "dist/server.js"]