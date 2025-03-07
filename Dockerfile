FROM node:20 AS builder

WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production

# Copy backend files
COPY backend ./backend

# Build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Prepare final image
FROM node:20 AS production

WORKDIR /app

# Copy backend
COPY --from=builder /app/backend ./

# Copy frontend build to backend `public/` folder
COPY --from=builder /app/frontend/build ./public

RUN npm install --production

EXPOSE 8080

CMD ["node", "server.js"]
