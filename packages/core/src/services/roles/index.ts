import { createRoleCommand } from './commands/createRoleCommand';

import { addUserToRoleCommand } from './commands/users/addUserToRoleCommand';
import { removeUserFromRoleCommand } from './commands/users/removeUserFromRoleCommand';
import { rebuildUserPermissionsCommand } from './commands/users/rebuildUserPermissionsCommand';
import { editRoleCommand } from './commands/editRoleCommand';

export const roleService = {
  /**
   * Create new roles
   */
  create: createRoleCommand,

  /**
   * Edit one roles
   */
  edit: editRoleCommand,

  users: {
    /**
     * Add one user to one roles
     */
    addToRole: addUserToRoleCommand,

    /**
     * Remove one roles from one user
     */
    removeFromRole: removeUserFromRoleCommand,

    /**
     * Rebuild the user permissions
     */
    rebuildPermissions: rebuildUserPermissionsCommand
  },
  permissions: {}
};