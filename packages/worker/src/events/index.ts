import { Event } from '@prisma/client';

import { onUserCreated } from './onUserCreated';
import { onCommonCreated } from './onCommonCreated';
import { onPaymentSucceeded } from './onPaymentSucceeded';
import { onDiscussionCreated } from './onDiscussionCreated';
import { onJoinRequestCreated } from './onJoinRequestCreated';
import { onFundingRequestCreated } from './onFundingRequestCreated';
import { onDiscussionMessageCreated } from './onDiscussionMessageCreated';


export type EventHandler = (data: any, event: Event) => void | Promise<void>;

export const eventHandlers: EventHandler[] = [
  onCommonCreated,
  onDiscussionCreated,
  onDiscussionMessageCreated,
  onFundingRequestCreated,
  onJoinRequestCreated,
  onPaymentSucceeded,
  onUserCreated
];