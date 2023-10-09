import { DropdownOption } from "@/shared/components";

const ALL_INBOX_MESSAGES_TEXT = "All new messages in Inbox";
const NOT_ALL_NOTIFICATIONS_TEXT = "Direct messages, mentions & replies";

export const PUSH_NOTIFICATIONS_OPTIONS: DropdownOption[] = [
  {
    text: ALL_INBOX_MESSAGES_TEXT,
    searchText: ALL_INBOX_MESSAGES_TEXT,
    value: "full",
  },
  {
    text: NOT_ALL_NOTIFICATIONS_TEXT,
    searchText: NOT_ALL_NOTIFICATIONS_TEXT,
    value: "short",
  },
  {
    text: "None",
    searchText: "None",
    value: "none",
  },
];

export const EMAILS_OPTIONS: DropdownOption[] = [
  {
    text: "All emails",
    searchText: "All emails",
    value: "full",
  },
  {
    text: ALL_INBOX_MESSAGES_TEXT,
    searchText: ALL_INBOX_MESSAGES_TEXT,
    value: "almost-full",
  },
  {
    text: NOT_ALL_NOTIFICATIONS_TEXT,
    searchText: NOT_ALL_NOTIFICATIONS_TEXT,
    value: "short",
  },
  {
    text: "None",
    searchText: "None",
    value: "none",
  },
];
