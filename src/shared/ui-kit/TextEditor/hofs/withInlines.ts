import { Editor } from "slate";
import { checkIsURL } from "@/shared/utils";
import { checkIsInlineType, wrapLink } from "../utils";

export const withInlines = (editor: Editor): Editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    checkIsInlineType(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && checkIsURL(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && checkIsURL(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
