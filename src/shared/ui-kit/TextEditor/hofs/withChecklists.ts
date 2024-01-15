import {
  Editor,
  Element as SlateElement,
  Element,
  Point,
  Range,
  Transforms,
} from "slate";
import { v4 as uuidv4 } from "uuid";
import { ElementType } from "../constants";
import { CheckboxItemElement, ParagraphElement } from "../types";
import { checkIsCheckboxItemType } from "../utils";

export const withChecklists = (editor: Editor): Editor => {
  const { onChange, deleteBackward } = editor;

  editor.onChange = (...args) => {
    const splitOperation = editor.operations?.[1];

    if (splitOperation?.type === "split_node") {
      const checkboxItemElement: Partial<CheckboxItemElement> = {
        id: uuidv4(),
        checked: false,
      };

      Transforms.setNodes<SlateElement>(editor, checkboxItemElement);
    }

    onChange(...args);
  };

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
          const newProperties = {
            type: ElementType.Paragraph,
            id: undefined,
            checked: undefined,
          } as Partial<ParagraphElement>;
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
