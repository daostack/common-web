import * as yup from 'yup';

import { firestore } from 'firebase-admin';
import { discussionDb } from '../database';
import { CommonError } from '../../util/errors';
import {validate} from '../../util/validate';
import WriteResult = firestore.WriteResult;

const updateDiscussionDataValidationSchema = yup.object({
  discussionId: yup
    .string()
    .required(),

  messageOwner: yup
    .string()
    .required(),

  userId: yup
    .string()
    .required(),
})

type UpdateDiscussionPayload = yup.InferType<typeof updateDiscussionDataValidationSchema>

export const updateDiscussion = async (payload: UpdateDiscussionPayload) : Promise<WriteResult> => {
	
  await validate<UpdateDiscussionPayload>(payload, updateDiscussionDataValidationSchema); 
  
  const {discussionId, messageOwner, userId} = payload;

	if (messageOwner !== userId) {
    throw new CommonError('You cannot update this discussion');
	}

  return discussionDb.updateLastMessage(discussionId);
}