import * as yup from 'yup';

import { ICommonUpdate } from '@common/types';
import { IUpdatableCommonEntity } from '../database/updateCommon';
import { commonDb } from '../database';
import { createCommonHistory } from '../../commonEditHistory/business';
import { UnauthorizedError } from '../../util/errors';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';
import { commonRuleValidationSchema } from '../../util/schemas';
import { validate } from '../../util/validate';
import { urlRegex } from '../../util/regex';
import { hasPermission } from '../../core/domain/users/business';


const updateCommonDataValidationScheme = yup.object({
  commonId: yup
    .string()
    .required(),

  userId: yup
    .string()
    .required(),

  changes: yup.object({
    name: yup.string().optional(),
    rules: yup.array(commonRuleValidationSchema).optional(),

    metadata: yup.object({
      byline: yup.string().optional(),
      description: yup.string().optional()
    }),
    image: yup.string()
      .test('url', 'You must provide a valid URL', (value) => {
        return new RegExp(urlRegex).test(value);
      })
      .optional()
  })
});

type UpdateCommonPayload = yup.InferType<typeof updateCommonDataValidationScheme>

/**
 * Updating the common with the new data in commonUpdate
 * @param payload - contains data of user and common updates
 * @return updatedCommon     - the common doc after the update
 */
export const updateCommon = async (payload: UpdateCommonPayload): Promise<IUpdatableCommonEntity> => {

  await validate<UpdateCommonPayload>(payload, updateCommonDataValidationScheme);
  const currCommon = await commonDb.get(payload.commonId);

  const canEditCommon = await hasPermission(payload.userId, payload.commonId);

  if (!canEditCommon) {
    throw new UnauthorizedError();
  }

  // the doc that was saved in the commonEditHistory collection
  const commonHistoryRecord = await createCommonHistory(payload as ICommonUpdate, currCommon);
  const updatedCommon = await commonDb.update(payload.changes as IUpdatableCommonEntity);

  await createEvent({
    userId: commonHistoryRecord.changedBy,
    objectId: commonHistoryRecord.commonId,
    type: EVENT_TYPES.COMMON_UPDATED
  });

  return updatedCommon;
};
