import { Editor, Element, Element as SlateElement, Transforms } from "slate";
import { FormatType, MAX_INDENT_LEVEL } from "../constants";
import { checkIsParentElementType } from "../utils";

const getNextIndentLevel = (
  element: Element,
  formatType: FormatType.LeftIndent | FormatType.RightIndent,
): number => {
  const currentIndentLevel = element.indentLevel || 0;
  const nextIndentLevel =
    formatType === FormatType.LeftIndent
      ? currentIndentLevel + 1
      : currentIndentLevel - 1;

  if (nextIndentLevel < 0) {
    return 0;
  }
  if (nextIndentLevel > MAX_INDENT_LEVEL) {
    return MAX_INDENT_LEVEL;
  }

  return nextIndentLevel;
};

export const changeElementIndent = (
  editor: Editor,
  formatType: FormatType.LeftIndent | FormatType.RightIndent,
): void => {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  const nodeEntries =
    Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (node) =>
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          checkIsParentElementType(node.type),
      }),
    ) || [];
  nodeEntries.forEach(([node, path]) => {
    const nextIndentLevel =
      (Element.isElement(node) && getNextIndentLevel(node, formatType)) || 0;
    const newProperties: Partial<SlateElement> = {
      indentLevel: nextIndentLevel,
    };
    Transforms.setNodes(editor, newProperties, {
      at: path,
    });
  });
};
