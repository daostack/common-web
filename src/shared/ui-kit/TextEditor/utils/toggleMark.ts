import { Editor } from "slate";
import { FormatType } from "../constants";
import { changeElementIndent } from "./changeElementIndent";
import { checkIsIndentType } from "./checkIsIndentType";
import { isMarkActive } from "./isMarkActive";

export const toggleMark = (editor: Editor, format: FormatType) => {
  if (checkIsIndentType(format)) {
    changeElementIndent(editor, format);
    return;
  }

  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
