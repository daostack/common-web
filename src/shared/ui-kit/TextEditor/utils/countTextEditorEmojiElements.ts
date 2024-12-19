import { Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue, ParagraphElement } from "../types";

export interface EmojiCount {
  isSingleEmoji: boolean;
  isMultipleEmoji: boolean;
}

export const countTextEditorEmojiElements = (
  value: TextEditorValue,
): EmojiCount => {
  const editorValue = [...value];

  let hasText = false;
  let emojiCount = 0;

  editorValue.forEach((element) => {
    if (
      (element as ParagraphElement)?.type === ElementType.Paragraph &&
      Element.isElement(element)
    ) {
      element.children.forEach((children) => {
        if (Element.isElementType(children, ElementType.Emoji)) {
          emojiCount = emojiCount + 1;
        } else if (children?.text !== "") {
          hasText = true;
        } else if (Element.isElementType(children, ElementType.Mention) || Element.isElementType(children, ElementType.StreamMention) || Element.isElementType(children, ElementType.DiscussionLink)) {
          hasText = true;
        }
      });
    } else {
      hasText = true;
    }
  });

  const emojiCountWithoutText = hasText ? -1 : emojiCount;

  return {
    isSingleEmoji: emojiCountWithoutText === 1,
    isMultipleEmoji: emojiCountWithoutText >= 2 && emojiCountWithoutText <= 3,
  };
};
