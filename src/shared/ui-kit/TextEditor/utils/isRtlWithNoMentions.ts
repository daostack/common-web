import { isRtlText } from "@/shared/utils";
import { ElementType } from "../constants";

/**
 * Check whether an Editor text is 'rtl' while ignoring mentions.
 */
export const isRtlWithNoMentions = (text = ""): boolean => {
  try {
    const parsedText = JSON.parse(text);
    const textWithNoMentions = JSON.stringify(
      parsedText[0].children?.filter(
        (item) => item.type !== ElementType.Mention,
      ),
    );
    return isRtlText(textWithNoMentions);
  } catch (error) {
    console.error(error);
    return false;
  }
};
