FROM node:12-alpine
WORKDIR /app
COPY . /app
RUN apk add --no-cache git
RUN /bin/sh -c date
RUN yarn 
RUN /bin/sh -c date
RUN lerna bootstrap
RUN /bin/sh -c date
RUN yarn prisma generate
RUN /bin/sh -c date
RUN cd /app/packages/core/ && \
     yarn run compile 2>&1
RUN /bin/sh -c date
RUN cd /app/packages/graphql/ && \
     yarn run compile 2>&1
RUN /bin/sh -c date
RUN cd /app/packages/worker/ && \
     yarn run compile 2>&1
RUN /bin/sh -c date
ENTRYPOINT ["/app/entrypoint.sh"]
RUN /bin/sh -c date
