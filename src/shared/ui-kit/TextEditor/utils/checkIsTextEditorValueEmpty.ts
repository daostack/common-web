import { Element, Text } from "slate";
import { TextEditorValue } from "../types";

export const checkIsTextEditorValueEmpty = (
  value: TextEditorValue,
): boolean => {
  if (value.length === 0) {
    return true;
  }
  if (value.length > 1) {
    return false;
  }

  const firstElement = value[0];

  if (!Element.isElement(firstElement)) {
    return false;
  }

  const firstChild = firstElement.children[0];

  if (!Text.isText(firstChild)) {
    return false;
  }

  return firstChild.text === "";
};
