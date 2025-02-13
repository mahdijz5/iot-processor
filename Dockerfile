FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build 

FROM node:18-alpine as prod
ENV NODE_ENV="prod"
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json .
COPY .env.prod .env

EXPOSE 33000
EXPOSE 14444

CMD ["node",  "dist/main"]

