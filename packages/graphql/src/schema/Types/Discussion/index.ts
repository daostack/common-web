import { DiscussionType } from './Types/Discussion.type';
import { DiscussionMessageType } from './Types/DiscussionMessage.type';

import { DiscussionMessageTypeEnum } from './Enums/DiscussionMessageType.enum';

import { CreateDiscussionInput, CreateDiscussionMutation } from './Mutations/CreateDiscussion.mutation';

import {
  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation
} from './Mutations/CreateDiscussionMessage.mutation';

export const DiscussionTypes = [
  DiscussionType,
  DiscussionMessageType,

  DiscussionMessageTypeEnum,

  CreateDiscussionInput,
  CreateDiscussionMutation,

  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation
];