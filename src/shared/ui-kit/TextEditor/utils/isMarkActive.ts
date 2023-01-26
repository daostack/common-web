import { Editor } from "slate";
import { FormatType } from "../constants";
import { checkIsIndentType } from "./checkIsIndentType";

export const isMarkActive = (editor: Editor, format: FormatType): boolean => {
  if (checkIsIndentType(format)) {
    return false;
  }

  const marks = Editor.marks(editor);

  return Boolean(marks && marks[format] === true);
};
