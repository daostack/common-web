import { Editor } from "slate";
import { checkIsURL } from "@/shared/utils";
import { checkIsInlineType, wrapLink } from "../utils";

interface Options {
  shouldInsertURLAsLink?: boolean;
}

export const withInlines = (editor: Editor, options: Options = {}): Editor => {
  const { insertData, insertText, isInline } = editor;
  const { shouldInsertURLAsLink = true } = options;

  editor.isInline = (element) =>
    checkIsInlineType(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && checkIsURL(text) && shouldInsertURLAsLink) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && checkIsURL(text) && shouldInsertURLAsLink) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
