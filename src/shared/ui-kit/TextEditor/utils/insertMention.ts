import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { getUserName } from "@/shared/utils";
import { ElementType } from "../constants";
import { MentionElement } from "../types";

export const insertMention = (editor, character) => {
  const mention: MentionElement = {
    type: ElementType.Mention,
    displayName: `${getUserName(character)} `,
    userId: character?.uid,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);

  ReactEditor.focus(editor);
};
