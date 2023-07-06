import { Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue, ParagraphElement } from "../types";

export const countTextEditorEmojiElements = (
  value: TextEditorValue,
): number => {
  const editorValue = [...value];

  let hasText = false;
  let emojiCount = 0;
  editorValue.forEach((element) => {

    if((element as ParagraphElement)?.type === ElementType.Paragraph && Element.isElement(element)) {

      element.children.forEach((children) => {
        if(Element.isElementType(children, ElementType.Emoji)) {
          emojiCount = emojiCount + 1;
        } else if (children?.text !== "") {

          hasText = true;
      } else if(Element.isElementType(children, ElementType.Mention)) {
        hasText = true;
      }}
      );
    } else {
      hasText = true;
    }
  })


  return hasText ? -1 : emojiCount;
};
