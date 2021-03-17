import * as yup from 'yup';

import {validate} from '../../util/validate';

import { commonDb } from '../../common/database';
import { Role } from '@common/types';
import { IUpdatableCommonEntity } from '../../common/database/updateCommon';
import { CommonError } from '../../util/errors';
import { hasPermission } from '../../core/domain/users/business';
import { PERMISSION } from '../../permissions/constants';

/**
 * [async description]
 * @param  commonId     - common id of the common that a user gets permission for
 * @param  role         - the role the user is being assigned to
 * @param  userId       - the id of the user who gets the permission
 * @return the updated common entity
 */
const setPermission = async (commonId: string, role: Role, userId: string): Promise<IUpdatableCommonEntity> => {
  try {
    const commonDoc = await commonDb.get(commonId);
    const members = commonDoc.members;
    members.forEach((member) => {
      if (member.userId === userId) {
        member.permission = role;
      }
    })
    commonDoc.members = members;
    return await commonDb.update(commonDoc);
  } catch (error) {
    throw new CommonError(`Could not set permission ${role} to user ${userId}`)
  }
}

const addPermissionDataValidationScheme = yup.object({
  commonId: yup.string().required(),
  userId: yup.string().required(),
  role: yup.string()
    .oneOf(Object.values(PERMISSION)),
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
export const addPermission = async (permissionPayload: AddPermissionPayload): Promise<IUpdatableCommonEntity> => {
  await validate<AddPermissionPayload>(
    permissionPayload,
    addPermissionDataValidationScheme
  )
  const {commonId, role, userId, requestByUserId} = permissionPayload;
  const canGrantPermission = await hasPermission(requestByUserId, commonId);
  if (canGrantPermission) {
      return await setPermission(commonId, role as Role, userId);
  }
  return null;
}
