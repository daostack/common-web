import { Editor, Element as SlateElement, Transforms } from "slate";
import { ElementType } from "../constants";
import { CustomElement } from "../types";
import { isElementActive } from "./isElementActive";

export const toggleElement = (
  editor: Editor,
  element: ElementType | CustomElement,
) => {
  const isOnlyElementTypeProvided = typeof element !== "object";
  const isActive = isElementActive(
    editor,
    isOnlyElementTypeProvided ? element : element.type,
  );
  let newProperties: Partial<SlateElement>;

  if (isOnlyElementTypeProvided) {
    newProperties = {
      type: isActive ? ElementType.Paragraph : element,
    };
  } else {
    newProperties = isActive ? { type: ElementType.Paragraph } : element;
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);
};
