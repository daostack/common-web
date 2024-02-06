import { TextEditorValue } from "../types";
import { checkIsCheckboxItemElement } from "./checkIsCheckboxItemElement";

export const checkUncheckedItemsInTextEditorValue = (
  value: TextEditorValue,
): boolean =>
  value.some((item) => checkIsCheckboxItemElement(item) && !item.checked);
