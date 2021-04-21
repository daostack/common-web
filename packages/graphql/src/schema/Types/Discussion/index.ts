import { DiscussionType } from './Types/Discussion.type';
import { DiscussionMessageType } from './Types/DiscussionMessage.type';
import { DiscussionSubscriptionType } from './Types/DiscussionSubscription.type';

import { DiscussionTypeEnum } from './Enums/DiscussionType.enum';
import { DiscussionMessageTypeEnum } from './Enums/DiscussionMessageType.enum';
import { DiscussionMessageFlagEnum } from './Enums/DiscussionMessageFlag.enum';
import { DiscussionSubscriptionTypeEnum } from './Enums/DiscussionSubscriptionType.enum';

import { GetDiscussionQuery } from './Queries/GetDiscussion.query';

import { DiscussionMessagesOrderByInput } from './Inputs/DiscussionMessagesOrderBy.input';
import { DiscussionSubscriptionOrderByInput } from './Inputs/DiscussionSubscriptionOrderBy.input';

import { DiscussionMessagesExtension } from './Extensions/DiscussionMessages.extension';
import { DiscussionMessageReportsExtension } from './Extensions/DiscussionMessageReports.extension';
import { DiscussionSubscriptionDiscussionExtension } from './Extensions/DiscussionSubscriptionDiscussion.extension';

import { DiscussionMessageCreatedSubscription } from './Subscriptions/DiscussionMessageCreated.subscription';

import { ChangeDiscussionSubscriptionTypeMutation } from './Mutations/ChangeDiscussionSubscriptionType.mutation';
import { CreateDiscussionInput, CreateDiscussionMutation } from './Mutations/CreateDiscussion.mutation';

import {
  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation
} from './Mutations/CreateDiscussionMessage.mutation';


export const DiscussionTypes = [
  DiscussionType,
  DiscussionMessageType,
  DiscussionSubscriptionType,

  DiscussionTypeEnum,
  DiscussionMessageTypeEnum,
  DiscussionMessageFlagEnum,
  DiscussionSubscriptionTypeEnum,

  GetDiscussionQuery,

  DiscussionMessagesOrderByInput,
  DiscussionSubscriptionOrderByInput,

  DiscussionMessagesExtension,
  DiscussionMessageReportsExtension,
  DiscussionSubscriptionDiscussionExtension,

  CreateDiscussionInput,
  CreateDiscussionMutation,

  CreateDiscussionMessageInput,
  CreateDiscussionMessageMutation,

  ChangeDiscussionSubscriptionTypeMutation,

  DiscussionMessageCreatedSubscription
];