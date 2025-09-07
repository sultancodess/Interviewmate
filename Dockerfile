# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run client:build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S interviewmate -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=interviewmate:nodejs server/package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --chown=interviewmate:nodejs --from=builder /app/server ./
COPY --chown=interviewmate:nodejs --from=builder /app/client/dist ./public

# Create uploads directory
RUN mkdir -p uploads && chown interviewmate:nodejs uploads

# Switch to non-root user
USER interviewmate

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]