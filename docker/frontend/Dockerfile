# Stage 1: Build frontend
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY ../../src/client/package*.json ./
RUN npm ci

# Copy all frontend source and build
COPY ../../src/client ./
RUN npm run build

# Stage 2: Serve frontend with Nginx
FROM nginx:alpine

# Copy custom Nginx config
COPY frontend.nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend build from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy SSL certificates from project
COPY ssl/django-selfsigned.crt /etc/ssl/certs/django-selfsigned.crt
COPY ssl/django-selfsigned.key /etc/ssl/private/django-selfsigned.key

# Expose HTTPS port
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]