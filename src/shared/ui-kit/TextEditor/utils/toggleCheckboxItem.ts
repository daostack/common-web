import { Editor } from "slate";
import { ElementType } from "../constants";
import { CheckboxItemElement } from "../types";
import { toggleElement } from "./toggleElement";

export const toggleCheckboxItem = (
  editor: Editor,
  checked = false,
  onlyIfInactive = false,
) => {
  const checkboxItemElement: CheckboxItemElement = {
    type: ElementType.CheckboxItem,
    checked,
    children: [{ text: "" }],
  };
  toggleElement(editor, checkboxItemElement, { onlyIfInactive });
};
