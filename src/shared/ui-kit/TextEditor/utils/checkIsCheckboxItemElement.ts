import { ElementType } from "../constants";
import { CheckboxItemElement, CustomElement } from "../types";

export const checkIsCheckboxItemElement = (
  element: CustomElement,
): element is CheckboxItemElement => element.type === ElementType.CheckboxItem;
