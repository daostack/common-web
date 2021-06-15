FROM node:12-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache git dumb-init
COPY yarn.lock lerna.json package.json /app/
RUN yarn bootstrap
COPY packages/core /app/packages/core
COPY packages/graphql /app/packages/graphql
COPY packages/worker /app/packages/worker
RUN yarn bootstrap
RUN yarn prisma generate
RUN cd /app/packages/core/ && \
     yarn run compile
RUN cd /app/packages/graphql/ && \
     yarn run compile
RUN cd /app/packages/worker/ && \
     yarn run compile
RUN apk del git
ENTRYPOINT ["/app/entrypoint.sh"]
