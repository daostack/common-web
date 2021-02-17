import { IntentionType } from './type/Inetention.type';
import { IntentionTypeEnum } from './enums/IntentionType.enum';

import { CreateIntentionInput } from './inputs/CreateIntention.input';
import { CreateIntentionMutation } from './mutations/CreateIntention.mutation';

export const IntentionTypes = [
  IntentionType,
  IntentionTypeEnum,

  CreateIntentionInput,
  CreateIntentionMutation
]