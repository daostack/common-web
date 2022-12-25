import { Editor, Element as SlateElement, Transforms } from "slate";
import { ElementType, LIST_TYPES } from "../constants";
import { isElementActive } from "./isElementActive";

export const toggleElement = (editor: Editor, elementType: ElementType) => {
  const isActive = isElementActive(editor, elementType);
  const isList = LIST_TYPES.includes(elementType);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      LIST_TYPES.includes(node.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive
      ? ElementType.Paragraph
      : isList
      ? ElementType.ListItem
      : elementType,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const element: SlateElement = {
      type: elementType,
      children: [],
    };
    Transforms.wrapNodes(editor, element);
  }
};
