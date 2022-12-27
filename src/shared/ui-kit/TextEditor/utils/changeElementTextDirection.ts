import { Editor, Element as SlateElement, Transforms } from "slate";
import { FormatType } from "../constants";
import { getParentElements } from "./getParentElements";

export const changeElementTextDirection = (
  editor: Editor,
  formatType: FormatType.LTR | FormatType.RTL,
): void => {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  const nodeEntries = getParentElements(editor, {
    at: Editor.unhangRange(editor, selection),
  });
  nodeEntries.forEach(([, path]) => {
    const newProperties: Partial<SlateElement> = {
      textDirection: formatType,
    };
    Transforms.setNodes(editor, newProperties, {
      at: path,
    });
  });
};
