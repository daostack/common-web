import { Editor, Element } from "slate";
import { ElementType } from "../constants";

export const isElementActive = (
  editor: Editor,
  elementType: ElementType,
): boolean => {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        node.type === elementType,
    }),
  );

  return Boolean(match);
};
