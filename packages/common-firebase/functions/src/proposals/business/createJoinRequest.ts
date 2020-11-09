import * as yup from 'yup';

import { IJoinRequestProposal } from '../proposalTypes';
import { CommonError } from '../../util/errors';
import { validate } from '../../util/validate';
import { StatusCodes } from '../../constants';
import { isCommonMember } from '../../common/business';
import { commonDb } from '../../common/database';

import { proposalDb } from '../database';

const createRequestToJoinValidationSchema = yup.object({
  commonId: yup
    .string()
    .uuid()
    .required(),

  userId: yup
    .string()
    .required(),

  description: yup
    .string()
    .required(),

  funding: yup
    .number()
    .required()
});

type CreateRequestToJoinPayload = yup.InferType<typeof createRequestToJoinValidationSchema>;

/**
 * Creates new join request based on the provided payload
 *
 * @throws { CommonError } - If the user is already member of that common
 * @throws { CommonError } - If the provided funding is less than the minimum for the common
 *
 * @param payload
 */
export const createJoinRequest = async (payload: CreateRequestToJoinPayload): Promise<IJoinRequestProposal> => {
  // Validate the data
  await validate(payload, createRequestToJoinValidationSchema);

  // Acquire the required data
  const common = await commonDb.getCommon(payload.commonId);

  // Check if the user is already member of that common
  if (isCommonMember(common, payload.userId)) {
    throw new CommonError('User tried to create join request in common, that is a member of', {
      userMessage: 'Cannot create join request for commons, that you are a member of',
      statusCode: StatusCodes.BadRequest,

      payload
    });
  }

  // Check if the request is funded with less than required amount
  if (common.metadata.minFeeToJoin > payload.funding) {
    throw new CommonError('The funding cannot be less than the minimum required funding', {
      userMessage: `Your join request cannot be created, because the min fee to join is ${common.metadata.minFeeToJoin}, but you provided ${payload.funding}`,
      statusCode: StatusCodes.BadRequest,

      payload
    });
  }

  // Create the document and save it
  const joinRequest = await proposalDb.addProposal({
    proposerId: payload.userId,
    commonId: payload.commonId,

    type: 'join',

    description: {
      description: payload.description
    },

    join: {
      funding: payload.funding,
      fundingType: common.metadata.contributionType
    }
  });

  // @todo Create event

  return joinRequest as IJoinRequestProposal;
};