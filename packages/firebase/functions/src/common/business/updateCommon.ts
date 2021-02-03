import * as yup from 'yup';

import { ICommonUpdate } from '@common/types';
import { IUpdatableCommonEntity } from '../database/updateCommon';
import { commonDb } from '../database';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';
import { commonRuleValidationSchema } from '../../util/schemas';
import { createCommonHistory } from '../../commonEditHistory/business';
import { CommonError } from '../../util/errors';
import {validate} from '../../util/validate';



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
       description: yup.string().optional(),
     }),
     image: yup.string().url().optional(),
   }),
})

type UpdateCommonPayload = yup.InferType<typeof updateCommonDataValidationScheme>

/**
 * Updating the common with the new data in commonUpdate
 * @param payload - contains data of user and common updates
 * @return updatedCommon     - the common doc after the update
 */
export const updateCommon = async (payload: UpdateCommonPayload) : Promise<IUpdatableCommonEntity> => {

  await validate<UpdateCommonPayload>(payload, updateCommonDataValidationScheme)
  const currCommon = await commonDb.get(payload.commonId);
  // TODO check if user has permission to edit this common when permissions pr is merged
  
   if (currCommon.metadata.founderId !== payload.userId) {
     throw new CommonError('Try again when you created the common')
   }

  // the doc that was saved in the commonEditHistory collection
  const commonHistoryRecord = await createCommonHistory(payload as ICommonUpdate, currCommon);
  const updatedCommon = await commonDb.update(payload.changes as  IUpdatableCommonEntity)

  await createEvent({
    userId: commonHistoryRecord.changedBy,
    objectId: commonHistoryRecord.commonId,
    type: EVENT_TYPES.COMMON_UPDATED
  })

  return updatedCommon;
}
