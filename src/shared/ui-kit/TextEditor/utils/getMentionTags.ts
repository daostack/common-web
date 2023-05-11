import { Descendant, Element } from "slate";
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

  return Object.values(userIdToMentionTagMap);
};
