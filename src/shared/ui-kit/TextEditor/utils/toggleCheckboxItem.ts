import { Editor, Element as SlateElement, Transforms } from "slate";
import { v4 as uuidv4 } from "uuid";
import { ElementType } from "../constants";
import { CheckboxItemElement } from "../types";
import { isElementActive } from "./isElementActive";

export const toggleCheckboxItem = (
  editor: Editor,
  checked = false,
  onlyIfInactive = false,
) => {
  const isActive = isElementActive(editor, ElementType.CheckboxItem);

  if (isActive && onlyIfInactive) {
    return;
  }
  if (isActive) {
    Transforms.setNodes<SlateElement>(editor, { type: ElementType.Paragraph });
    return;
  }

  const { selection } = editor;
  const checkboxItemElement: Partial<CheckboxItemElement> = {
    type: ElementType.CheckboxItem,
    id: uuidv4(),
    checked,
  };

  Transforms.setNodes<SlateElement>(editor, checkboxItemElement);
  Transforms.delete(editor, {
    at: selection?.anchor.path,
    unit: "line",
  });

  if (selection) {
    Transforms.select(editor, selection.anchor.path);
  }
};
