import { Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

export const removeTextEditorEmptyEndLinesValues = (
  value: TextEditorValue,
): TextEditorValue => {
  const editorValue = [...value];

  let endOfTextIndex = -1;
  const updatedValue = editorValue.reverse().filter((element, index) => {
    if (endOfTextIndex >= 0) {
      return true;
    }

    if (
      Element.isElement(element) &&
      (element.type === ElementType.Paragraph ||
        element.type === ElementType.CheckboxItem)
    ) {
      const firstChild = element.children?.[0];
      const secondChild = element.children?.[1];

      if (
        firstChild?.text !== "" ||
        Element.isElementType(secondChild, ElementType.Mention) ||
        Element.isElementType(secondChild, ElementType.StreamMention) ||
        Element.isElementType(secondChild, ElementType.Emoji)
      ) {
        endOfTextIndex = index;
        return true;
      }

      return false;
    } else {
      endOfTextIndex = index;
    }
  });

  return updatedValue.reverse();
};
