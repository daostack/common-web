import { ElementType, LIST_TYPES } from "../constants";

export const checkIsListType = (
  elementType: ElementType,
): elementType is ElementType.NumberedList | ElementType.BulletedList =>
  LIST_TYPES.includes(elementType);
