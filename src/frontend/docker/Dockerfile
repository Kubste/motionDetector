# https://alvincrespo.hashnode.dev/react-vite-production-ready-docker

FROM node:23-alpine as build

RUN mkdir /app

# Set working directory
WORKDIR /app

# Copy package files
COPY ./client/package.json ./client/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY ./client ./

# Build the app - /app/dist
RUN npm run build

# Serve stage
FROM nginx:alpine

COPY ./docker/ssl/django-selfsigned.crt /etc/ssl/certs/django-selfsigned.crt
COPY ./docker/ssl/django-selfsigned.key /etc/ssl/private/django-selfsigned.key

COPY ./docker/nginx.conf /etc/nginx/conf.d/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (will be overridden by Render)
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]