import { FormatType, INDENT_TYPES } from "../constants";

type FinalFormatType = FormatType.LeftIndent | FormatType.RightIndent;

export const checkIsIndentType = (
  formatType: FormatType,
): formatType is FinalFormatType => INDENT_TYPES.includes(formatType);
