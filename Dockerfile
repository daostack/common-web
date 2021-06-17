FROM node:12-alpine as builder
WORKDIR /app
ENV NODE_ENV=dev
RUN apk add --no-cache git 
COPY yarn.lock lerna.json package.json /app/
RUN yarn bootstrap
COPY packages/core /app/packages/core
COPY packages/graphql /app/packages/graphql
COPY packages/worker /app/packages/worker
RUN yarn bootstrap
RUN cd packages/core && yarn db:generate
#RUN prisma generate
#RUN cd packages/core && prisma generate
RUN cd /app/packages/core/ && \
     yarn run compile
RUN cd /app/packages/graphql/ && \
     yarn run compile
RUN cd /app/packages/worker/ && \
     yarn run compile

FROM node:12-alpine 
ENV NODE_ENV=production
WORKDIR /app
RUN apk add dumb-init
COPY entrypoint.sh /app/entrypoint.sh
COPY yarn.lock lerna.json package.json /app/
COPY packages/core /app/packages/core
COPY packages/graphql /app/packages/graphql
COPY packages/worker /app/packages/worker
COPY --from=0 /app/packages/core/dist /app/packages/core/dist
COPY --from=0 /app/packages/graphql/dist /app/packages/graphql/dist
COPY --from=0 /app/packages/worker/dist /app/packages/worker/dist
RUN yarn
RUN yarn global add prisma@^2.21.1 && cd packages/core && yarn db:generate && yarn global remove prisma
ENTRYPOINT ["/app/entrypoint.sh"]
