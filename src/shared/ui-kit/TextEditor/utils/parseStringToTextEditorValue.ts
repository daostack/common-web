import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

export const parseStringToTextEditorValue = (
  initialValue: string = "",
): TextEditorValue => {
  if (!initialValue) {
    return [
      {
        type: ElementType.Paragraph,
        children: [{ text: "" }],
      },
    ];
  }

  try {
    return JSON.parse(initialValue);
  } catch (error) {
    return initialValue.split("\n").map((valuePart) => ({
      type: ElementType.Paragraph,
      children: [{ text: valuePart }],
    }));
  }
};
