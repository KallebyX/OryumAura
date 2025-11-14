# ====================================================================
# STAGE 1: Build Frontend
# ====================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# ====================================================================
# STAGE 2: Production Runtime
# ====================================================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy backend code
COPY --chown=nodejs:nodejs api ./api
COPY --chown=nodejs:nodejs scripts ./scripts

# Copy built frontend from builder stage
COPY --chown=nodejs:nodejs --from=frontend-builder /app/dist ./dist

# Copy environment example
COPY --chown=nodejs:nodejs .env.example ./

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Create database directory
RUN mkdir -p data && chown -R nodejs:nodejs data

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "api/index.js"]
