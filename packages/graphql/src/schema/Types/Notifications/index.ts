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
import { NotificationTemplateOptionsType } from './Types/NotificationTemplateOptions.type';
import { GetNotificationTemplateOptionsQuery } from './Queries/GetNotificationTemplateOptions.query';
import { CreateNotificationTemplateMutation } from './Mutations/CreateNotificationTemplate.mutation';
import { NotificationEventOptionsType } from './Types/NotificationEventOptions.type';
import { GetNotificationEventOptionsQuery } from './Queries/GetNotificationEventOptions.query';
import { NotificationSystemSettingsType } from './Types/NotificationSystemSettings.type';
import { GetNotificationSettingsQuery } from './Queries/GetNotificationSettings.query';
import { UpdateNotificationSettingsMutation } from './Mutations/UpdateNotificationSettings.mutation';
import { NotificationSettingsWhereInput } from './Inputs/NotificationSettingsWhere.input';
import { UpdateNotificationTemplateMutation } from './Mutations/UpdateNotificationTemplate.mutation';
import { DeleteEventNotificationSettingMutation } from './Mutations/DeleteEventNotificationSetting.mutation';

export const NotificationTypes = [
  NotificationTypeEnum,
  NotificationSeenStatusEnum,
  NotificationLanguageEnum,
  NotificationTemplateTypeEnum,

  NotificationType,
  NotificationTemplateType,
  NotificationEventOptionsType,
  NotificationEventSettingsType,
  NotificationSystemSettingsType,
  NotificationTemplateOptionsType,

  NotificationUserExtension,
  NotificationCommonExtension,
  NotificationProposalExtension,
  NotificationDiscussionExtension,

  NotificationWhereInput,
  NotificationWhereUniqueInput,
  NotificationTemplateWhereInput,
  NotificationSettingsWhereInput,
  UpdateNotificationTemplateMutation,
  DeleteEventNotificationSettingMutation,

  NotificationOrderByInput,

  NotificationCreatedSubscription,

  CreateNotificationEventSettingsMutation,
  UpdateNotificationSettingsMutation,
  CreateNotificationTemplateMutation,

  GetNotificationTemplateOptionsQuery,
  GetNotificationEventOptionsQuery,
  GetNotificationEventSettingsQuery,
  GetNotificationTemplatesQuery,
  GetNotificationSettingsQuery,
  GetNotificationsQuery
];