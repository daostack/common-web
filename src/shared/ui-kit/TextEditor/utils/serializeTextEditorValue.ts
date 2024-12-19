import { Descendant, Element } from "slate";
import { ElementType } from "../constants";
import { TextEditorValue } from "../types";

const serializeDescendant = (descendant: Descendant): string => {
  if (!Element.isElement(descendant)) {
    return descendant.text || "";
  }

  switch (descendant.type) {
    case ElementType.Paragraph:
      const combinedChildren = descendant.children.reduce(
        (acc, item) => acc + serializeDescendant(item),
        "",
      );

      return `${combinedChildren}\n`;
    case ElementType.Mention:
      return `@${descendant.displayName}`;
    case ElementType.StreamMention:
      return `@${descendant.title}`;
    case ElementType.DiscussionLink:
      return `@${descendant.title}`;
    default:
      return descendant.text || "";
  }
};

export const serializeTextEditorValue = (value: TextEditorValue): string =>
  value
    .map((item) => serializeDescendant(item))
    .join("")
    .trim();
