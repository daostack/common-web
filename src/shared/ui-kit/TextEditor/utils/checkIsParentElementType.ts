import { ElementType, PARENT_TYPES } from "../constants";

type FinalElementType =
  | ElementType.Paragraph
  | ElementType.NumberedList
  | ElementType.BulletedList;

export const checkIsParentElementType = (
  elementType: ElementType,
): elementType is FinalElementType => PARENT_TYPES.includes(elementType);
