import { User } from "@/shared/models";

export interface UpdateUserDto {
  userId: string;
  changes: Partial<
    Pick<
      User,
      | "email"
      | "photoURL"
      | "firstName"
      | "lastName"
      | "displayName"
      | "pushNotificationPreference"
      | "emailNotificationPreference"
    >
  >;
}
