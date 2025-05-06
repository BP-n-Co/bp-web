# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Build the application
RUN npm run build

# Production stage using Node.js
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from build stage
COPY --from=build /app/build ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"] 