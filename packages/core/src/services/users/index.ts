import { createUserCommand } from './commands/createUserCommand';

import { getUserIdTokenQuery } from './queries/getUserIdTokenQuery';
import { userExistsQuery } from './queries/userExistsQuery';
import { getUserIdQuery } from './queries/getUserIdQuery';
import { createUserNotificationTokenCommand } from './commands/createUserNotificationTokenCommand';
import { voidUserNotificationTokenCommand } from './commands/voidUserNotificationTokenCommand';

export const userService = {
  commands: {
    /**
     * Creates new user in the database. Please verify the authentication
     * token because no authentication token is being verified here!
     *
     * @deprecated Use the root `create`
     */
    create: createUserCommand
  },

  /**
   * Creates new user in the database. Please verify the authentication
   * token because no authentication token is being verified here!
   */
  create: createUserCommand,

  /**
   * Create authentication token for  user in the database and
   * activates it
   */
  createNotificationToken: createUserNotificationTokenCommand,

  /**
   * Void the user notification token so no more notification
   * will be send to this token. Does not check if the currently
   * authenticated user is the owner of the token
   */
  voidNotificationToken: voidUserNotificationTokenCommand,

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
