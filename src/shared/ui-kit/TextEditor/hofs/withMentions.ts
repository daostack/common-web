import { Editor } from "slate";
import { checkIsInlineType } from "../utils";
import { ElementType } from "../constants";

export const withMentions = (editor: Editor): Editor => {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = element => checkIsInlineType(element.type) || isInline(element);

  editor.isVoid = element => {
    return element.type as ElementType === ElementType.Mention ? true : isVoid(element)
  }

  editor.markableVoid = element => {
    return element.type as ElementType === ElementType.Mention || markableVoid(element)
  }

  return editor
}