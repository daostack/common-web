import { Editor, Element as SlateElement, Transforms } from "slate";
import { ElementType } from "../constants";
import { checkIsListType } from "../utils";
import { isElementActive } from "./isElementActive";

export const toggleList = (
  editor: Editor,
  elementType: ElementType.NumberedList | ElementType.BulletedList,
) => {
  const isActive = isElementActive(editor, elementType);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      checkIsListType(node.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? ElementType.Paragraph : ElementType.ListItem,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive) {
    const listElement: SlateElement = {
      type: elementType,
      children: [],
    };
    Transforms.wrapNodes(editor, listElement);
  }
};
