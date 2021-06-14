FROM common-backend-cache
WORKDIR /app
COPY . /app
RUN yarn bootstrap
RUN yarn prisma generate
RUN cd /app/packages/core/ && \
     yarn run compile
RUN cd /app/packages/graphql/ && \
     yarn run compile
RUN cd /app/packages/worker/ && \
     yarn run compile
ENTRYPOINT ["/app/entrypoint.sh"]
