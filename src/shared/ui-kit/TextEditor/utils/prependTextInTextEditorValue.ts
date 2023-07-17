import { Element } from "slate";
import { ElementType } from "@/shared/ui-kit/TextEditor/constants";
import { TextEditorValue } from "../types";
import { checkIsTextEditorValueEmpty } from "./checkIsTextEditorValueEmpty";
import { parseStringToTextEditorValue } from "./parseStringToTextEditorValue";

export const prependTextInTextEditorValue = (
  text: string,
  initialValue: TextEditorValue,
): TextEditorValue => {
  if (!text) {
    return initialValue;
  }

  const value = checkIsTextEditorValueEmpty(initialValue)
    ? parseStringToTextEditorValue()
    : initialValue;
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
