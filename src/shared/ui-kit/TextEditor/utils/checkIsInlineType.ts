import { ElementType, INLINE_TYPES } from "../constants";

type FinalElementType = ElementType.Link;

export const checkIsInlineType = (
  elementType: ElementType,
): elementType is FinalElementType => INLINE_TYPES.includes(elementType);
