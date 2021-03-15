import * as z from 'zod';
import { userService } from '@services';
import { User } from '@prisma/client';
import { prisma } from '@toolkits';

const schema = z.object({
  authId: z.string()
    .nonempty()
    .refine(async (value) => {
      return !(await userService.queries.exists({
        authId: value
      }));
    }, {
      message: 'The auth ID is already in use. That means that the user already has an account'
    }),

  firstName: z.string()
    .nonempty(),

  lastName: z.string()
    .nonempty(),

  email: z.string()
    .nonempty()
    .email()
    .refine(async (value) => {
      return !(await userService.queries.exists({
        email: value
      }));
    }, {
      message: 'The email address is already in use'
    })
});

export const createUserCommand = async (command: z.infer<typeof schema>): Promise<User> => {
  // Basic validation on the payload
  await schema.parseAsync(command);

  // Create the user
  const user = await prisma.user.create({
    data: {
      ...command
    }
  });

  // @todo Create event about the creation of the user
  // @todo Logger

  // Finally return the created user
  return user;
};