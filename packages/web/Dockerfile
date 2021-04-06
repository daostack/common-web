FROM node:12 AS builder
WORKDIR /usr/src/app-build
COPY . .
RUN npm install && npm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app-build/build/ ./
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"] 