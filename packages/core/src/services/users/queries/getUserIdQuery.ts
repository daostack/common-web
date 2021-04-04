import * as z from 'zod';
import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';

const schema = z.object({
  email: z.string()
    .email()
});

export const getUserIdQuery = async (query: z.infer<typeof schema>): Promise<string> => {
  // Validate the payload
  schema.parse(query);

  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      email: query.email
    },
    select: {
      id: true
    }
  });

  // Check if the user is found
  if (!user) {
    throw new NotFoundError('User.Email', query.email);
  }

  return user.id;
};