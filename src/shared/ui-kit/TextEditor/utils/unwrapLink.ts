import { Editor, Element, Transforms } from "slate";
import { ElementType } from "../constants";

export const unwrapLink = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      node.type === ElementType.Link,
  });
};
