import { ElementType, LIST_TYPES } from "../constants";

type FinalElementType = ElementType.NumberedList | ElementType.BulletedList;

export const checkIsListType = (
  elementType: ElementType,
): elementType is FinalElementType => LIST_TYPES.includes(elementType);
