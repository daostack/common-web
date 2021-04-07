import * as z from 'zod';

import { prisma } from '../../../domain/toolkits/index';

const schema = z
  .object({
    id: z.string(),
    email: z.string()
  })
  .partial();

export const userExistsQuery = async (query: z.infer<typeof schema>): Promise<boolean> => {
  const userCount = await prisma.user.count({
    where: query
  });

  return userCount !== 0;
};