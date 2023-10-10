import { DropdownOption } from "@/shared/components";
import {
  UserPushNotificationPreference,
  UserEmailNotificationPreference,
} from "@/shared/models";

const ALL_INBOX_MESSAGES_TEXT = "All new messages in Inbox";
const NOT_ALL_NOTIFICATIONS_TEXT = "Direct messages, mentions & replies";

export const PUSH_NOTIFICATIONS_OPTIONS: DropdownOption[] = [
  {
    text: ALL_INBOX_MESSAGES_TEXT,
    searchText: ALL_INBOX_MESSAGES_TEXT,
    value: UserPushNotificationPreference.All,
  },
  {
    text: NOT_ALL_NOTIFICATIONS_TEXT,
    searchText: NOT_ALL_NOTIFICATIONS_TEXT,
    value: UserPushNotificationPreference.Important,
  },
  {
    text: "None",
    searchText: "None",
    value: UserPushNotificationPreference.None,
  },
];

export const EMAILS_OPTIONS: DropdownOption[] = [
  {
    text: "All emails",
    searchText: "All emails",
    value: UserEmailNotificationPreference.All,
  },
  {
    text: ALL_INBOX_MESSAGES_TEXT,
    searchText: ALL_INBOX_MESSAGES_TEXT,
    value: UserEmailNotificationPreference.AllInbox,
  },
  {
    text: NOT_ALL_NOTIFICATIONS_TEXT,
    searchText: NOT_ALL_NOTIFICATIONS_TEXT,
    value: UserEmailNotificationPreference.Important,
  },
  {
    text: "None",
    searchText: "None",
    value: UserEmailNotificationPreference.None,
  },
];
