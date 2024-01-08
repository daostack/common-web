import { Editor } from "slate";
import { ElementType } from "../constants";
import { checkIsInlineType } from "../utils";

export const withEmojis = (editor: Editor): Editor => {
  // const { isInline, isVoid, markableVoid } = editor;
  const { isInline, isVoid } = editor;

  editor.isInline = (element) =>
    checkIsInlineType(element.type) || isInline(element);

  editor.isVoid = (element) => {
    return (element.type as ElementType) === ElementType.Emoji
      ? true
      : isVoid(element);
  };

  // editor.markableVoid = (element) => {
  //   return (
  //     (element.type as ElementType) === ElementType.Emoji ||
  //     markableVoid(element)
  //   );
  // };

  return editor;
};
