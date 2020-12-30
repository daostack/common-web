import * as yup from 'yup';

import { validate } from '../../util/validate';
import { commonRuleValidationSchema, linkValidationSchema } from '../../util/schemas';

import { commonDb } from '../database';
import { ICommonEntity, ICommonLink, ICommonRule } from '../types';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

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
    .default('one-time')
    .required(),

  rules: yup.array(commonRuleValidationSchema)
    .optional(),

  links: yup.array(linkValidationSchema)
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
    links,
    userId,
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
    links: links as ICommonLink[] || [],

    members: [{
      userId
    }],

    metadata: {
      byline,
      description,
      contributionType,

      founderId: userId,
      minFeeToJoin: contributionAmount
    },

    register: 'na'
  });

  // Broadcast the common created event
  await createEvent({
    userId,
    objectId: common.id,
    type: EVENT_TYPES.COMMON_CREATED
  });

  return common;
};
