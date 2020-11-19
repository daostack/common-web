import * as yup from 'yup';

import { CommonError, NotFoundError } from '../../util/errors';
import { validate } from '../../util/validate';
import { Nullable } from '../../util/types';
import { env, StatusCodes } from '../../constants';

import { isCommonMember } from '../../common/business';
import { commonDb } from '../../common/database';

import { IJoinRequestProposal, IProposalFile, IProposalLink } from '../proposalTypes';
import { fileValidationSchema, linkValidationSchema } from '../../util/schemas';
import { proposalDb } from '../database';
import { isCardOwner } from '../../circlepay/business/isCardOnwer';
import { assignCardToProposal } from '../../circlepay/createCirclePayCard';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

const createRequestToJoinValidationSchema = yup.object({
  commonId: yup
    .string()
    .uuid()
    .required(),

  proposerId: yup
    .string()
    .required(),

  cardId: yup
    .string()
    .required(),

  description: yup
    .string()
    .required(),

  funding: yup
    .number()
    .required(),

  links: yup.array(linkValidationSchema)
    .optional()
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

  // Check if the card is owned by the user
  if (!(await isCardOwner(payload.proposerId, payload.cardId))) {
    // Do not let them know if that card exists. It is just 'NotFound' even
    // if it exists, but is not theirs
    throw new NotFoundError(payload.cardId, 'card');
  }


  // Check if the user is already member of that common
  if (isCommonMember(common, payload.proposerId)) {
    throw new CommonError('User tried to create join request in common, that is a member of', {
      userMessage: 'Cannot create join request for commons, that you are a member of',
      statusCode: StatusCodes.BadRequest,

      payload
    });
  }

  // Check if the request is funded with less than required amount
  if (common.metadata.minFeeToJoin > payload.funding) {
    throw new CommonError('The funding cannot be less than the minimum required funding', {
      userMessage: `Your join request cannot be created, because the min fee to join is $${(common.metadata.minFeeToJoin / 100).toFixed(2)}, but you provided $${(payload.funding / 100).toFixed(2)}`,
      statusCode: StatusCodes.BadRequest,

      payload
    });
  }

  // Check if the user has ongoing join request
  const activeUserJoinRequest = await proposalDb.getProposals({
    proposerId: payload.proposerId,
    commonId: payload.commonId,
    state: 'countdown',
    type: 'join'
  });

  if (activeUserJoinRequest.length) {
    throw new CommonError('User with ongoing join request tried to create new one', {
      userMessage: 'You can only have one active join request per common',
      statusCode: StatusCodes.BadRequest
    });
  }

  // Create the document and save it
  const joinRequest = await proposalDb.addProposal({
    proposerId: payload.proposerId,
    commonId: payload.commonId,

    type: 'join',

    description: {
      description: payload.description,
      links: payload.links as Nullable<IProposalLink[]> || []
    },

    join: {
      cardId: payload.cardId,
      funding: payload.funding,
      fundingType: common.metadata.contributionType
    },

    countdownPeriod: env.durations.join.countdownPeriod,
    quietEndingPeriod: env.durations.join.quietEndingPeriod
  }) as IJoinRequestProposal;

  // Link the card to the proposal
  await assignCardToProposal(joinRequest.join.cardId, joinRequest.id);

  // Create event
  await createEvent({
    userId: payload.proposerId,
    objectId: joinRequest.id,
    type: EVENT_TYPES.REQUEST_TO_JOIN_CREATED
  });

  return joinRequest as IJoinRequestProposal;
};