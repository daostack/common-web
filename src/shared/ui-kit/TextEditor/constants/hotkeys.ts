import { FormatType } from "./formatType";

export const HOTKEYS: Record<string, FormatType> = {
  "mod+b": FormatType.Bold,
  "mod+i": FormatType.Italic,
  "mod+u": FormatType.Underline,
  "mod+`": FormatType.Code,
};
