import { Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue, ParagraphElement } from "../types";

export const removeTextEditorEmptyEndLinesValues = (
  value: TextEditorValue,
): TextEditorValue => {
  const editorValue = [...value];

  let endOfTextIndex = -1;
  const updatedValue = editorValue.reverse().filter((element, index) => {

    if(endOfTextIndex >= 0) {
      return true;
    }

    if((element as ParagraphElement)?.type === ElementType.Paragraph && Element.isElement(element)) {
      const firstChild = element.children?.[0];
      const secondChild = element.children?.[1];

      if (firstChild?.text !== "" || Element.isElementType(secondChild, ElementType.Mention) || Element.isElementType(secondChild, ElementType.Emoji)) {
        endOfTextIndex = index;
        return true;
      }

      return false;
    } else {
      endOfTextIndex = index;
    }
  })

  console.log('---value',value, "-----updatedValue",updatedValue);

  return updatedValue.reverse();
};
