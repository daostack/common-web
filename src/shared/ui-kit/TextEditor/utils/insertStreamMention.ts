import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { ElementType } from "../constants";
import { StreamMentionElement } from "../types";

export const insertStreamMention = (editor, character) => {
  const mention: StreamMentionElement = {
    type: ElementType.StreamMention,
    title: `${character.title} `,
    commonId: character.commonId,
    discussionId: character.id,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);

  ReactEditor.focus(editor);
};
