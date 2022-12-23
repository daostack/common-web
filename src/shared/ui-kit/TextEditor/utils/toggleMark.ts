import { Editor } from "slate";
import { FormatType } from "../constants";
import { isMarkActive } from "./isMarkActive";

export const toggleMark = (editor: Editor, format: FormatType) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
