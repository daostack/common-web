import { Element, Text } from "slate";
import { TextEditorValue } from "@/shared/ui-kit";

export const getTextFromTextEditorValue = (
  value: TextEditorValue,
): string | undefined => {
  if (value.length === 0) {
    return;
  }
  if (value.length > 1) {
    return;
  }

  const firstElement = value[0];

  if (!Element.isElement(firstElement)) {
    return;
  }

  const firstChild = firstElement.children[0];

  if (!Text.isText(firstChild)) {
    return;
  }

  return firstChild.text;
};
