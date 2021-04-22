import { createRoleCommand } from './commands/createRoleCommand';

import { addUserToRoleCommand } from './commands/users/addUserToRoleCommand';
import { removeUserFromRoleCommand } from './commands/users/removeUserFromRoleCommand';
import { rebuildUserPermissionsCommand } from './commands/users/rebuildUserPermissionsCommand';

export const roleService = {
  /**
   * Create new role
   */
  create: createRoleCommand,

  users: {
    /**
     * Add one user to one role
     */
    addToRole: addUserToRoleCommand,

    /**
     * Remove one role from one user
     */
    removeFromRole: removeUserFromRoleCommand,

    /**
     * Rebuild the user permissions
     */
    rebuildPermissions: rebuildUserPermissionsCommand
  },
  permissions: {}
};