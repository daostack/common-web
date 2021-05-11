FROM node:16.0.0-buster AS builder
WORKDIR /usr/src/app-build
COPY . .
RUN  npm install -g typescript  && \
     cd ./packages/core/        && \
     yarn run compile           && \
     cd ../packages/queues/     && \
     yarn run compile          