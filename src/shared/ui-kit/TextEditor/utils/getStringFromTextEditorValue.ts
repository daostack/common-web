import { TextEditorValue } from "../types";

export const getStringFromTextEditorValue = (
  value: string | TextEditorValue,
): string => (typeof value === "string" ? value : JSON.stringify(value));
