import { DiscussionType } from './Types/Discussion.type';
import { DiscussionMessageType } from './Types/DiscussionMessage.type';

import { DiscussionTypeEnum } from './Enums/DiscussionType.enum';
import { DiscussionMessageTypeEnum } from './Enums/DiscussionMessageType.enum';

import { GetDiscussionQuery } from './Queries/GetDiscussion.query';

import { DiscussionMessagesOrderByInput } from './Inputs/DiscussionMessagesOrderBy.input';

import { DiscussionMessagesExtension } from './Extensions/DiscussionMessages.extension';

import { CreateDiscussionInput, CreateDiscussionMutation } from './Mutations/CreateDiscussion.mutation';
import {
  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation
} from './Mutations/CreateDiscussionMessage.mutation';

export const DiscussionTypes = [
  DiscussionType,
  DiscussionMessageType,

  DiscussionTypeEnum,
  DiscussionMessageTypeEnum,

  GetDiscussionQuery,

  DiscussionMessagesOrderByInput,

  DiscussionMessagesExtension,

  CreateDiscussionInput,
  CreateDiscussionMutation,

  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation
];