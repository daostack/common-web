import { Editor } from "slate";
import { ElementType } from "../constants";
import { checkIsInlineType } from "../utils";

export const withMentions = (editor: Editor): Editor => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) =>
    checkIsInlineType(element.type) || isInline(element);

  editor.isVoid = (element) => {
    return (element.type as ElementType) === ElementType.Mention
      ? true
      : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return (
      (element.type as ElementType) === ElementType.Mention ||
      markableVoid(element)
    );
  };

  return editor;
};
