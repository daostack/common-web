import { Element, Text } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

export const checkIsTextEditorValueEmpty = (
  value: TextEditorValue,
): boolean => {
  if (value.length === 0) {
    return true;
  }

  const firstElement = value[0];

  if (!Element.isElement(firstElement)) {
    return false;
  }

  const firstChild = firstElement.children[0];
  const secondChild = firstElement.children[1];

  if (Element.isElementType(secondChild, ElementType.Mention) || Element.isElementType(secondChild, ElementType.StreamMention) || Element.isElementType(secondChild, ElementType.DiscussionLink)) {
    return false;
  }

  if (Element.isElementType(secondChild, ElementType.Emoji)) {
    return false;
  }

  if (!Text.isText(firstChild)) {
    return false;
  }

  return firstChild.text === "";
};
