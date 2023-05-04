import { flattenDeep } from "lodash";
import { ElementType } from "../constants";
import { CustomElement, MentionElement, TextEditorValue } from "../types";

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

export const parseTextEditorValueToString = (
  initialValue = "",
): CustomElement[] => {
  if (!initialValue) {
    return [
      {
        type: ElementType.Paragraph,
        text: "",
        children: [],
      },
    ];
  }

  try {
    const textEditorValue = JSON.parse(initialValue);

    const textEditorMap = textEditorValue.map((item) => {
      return item.children.map((tag: CustomElement) => ({
        ...tag,
        type: item.type,
      }));
    });

    return flattenDeep(textEditorMap);
  } catch (error) {
    return [
      {
        type: ElementType.Paragraph,
        text: initialValue,
        children: [],
      },
    ];
  }
};

export const getMentionTags = (editorValue: TextEditorValue) => {
  const mentionTags: MentionElement[] = [];
  (editorValue as { children: CustomElement[] }[]).forEach((item) => {
    (item.children ?? []).forEach((tag) => {
      if (tag.type === ElementType.Mention) {
        mentionTags.push(tag);
      }
    });
  });

  return mentionTags;
};
