import * as yup from 'yup';
import { ICommonEntity } from '../types';
import { validate } from '../../util/validate';
import { commonDb } from '../database';

// The validation schema for creating commons (and creating typings by inferring them)
const createCommonDataValidationScheme = yup.object({
  userId: yup.string().defined(),

  name: yup.string().defined(),

  image: yup.string()
    .url()
    .defined(),

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

/**
 * Creates common for the provided payload. Please note that this is
 * not *Authenticated* so use it with care
 *
 * @throws { ValidationError } - If there are validation errors in the payload
 * @throws { NotFoundError } - If there was no user found for the user id
 *
 * @param payload - The data from witch the common will be created
 *
 * @returns - The created common
 */
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

  // @todo Check if user exists

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