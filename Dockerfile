FROM node:12-alpine
WORKDIR /app
COPY . /app
RUN apk add --no-cache git
RUN yarn bootstrap
RUN yarn prisma generate
RUN cd /app/packages/core/ && \
     yarn run compile
RUN cd /app/packages/graphql/ && \
     yarn run compile
RUN cd /app/packages/worker/ && \
     yarn run compile
ENTRYPOINT ["/app/entrypoint.sh"]
