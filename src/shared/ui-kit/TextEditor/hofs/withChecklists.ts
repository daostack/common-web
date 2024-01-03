import { Editor, Element, Point, Range, Transforms } from "slate";
import { ElementType } from "../constants";
import { ParagraphElement } from "../types";
import { checkIsCheckboxItemType } from "../utils";

export const withChecklists = (editor: Editor): Editor => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Array.from(
        Editor.nodes(editor, {
          match: (node) =>
            !Editor.isEditor(node) &&
            Element.isElement(node) &&
            checkIsCheckboxItemType(node.type),
        }),
      );

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties: Partial<ParagraphElement> = {
            type: ElementType.Paragraph,
          };
          Transforms.setNodes(editor, newProperties, {
            match: (node) =>
              !Editor.isEditor(node) &&
              Element.isElement(node) &&
              checkIsCheckboxItemType(node.type),
          });
          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};
