import { createUserCommand } from './commands/createUserCommand';

import { getUserIdTokenQuery } from './queries/getUserIdTokenQuery';
import { userExistsQuery } from './queries/userExistsQuery';
import { getUserIdQuery } from './queries/getUserIdQuery';

export const userService = {
  commands: {
    /**
     * Creates new user in the database. Please verify the authentication
     * token because no authentication token is being verified here!
     */
    create: createUserCommand
  },

  queries: {
    /**
     * Generates authentication token for given UID. Works
     * only in dev environment
     */
    getIdToken: getUserIdTokenQuery,

    /**
     * Checks if the passed used exist in the database
     */
    exists: userExistsQuery,

    /**
     * Gets the user ID if found by one of the passed arguments
     */
    getId: getUserIdQuery
  }
};
