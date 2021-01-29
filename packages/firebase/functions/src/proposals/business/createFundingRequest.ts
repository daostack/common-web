import * as yup from 'yup';

import { fileValidationSchema, imageValidationSchema, linkValidationSchema } from '../../util/schemas';
import { CommonError } from '../../util/errors';
import { validate } from '../../util/validate';
import { Nullable } from '../../util/types';
import { env, StatusCodes } from '../../constants';
import { isCommonMember } from '../../common/business';
import { commonDb } from '../../common/database';

import { proposalDb } from '../database';
import { IFundingRequestProposal, IProposalFile, IProposalImage, IProposalLink } from '../proposalTypes';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

const createFundingProposalValidationSchema = yup.object({
  commonId: yup
    .string()
    .uuid()
    .required(),

  proposerId: yup
    .string()
    .required(),

  title: yup
    .string()
    .required(),

  description: yup
    .string()
    .required(),

  amount: yup
    .number()
    .required(),

  links: yup.array(linkValidationSchema)
    .optional(),

  files: yup.array(fileValidationSchema)
    .optional(),

  images: yup.array(imageValidationSchema)
    .optional()
});

type CreateFundingProposalPayload = yup.InferType<typeof createFundingProposalValidationSchema>;

export const createFundingRequest = async (payload: CreateFundingProposalPayload): Promise<IFundingRequestProposal> => {
  await validate<CreateFundingProposalPayload>(payload, createFundingProposalValidationSchema);

  // Acquire the necessary data
  const common = await commonDb.get(payload.commonId);

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
      title: payload.title,
      description: payload.description,
      links: payload.links as Nullable<IProposalLink[]> || [],
      images: payload.images as Nullable<IProposalImage[]> || [],
      files: payload.files as Nullable<IProposalFile[]> || []
    },

    fundingRequest: {
      amount: payload.amount,
      funded: false,
    },

    countdownPeriod: env.durations.funding.countdownPeriod,
    quietEndingPeriod: env.durations.funding.quietEndingPeriod
  });

  // Emit funding request created event
  await createEvent({
    userId: payload.proposerId,
    objectId: fundingProposal.id,
    type: EVENT_TYPES.FUNDING_REQUEST_CREATED
  })

  // Return the payload
  return fundingProposal as IFundingRequestProposal;
};