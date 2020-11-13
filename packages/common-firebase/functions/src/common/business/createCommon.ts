import * as yup from 'yup';

import { validate } from '../../util/validate';
import { commonRuleValidationSchema } from '../../util/schemas';

import { commonDb } from '../database';
import { ICommonEntity, ICommonRule } from '../types';

// The validation schema for creating commons (and creating typings by inferring them)
const createCommonDataValidationScheme = yup.object({
  userId: yup
    .string()
    .required(),

  name: yup
    .string()
    .required(),

  image: yup.string()
    .url()
    .required(),

  action: yup
    .string()
    .required(),

  byline: yup
    .string()
    .min(10)
    .required(),

  description: yup
    .string()
    .required(),

  fundingGoalDeadline: yup
    .number()
    .required(),

  contributionAmount: yup.number()
    .min(500)
    .required(),

  contributionType: yup.string()
    .oneOf(['one-time', 'monthly'])
    .default('one-time'),

  rules: yup.array(commonRuleValidationSchema)
    .optional()
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
    rules,
    userId,
    action,
    byline,
    description,
    contributionType,
    contributionAmount,
    fundingGoalDeadline
  } = payload;

  // @todo Check if user exists

  const common = await commonDb.addCommon({
    name,
    image,
    fundingGoalDeadline,

    rules: rules as ICommonRule[] || [],

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