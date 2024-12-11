import { isRtlText } from "@/shared/utils";
import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

/**
 * Check whether an Editor text is 'rtl' while ignoring mentions.
 */
export const isRtlWithNoMentions = (
  text: string | TextEditorValue = "",
): boolean => {
  try {
    const parsedText = typeof text === "string" ? JSON.parse(text) : text;
    const textWithNoMentions = JSON.stringify(
      parsedText[0].children?.filter(
        (item) => (item.type !== ElementType.Mention || item.type !== ElementType.StreamMention || item.type !== ElementType.DiscussionLink),
      ),
    );
    return isRtlText(textWithNoMentions);
  } catch (error) {
    return false;
  }
};
