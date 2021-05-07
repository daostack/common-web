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

import { GetNotificationEventSettingsQuery } from './Queries/GetNotificationEventSettings.query';
import { GetNotificationsQuery } from './Queries/GetNotifications.query';
import { NotificationLanguageEnum } from './Enums/NotificationLanguage.enum';
import { NotificationTemplateType } from './Types/NotificationTemplate.type';
import { NotificationTemplateTypeEnum } from './Enums/NotificationTemplateType.enum';
import { NotificationTemplateWhereInput } from './Inputs/NotificationTemplateWhere.input';
import { GetNotificationTemplatesQuery } from './Queries/GetNotificationTemplates.query';

export const NotificationTypes = [
  NotificationTypeEnum,
  NotificationSeenStatusEnum,
  NotificationLanguageEnum,
  NotificationTemplateTypeEnum,

  NotificationType,
  NotificationTemplateType,
  NotificationEventSettingsType,

  NotificationUserExtension,
  NotificationCommonExtension,
  NotificationProposalExtension,
  NotificationDiscussionExtension,

  NotificationWhereInput,
  NotificationWhereUniqueInput,
  NotificationTemplateWhereInput,

  NotificationOrderByInput,

  NotificationCreatedSubscription,

  CreateNotificationEventSettingsMutation,

  GetNotificationEventSettingsQuery,
  GetNotificationTemplatesQuery,
  GetNotificationsQuery
];