import { Editor, Element as SlateElement, Transforms } from "slate";
import { ElementType } from "../constants";
import { CustomElement } from "../types";
import { isElementActive } from "./isElementActive";

export interface ToggleElementOptions {
  onlyIfInactive?: boolean;
}

export const toggleElement = (
  editor: Editor,
  element: ElementType | CustomElement,
  options: ToggleElementOptions = {},
) => {
  const { onlyIfInactive = false } = options;
  const isOnlyElementTypeProvided = typeof element !== "object";
  const isActive = isElementActive(
    editor,
    isOnlyElementTypeProvided ? element : element.type,
  );

  if (isActive && onlyIfInactive) {
    return;
  }

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
