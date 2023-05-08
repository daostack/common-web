import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { ElementType } from "../constants";
import { MentionElement } from "../types";

export const insertMention = (editor, character) => {
  const mention: MentionElement = {
    type: ElementType.Mention,
    displayName: `${character?.displayName} `,
    userId: character?.uid,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);

  ReactEditor.focus(editor);
};
