import { Element } from "slate";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { TextEditorValue } from "../types";

export const prependTextInTextEditorValue = (
  text: string,
  value: TextEditorValue,
): TextEditorValue => {
  if (!text) {
    return value;
  }

  const firstElement = value[0];

  if (
    !Element.isElement(firstElement) ||
    firstElement.type !== ElementType.Paragraph
  ) {
    return value;
  }

  firstElement.children.unshift({
    text,
  });

  return value;
};
