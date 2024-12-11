import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { ElementType } from "../constants";
import { DiscussionLinkElement } from "../types";

export const insertDiscussionLink = (editor, title, link, onInternalLinkClick) => {
  const discussionLink: DiscussionLinkElement = {
    type: ElementType.DiscussionLink,
    title: `${title} `,
    link,
    onInternalLinkClick,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, discussionLink);
  Transforms.move(editor);

  ReactEditor.focus(editor);
};
