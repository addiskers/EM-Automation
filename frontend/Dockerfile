FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variables for build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build the React app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy build files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]