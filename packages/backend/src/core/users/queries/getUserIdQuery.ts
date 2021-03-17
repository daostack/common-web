import * as z from 'zod';
import { prisma } from '@toolkits';

const schema = z.object({
  authId: z.string()
});

export const getUserIdQuery = async (query: z.infer<typeof schema>): Promise<string> => {
  // Validate the payload
  schema.parse(query);

  // Return the result
  return (await prisma.user.findUnique({
    where: {
      authId: query.authId
    },
    select: {
      id: true
    }
  })).id;
};