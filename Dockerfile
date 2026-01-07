FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN npm install -g pm2
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000
# Ensure we bind to 0.0.0.0 explicitly
CMD ["node", "dist/index.cjs"]
