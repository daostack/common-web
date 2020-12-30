import admin from 'firebase-admin';

import WriteResult = admin.firestore.WriteResult;

import { Nullable } from '../../util/types';
import { ArgumentError } from '../../util/errors';
import { CommonCollection } from '../../backoffice/database';

/**
 * Deletes common. Use carefully. If you want to cleanly delete the
 * common use `deleteCommon` from the common business folder
 *
 * @param commonId - The id of the common we want to delete
 *
 * @throws { CommonError } - If the common ID is not provided
 */
export const deleteCommonFromDatabase = async (commonId: Nullable<string>): Promise<WriteResult> => {
  if (!commonId) {
    throw new ArgumentError('commonId');
  }

  logger.notice(`Deleting common with ID ${commonId}`);

  return (await CommonCollection
    .doc(commonId)
    .delete());
};