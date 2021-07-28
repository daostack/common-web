import { RedisPubSub } from 'graphql-redis-subscriptions';

const $pubSub = new RedisPubSub({
  connection: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
});


export const pubSub = $pubSub;