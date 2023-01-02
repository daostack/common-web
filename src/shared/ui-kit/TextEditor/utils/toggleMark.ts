import { Editor } from "slate";
import { FormatType } from "../constants";
import { changeElementIndent } from "./changeElementIndent";
import { changeElementTextDirection } from "./changeElementTextDirection";
import { checkIsIndentType } from "./checkIsIndentType";
import { checkIsTextDirectionType } from "./checkIsTextDirectionType";
import { isMarkActive } from "./isMarkActive";

export const toggleMark = (editor: Editor, format: FormatType) => {
  if (checkIsIndentType(format)) {
    changeElementIndent(editor, format);
    return;
  }
  if (checkIsTextDirectionType(format)) {
    changeElementTextDirection(editor, format);
    return;
  }

  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
