# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:18-alpine

# Install serve for a lightweight static file server
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy build files from build stage
COPY --from=build /app/build ./build

# Set environment variables (can be overridden at runtime)
ENV PORT=3001
ENV REACT_APP_API_URL=http://api:3000

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["serve", "-s", "build", "-l", "3001"]