import botAvatarSrc from "@/shared/assets/images/bot-avatar.svg";
import { Timestamp, User } from "@/shared/models";

export const AI_USER: User = {
  uid: "ai",
  firstName: "ai",
  lastName: "",
  country: "",
  photoURL: botAvatarSrc,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

export const AI_PRO_USER: User = {
  ...AI_USER,
  uid: "aipro",
  firstName: "aipro",
};
