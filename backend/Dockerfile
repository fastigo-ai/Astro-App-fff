# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies required for node-gyp (if any native modules are used)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for TS build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Don't run as root for security purposes
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy only production dependencies (speeds up builds and reduces image size)
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from the builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose API port
EXPOSE 8000

# Default command (API). Can be overridden in docker-compose for the worker.
CMD ["npm", "run", "start:api"]
