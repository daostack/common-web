import { Editor, Element as SlateElement, Transforms } from "slate";
import { ElementType } from "../constants";
import { isElementActive } from "./isElementActive";

export const toggleElement = (editor: Editor, elementType: ElementType) => {
  const isActive = isElementActive(editor, elementType);
  const newProperties: Partial<SlateElement> = {
    type: isActive ? ElementType.Paragraph : elementType,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);
};
