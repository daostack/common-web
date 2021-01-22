import * as yup from 'yup';
import { validate } from '../../../util/validate';
import { IPayoutEntity } from '../types';
import { createIndependentPayout } from './createIndependentPayout';
import { createProposalPayout } from './createProposalPayout';


const createPayoutValidationScheme = yup.object({
  type: yup
    .string()
    .required()
    .oneOf(['proposal', 'independent']),

  bankAccountId: yup
    .string()
    .required()
    .uuid(),

  amount: yup
    .number()
    .when('type', {
      is: (type: string) => type === 'independent',
      then: yup.number()
        .defined()
        .min(0)
    }),

  proposalId: yup
    .string()
    .when('type', {
      is: (type: string) => type === 'proposal',
      then: yup.string().required()
    })
});

type ICreatePayoutPayload = yup.InferType<typeof createPayoutValidationScheme>;

export const createPayout = async (payload: ICreatePayoutPayload): Promise<IPayoutEntity> => {
  // Validate the payload
  await validate(payload, createPayoutValidationScheme);

  // Extract the proposal type out of the payload
  const { type } = payload;

  delete payload.type;

  // Create the payout
  return type === 'independent'
    ? createIndependentPayout(payload)
    : createProposalPayout(payload);
};