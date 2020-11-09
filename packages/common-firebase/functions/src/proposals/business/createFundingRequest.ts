import * as yup from 'yup';

import { IFundingRequestProposal } from '../proposalTypes';
import { NotImplementedError } from '../../util/errors';
import { validate } from '../../util/validate';

const createFundingProposalValidationSchema = yup.object({
  commonId: yup
    .string()
    .uuid()
    .required()
});

type CreateFundingProposalPayload = yup.InferType<typeof createFundingProposalValidationSchema>;

export const createFundingProposal = async (payload: CreateFundingProposalPayload): Promise<IFundingRequestProposal> => {
  await validate<CreateFundingProposalPayload>(payload, createFundingProposalValidationSchema);

  // Check if user is member of the common
  // Check if the common has enough funds
  // Create the funding proposal
  // Broadcast the event
  // Return the payload

  throw new NotImplementedError();
}