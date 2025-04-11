# Build Stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite project (output will be in the "dist" folder)
RUN npm run build

# Debugging: List the contents of the "dist" directory
RUN ls -l /app/dist

# Production Stage
FROM nginx:alpine

# Copy the built files from the "dist" folder to Nginx HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 8098

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
