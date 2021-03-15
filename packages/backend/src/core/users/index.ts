import { createUserCommand } from './commands/createUserCommand';
import { userExistsQuery } from './queries/userExistsQuery';

export const userService = {
  commands: {
    /**
     * @todo Write docs
     */
    create: createUserCommand
  },

  queries: {
    /**
     * @todo Write docs
     */
    exists: userExistsQuery
  }
};