# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and config files for build
COPY tsconfig.json ./
COPY src ./src

# Build the project
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Set base URL (non-sensitive)
ENV METEOCONTROL_API_BASE_URL="https://api.meteocontrol.de/v2"

# Use the non-root user
USER nodeapp

# Run the server
CMD ["node", "dist/index.js"]
