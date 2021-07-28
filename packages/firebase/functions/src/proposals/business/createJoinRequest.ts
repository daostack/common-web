import { IJoinRequestProposal, IProposalLink } from '@common/types';
import * as yup from 'yup';

import { isCardOwner } from '../../circlepay/cards/business/isCardOwner';
import { isCommonMember } from '../../common/business';
import { commonDb } from '../../common/database';
import { env, StatusCodes } from '../../constants';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';
import { isTest } from '../../util/environment';
import { CommonError, NotFoundError } from '../../util/errors';
import { linkValidationSchema } from '../../util/schemas';
import { Nullable } from '../../util/types';
import { validate } from '../../util/validate';
import { proposalDb } from '../database';

const createRequestToJoinValidationSchema = yup.object({
  commonId: yup.string().uuid().required(),

  proposerId: yup.string().required(),

  cardId: yup.string().optional(),

  description: yup.string().required(),

  funding: yup.number().required(),

  links: yup.array(linkValidationSchema).optional(),

  ipAddress: yup.string().required()
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
  const common = await commonDb.get(payload.commonId);

  // @todo Make it work without difference for running in test mode (tests are needed for circlepay)
  // Check if the card is owned by the user (only if not in tests)
  if (
    !isTest &&
    payload.funding > 0 &&
    !(await isCardOwner(payload.proposerId, payload.cardId))
  ) {
    // Do not let them know if that card exists. It is just 'NotFound' even
    // if it exists, but is not theirs
    throw new NotFoundError(payload.cardId, 'card');
  }

  // Check if the user is already member of that common
  if (isCommonMember(common, payload.proposerId)) {
    throw new CommonError(
      'User tried to create join request in common, that is a member of',
      {
        userMessage:
          'Cannot create join request for commons, that you are a member of',
        statusCode: StatusCodes.BadRequest,

        payload
      }
    );
  }

  if (common.metadata.minFeeToJoin > payload.funding
    && (!common.metadata.zeroContribution || payload.funding !== 0)) {
    throw new CommonError('The funding cannot be less than the minimum required funding', {
        userMessage: `Your join request cannot be created, because the min fee to join is $${(common.metadata.minFeeToJoin / 100)
          .toFixed(2)}, but you provided $${(payload.funding / 100).toFixed(2)}`,
        statusCode: StatusCodes.BadRequest,

        payload
      }
    );
  }

  // Check if the user has ongoing join request
  const activeUserJoinRequest = await proposalDb.getMany({
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
  const joinRequest = (await proposalDb.addProposal({
    proposerId: payload.proposerId,
    commonId: payload.commonId,

    type: 'join',

    description: {
      description: payload.description,
      links: (payload.links as Nullable<IProposalLink[]>) || []
    },

    join: {
      ip: payload.ipAddress,
      cardId: payload.cardId,
      funding: payload.funding,
      fundingType: common.metadata.contributionType,
      payments: []
    },

    countdownPeriod: env.durations.join.countdownPeriod,
    quietEndingPeriod: env.durations.join.quietEndingPeriod
  })) as IJoinRequestProposal;

  // Link the card to the proposal
  if (!isTest) {
    // await assignCardToProposal(joinRequest.join.cardId, joinRequest.id);
    // @todo Do the opposite: add the card id to the proposal
  }

  // Create event
  await createEvent({
    userId: payload.proposerId,
    objectId: joinRequest.id,
    type: EVENT_TYPES.REQUEST_TO_JOIN_CREATED
  });

  return joinRequest as IJoinRequestProposal;
};
