import { FormatType, TEXT_DIRECTION_TYPES } from "../constants";

type FinalFormatType = FormatType.LTR | FormatType.RTL;

export const checkIsTextDirectionType = (
  formatType: FormatType,
): formatType is FinalFormatType => TEXT_DIRECTION_TYPES.includes(formatType);
