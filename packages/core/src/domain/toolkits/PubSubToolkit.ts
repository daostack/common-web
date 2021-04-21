import { RedisPubSub } from 'graphql-redis-subscriptions';

const $pubSub = new RedisPubSub();


export const pubSub = $pubSub;