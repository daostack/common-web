import * as yup from 'yup';

import { IFundingRequestProposal, IProposalLink } from '../proposalTypes';
import { CommonError, NotImplementedError } from '../../util/errors';
import { validate } from '../../util/validate';
import { isCommonMember } from '../../common/business';
import { commonDb } from '../../common/database';
import { env, StatusCodes } from '../../constants';
import { proposalDb } from '../database';
import { linkValidationSchema } from '../shemas';
import { Nullable } from '../../util/types';

const createFundingProposalValidationSchema = yup.object({
  commonId: yup
    .string()
    .uuid()
    .required(),

  proposerId: yup
    .string()
    .required(),

  description: yup
    .string()
    .required(),

  amount: yup
    .number()
    .required(),

  links: yup.array(linkValidationSchema)
    .optional()
});

type CreateFundingProposalPayload = yup.InferType<typeof createFundingProposalValidationSchema>;

export const createFundingRequest = async (payload: CreateFundingProposalPayload): Promise<IFundingRequestProposal> => {
  await validate<CreateFundingProposalPayload>(payload, createFundingProposalValidationSchema);

  // Acquire the necessary data
  const common = await commonDb.getCommon(payload.commonId);

  // Check if user is member of the common
  if (!isCommonMember(common, payload.proposerId)) {
    throw new CommonError('User tried to create funding request in common, that he is not part of', {
      statusCode: StatusCodes.Forbidden,

      userMessage: 'You can only create funding requests in commons, that you are part of',

      commonId: common.id,
      userId: payload.proposerId
    });
  }

  // @question
  //    Is this necessary tho? The funding request should
  //    be made and paid when the common has enough funding?

  // @todo Check if the common has enough funds


  // Create the funding proposal
  const fundingProposal = await proposalDb.addProposal({
    proposerId: payload.proposerId,
    commonId: payload.commonId,

    type: 'fundingRequest',

    description: {
      description: payload.description,

      links: payload.links as Nullable<IProposalLink[]>|| []
    },

    fundingRequest: {
      amount: payload.amount
    },

    countdownPeriod: env.durations.funding.countdownPeriod,
    quietEndingPeriod: env.durations.funding.quietEndingPeriod
  });

  // @todo Broadcast the event

  // Return the payload
  return fundingProposal as IFundingRequestProposal;
};