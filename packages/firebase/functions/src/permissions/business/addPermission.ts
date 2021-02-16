import * as yup from 'yup';

import {validate} from '../../util/validate';

import { userDb } from '../../core/domain/users/database';
import { Role } from '@common/types';
import { IUserEntity } from '@common/types';
import { CommonError } from '../../util/errors';

const setPermission = async (commonId: string, role: Role, userId: string): Promise<IUserEntity> => {
  try {
    const userDoc = await userDb.get(userId);
    const userRoles = userDoc?.roles || [];
    userRoles.push({role, data: {commonId}})
    userDoc.roles = userRoles;
    await userDb.update(userId, userDoc);
    return userDoc;
  } catch (error) {
    throw new CommonError(`Could not set permission ${role} to user ${userId}`)
  }
}

const addPermissionDataValidationScheme = yup.object({
  commonId: yup.string().required(),
  userId: yup.string().required(),
  role: yup.string()
    .oneOf(['founder', 'moderator', 'other']),
  requestByUserId: yup.string().required(),
});

type AddPermissionPayload = yup.InferType<typeof addPermissionDataValidationScheme>

/**
 * Updating permission of a user to make changes in a common
 * - For creating common, the user (userId) will get a 'founder' permission
 * - For a user (requestByUserId) asking to set permission to another user (userId),
 * we check that requestByUserId has sufficient permission to grant permission (getting this requestByUserId from the http request)
 * and if that user has permission (right now, meaning being founder) then userId will get the permission
 * 
 * @return The userDoc of the user who had his permission updated, or null, if there was an error
 * @param  commonId - The commonId of the common that we need to grand permission for
 * @param  userId - The id of the user who needs the permission
 * @param  role - The role we want to grand the user with userId
 * @param  requestByUserId - the userId of the user requestiong to grand permission to userId
 *                           * for common creation, it will be null, the userId will get the founder role
 *                           * for other operations, it will be id of the user who sent the http request
 */
export const addPermission = async (permissionPayload: AddPermissionPayload): Promise<IUserEntity> => {
  await validate<AddPermissionPayload>(
    permissionPayload,
    addPermissionDataValidationScheme
  )
  const {commonId, role, userId, requestByUserId} = permissionPayload;
  if (requestByUserId === userId) {
    // for when a common is being created
    return await setPermission(commonId, role as Role, userId);
  } else {
    const requestByUser = await userDb.get(requestByUserId);
    const roles = requestByUser.roles || [];
    let canGrantPermission = false;
    // right now, if requestByUser is a founder, he can grant permission to another user
    roles.forEach((roleObj) => {
      if (roleObj.role === 'founder' && roleObj.data.commonId === commonId) {
        canGrantPermission = true;
      }
    });
    if (canGrantPermission) {
      return await setPermission(commonId, role as Role, userId);
    }
  }
  return null;
}
