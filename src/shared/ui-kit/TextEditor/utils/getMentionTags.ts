import { Descendant, Element } from "slate";
import { AI_PRO_USER, AI_USER } from "@/shared/constants";
import { ElementType } from "../constants";
import { MentionElement, TextEditorValue } from "../types";

type UserIdToMentionTagMap = Record<string, MentionElement>;

const getMentionsFromDescendant = (
  descendant: Descendant,
): UserIdToMentionTagMap => {
  if (!Element.isElement(descendant)) {
    return {};
  }

  switch (descendant.type) {
    case ElementType.Paragraph:
      return descendant.children.reduce(
        (acc, item) => ({
          ...acc,
          ...getMentionsFromDescendant(item),
        }),
        {},
      );
    case ElementType.Mention:
      return {
        [descendant.userId]: descendant,
      };
    default:
      return {};
  }
};

export const getMentionTags = (
  editorValue: TextEditorValue,
): MentionElement[] => {
  const userIdToMentionTagMap = editorValue
    .map((item) => getMentionsFromDescendant(item))
    .reduce(
      (acc, item) => ({
        ...acc,
        ...item,
      }),
      {},
    );
  delete userIdToMentionTagMap[AI_USER.uid];
  delete userIdToMentionTagMap[AI_PRO_USER.uid];

  return Object.values(userIdToMentionTagMap);
};
