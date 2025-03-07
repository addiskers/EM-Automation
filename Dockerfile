FROM node:20 AS builder

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm install --production

COPY backend ./backend

COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app/backend ./

COPY --from=builder /app/frontend/build ./public

RUN npm install --production

EXPOSE 8080

CMD ["node", "server.js"]
