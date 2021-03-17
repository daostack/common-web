import { createUserCommand } from './commands/createUserCommand';
import { userExistsQuery } from './queries/userExistsQuery';
import { getUserIdQuery } from './queries/getUserIdQuery';

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
    exists: userExistsQuery,

    /**
     * @todo Write docs
     */
    getId: getUserIdQuery
  }
};