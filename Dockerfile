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

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Set environment variables (placeholders, should be provided at runtime)
ENV METEOCONTROL_API_KEY=""
ENV METEOCONTROL_USER=""
ENV METEOCONTROL_PASSWORD=""
ENV METEOCONTROL_API_BASE_URL="https://api.meteocontrol.de/v2"

# Run the server
CMD ["node", "dist/index.js"]
