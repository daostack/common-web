import * as z from 'zod';
import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';

const schema = z.object({
  authId: z.string()
});

export const getUserIdQuery = async (query: z.infer<typeof schema>): Promise<string> => {
  // Validate the payload
  schema.parse(query);

  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      authId: query.authId
    },
    select: {
      id: true
    }
  });

  // Check if the common is found
  if (!user) {
    throw new NotFoundError('User.AuthId', query.authId);
  }

  return user.id;
};