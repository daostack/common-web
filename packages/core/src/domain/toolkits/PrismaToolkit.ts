import { PrismaClient } from '@prisma/client';
import { pubSub } from './PubSubToolkit';

const $prisma = new PrismaClient();

$prisma.$use(async (params, next) => {
  if (process.env['Logger.Database.Requests']) {
    console.debug('New database request', params);
  }

  return next(params);
});

$prisma.$use(async (params, next) => {
  const result = await next(params);

  if (params.action === 'update') {
    // Publish model updated event for the following
    if (params.model === 'Proposal') {
      await pubSub.publish(`${params.model}.${result.id}.Updated`, result);
    }
  }

  if (params.action === 'create') {
    // Publish created event for the following

    if (params.model === 'Notification') {
      await pubSub.publish(`Notifications.${result.userId}.Created`, result);
    }
  }

  return result;
});

export { EventType } from '@prisma/client';
export const prisma = $prisma;