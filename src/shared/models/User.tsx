import { BaseEntity } from "./BaseEntity";
import { Proposal } from "./Proposals";

export enum UserRole {
  Trustee = "trustee",
}

export enum UserPushNotificationPreference {
  All = "all",
  None = "none",
  Important = "important",
}

export enum UserEmailNotificationPreference {
  All = "all",
  None = "none",
  Important = "important",
  AllInbox = "allInbox",
}

export interface User extends Omit<BaseEntity, "id"> {
  displayName?: string;
  country: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  photo?: string;
  photoURL?: string;
  intro?: string;
  proposals?: Proposal[];
  uid: string;
  roles?: UserRole[];
  deleted?: true;
  inboxCounter?: number;
  fcmTokens?: string[];
  pushNotificationPreference?: UserPushNotificationPreference;
  emailNotificationPreference?: UserEmailNotificationPreference;
}
