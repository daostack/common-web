import { NotificationTypeEnum } from './Enums/NotificationType.enum';
import { NotificationSeenStatusEnum } from './Enums/NotificationSeenStatus.enum';

import { NotificationType } from './Types/Notification.type';

import { NotificationUserExtension } from './extensions/NotificationUser.extension';
import { NotificationCommonExtension } from './extensions/NotificationCommon.extension';
import { NotificationProposalExtension } from './extensions/NotificationProposal.extension';
import { NotificationDiscussionExtension } from './extensions/NotificationDiscussion.extension';

export const NotificationTypes = [
  NotificationTypeEnum,
  NotificationSeenStatusEnum,

  NotificationType,

  NotificationUserExtension,
  NotificationCommonExtension,
  NotificationProposalExtension,
  NotificationDiscussionExtension
];