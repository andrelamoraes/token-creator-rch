# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Set environment variables
ENV REACT_APP_API_URL=http://18.188.184.52:3000

# Use a lightweight web server to serve the built application
FROM nginx:alpine

# Copy the built application to the Nginx HTML directory
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
