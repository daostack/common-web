import { PrismaClient } from '@prisma/client';

const $prisma = new PrismaClient();

$prisma.$use(async (params, next) => {
  if (process.env['Logger.Database.Requests']) {
    console.debug('New database request', params);
  }

  return next(params);
});

export const prisma = $prisma;