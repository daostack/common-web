export enum FormatType {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  Code = "code",
  LeftIndent = "left-indent",
  RightIndent = "right-indent",
  LTR = "ltr",
  RTL = "rtl",
}

export const INDENT_TYPES = [FormatType.LeftIndent, FormatType.RightIndent];
export const TEXT_DIRECTION_TYPES = [FormatType.LTR, FormatType.RTL];
