import { NotificationTypeEnum } from './Enums/NotificationType.enum';
import { NotificationSeenStatusEnum } from './Enums/NotificationSeenStatus.enum';

import { NotificationType } from './Types/Notification.type';
import { NotificationEventSettingsType } from './Types/NotificationEventSettings.type';

import { NotificationUserExtension } from './Extensions/NotificationUser.extension';
import { NotificationCommonExtension } from './Extensions/NotificationCommon.extension';
import { NotificationProposalExtension } from './Extensions/NotificationProposal.extension';
import { NotificationDiscussionExtension } from './Extensions/NotificationDiscussion.extension';

import { NotificationWhereInput } from './Inputs/NotificationWhere.input';
import { NotificationWhereUniqueInput } from './Inputs/NotificationWhereUnique.input';

import { NotificationOrderByInput } from './Inputs/NotificationOrderBy.input';

import { NotificationCreatedSubscription } from './Subscriptions/NotificationCreated.subscription';
import { CreateNotificationEventSettingsMutation } from './Mutations/CreateNotificationEventSettings.mutation';

export const NotificationTypes = [
  NotificationTypeEnum,
  NotificationSeenStatusEnum,

  NotificationType,
  NotificationEventSettingsType,

  NotificationUserExtension,
  NotificationCommonExtension,
  NotificationProposalExtension,
  NotificationDiscussionExtension,

  NotificationWhereInput,
  NotificationWhereUniqueInput,

  NotificationOrderByInput,

  NotificationCreatedSubscription,

  CreateNotificationEventSettingsMutation
];