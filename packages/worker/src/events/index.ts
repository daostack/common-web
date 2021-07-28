import { Prisma } from '@common/core';

import { onUserCreated } from './onUserCreated';
import { onCommonCreated } from './onCommonCreated';
import { onPaymentSucceeded } from './onPaymentSucceeded';
import { onDiscussionCreated } from './onDiscussionCreated';
import { onJoinRequestCreated } from './onJoinRequestCreated';
import { onFundingRequestCreated } from './onFundingRequestCreated';
import { onDiscussionMessageCreated } from './onDiscussionMessageCreated';


export type EventHookHandler = (data: any, event: Prisma.Event) => void | Promise<void>;

export const eventHookHandlers: EventHookHandler[] = [
  onCommonCreated,
  onDiscussionCreated,
  onDiscussionMessageCreated,
  onFundingRequestCreated,
  onJoinRequestCreated,
  onPaymentSucceeded,
  onUserCreated
];