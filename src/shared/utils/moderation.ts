import { ModerationFlags } from "../interfaces/Moderation";

export const getModerationText = (flag?: ModerationFlags): string => {
  switch(flag) {
    case ModerationFlags.Hidden:
      return "Hidden";
    case ModerationFlags.Reported:
      return "Reported";
    default:
      return "";
  }
}