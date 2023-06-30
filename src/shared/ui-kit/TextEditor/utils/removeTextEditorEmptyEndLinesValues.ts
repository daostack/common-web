import { Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue, ParagraphElement } from "../types";

export const removeTextEditorEmptyEndLinesValues = (
  value: TextEditorValue,
): TextEditorValue => {
  const editorValue = [...value];

  let isEndOfTextIndex = -1;
  const updatedValue = editorValue.reverse().filter((element, index) => {
    if (isEndOfTextIndex >= 0) {
      return true;
    }

    if (
      (element as ParagraphElement)?.type === ElementType.Paragraph &&
      Element.isElement(element)
    ) {
      const firstChild = element.children?.[0];
      const secondChild = element.children?.[1];

      if (Element.isElementType(secondChild, ElementType.Mention)) {
        isEndOfTextIndex = index;
        return false;
      } else if (firstChild?.text !== "") {
        isEndOfTextIndex = index;
        return true;
      }

      return false;
    } else {
      isEndOfTextIndex = index;
    }
  });

  return updatedValue.reverse();
};
