import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

const serializeTextEditorValue = (value = ""): TextEditorValue => {
  return value.split("\n").map((valuePart) => ({
    type: ElementType.Paragraph,
    children: [{ text: valuePart }],
  }));
};

export const parseStringToTextEditorValue = (
  initialValue = "",
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
    const parsedValue = JSON.parse(initialValue);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }

    return serializeTextEditorValue(initialValue);
  } catch (error) {
    return serializeTextEditorValue(initialValue);
  }
};
