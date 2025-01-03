import { Editor } from "slate";
import { ElementType } from "../constants";
import { checkIsInlineType } from "../utils";

export const withMentions = (editor: Editor): Editor => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) =>
    checkIsInlineType(element.type) || isInline(element);

  editor.isVoid = (element) => {
    return ((element.type as ElementType) === ElementType.Mention || (element.type as ElementType) === ElementType.StreamMention || (element.type as ElementType) === ElementType.DiscussionLink)
      ? true
      : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return (
      ((element.type as ElementType) === ElementType.Mention || (element.type as ElementType) === ElementType.StreamMention || (element.type as ElementType) === ElementType.DiscussionLink) ||
      markableVoid(element)
    );
  };

  return editor;
};
