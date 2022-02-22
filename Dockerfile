FROM node:12 AS builder
WORKDIR /usr/src/app-build
COPY . .
ARG REACT_APP_ENV=dev 
RUN npm install && npm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app-build/build/ ./
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"] 
