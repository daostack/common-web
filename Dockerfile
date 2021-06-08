FROM node:12 AS cache
WORKDIR /app
COPY ["lerna.json", "package.json", "yarn.lock", "./"]
COPY packages packages
RUN find packages \! -name "package.json" -o -name "lerna.json" -o -name "yarn.lock" -mindepth 2 -maxdepth 2 -print | xargs rm -rf


FROM node:12 AS builder
WORKDIR /app
COPY --from=0 /app .
RUN yarn bootstrap
COPY . .
RUN yarn prisma generate
RUN cd ./packages/core/ && \
     yarn run compile  && \
     cd ../graphql/ && \
     yarn run compile && \
     cd ../worker/ && \
     yarn run compile


#FROM node:12-alpine as prod
#WORKDIR /app
#COPY --from builder /app/packages/core/dist ./core
#COPY --from builder /app/packages/graphql/dist ./graphql
#COPY --from builder /app/packages/worker/dist ./worker
#ENTRYPOINT [node server ./worker]
