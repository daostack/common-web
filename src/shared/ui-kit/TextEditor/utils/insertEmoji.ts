import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { ElementType } from "../constants";
import { EmojiElement } from "../types";

export const insertEmoji = (editor, emoji) => {
  console.log('---',emoji.native);
  const emojiElement: EmojiElement = {
    type: ElementType.Emoji,
    emoji,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, emojiElement);
  Transforms.move(editor);

  ReactEditor.focus(editor);
};
