import { Editor } from "slate";
import { FormatType } from "../constants";

export const isMarkActive = (editor: Editor, format: FormatType): boolean => {
  const marks = Editor.marks(editor);

  return Boolean(marks && marks[format] === true);
};
