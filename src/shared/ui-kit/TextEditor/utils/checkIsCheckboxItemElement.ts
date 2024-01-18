import { Descendant } from "slate";
import { ElementType } from "../constants";
import { CheckboxItemElement, CustomElement } from "../types";

export const checkIsCheckboxItemElement = (
  element: CustomElement | Descendant,
): element is CheckboxItemElement =>
  (element as CustomElement).type === ElementType.CheckboxItem;
