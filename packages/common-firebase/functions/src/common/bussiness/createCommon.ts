import yup from 'yup';
import { ContributionType, ICommonEntity } from '../types';
import { CommonError, NotImplementedError } from '../../util/errors';
import { validate } from '../../util/validate';
import { commonDb } from '../database';

const createCommonDataValidationScheme = yup.object({
  userId: yup.string().defined(),

  name: yup.string().defined(),

  image: yup.string()
    .url()
    .nullable(),

  action: yup.string().defined(),
  byline: yup.string().defined(),
  description: yup.string().defined(),

  contributionAmount: yup.number()
    .min(500)
    .defined(),

  contributionType: yup.string()
    .oneOf(['one-time', 'monthly'])
    .default('one-time')
});

type CreateCommonPayload = yup.InferType<typeof createCommonDataValidationScheme>

export const createCommon = async (payload: CreateCommonPayload): Promise<ICommonEntity> => {
  await validate<CreateCommonPayload>(payload, createCommonDataValidationScheme);

  const {
    name,
    image,
    userId,
    action,
    byline,
    description,
    contributionType,
    contributionAmount
  } = payload;

  const common = await commonDb.addCommon({
    name,
    image,

    members: [{
      userId
    }],

    metadata: {
      action,
      byline,
      description,
      contributionType,

      founderId: userId,
      minFeeToJoin: contributionAmount
    },

    register: 'na'
  });

  // @todo Create CommonCreatedEvent :D

  return common;
}