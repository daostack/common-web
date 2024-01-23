import { ElementType } from "../constants";

export const checkIsCheckboxItemType = (
  elementType: ElementType,
): elementType is ElementType.CheckboxItem =>
  elementType === ElementType.CheckboxItem;
