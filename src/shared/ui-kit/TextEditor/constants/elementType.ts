export enum ElementType {
  Paragraph = "paragraph",
  Heading = "heading",
  Link = "link",
  Mention = "mention",
  NumberedList = "numbered-list",
  BulletedList = "bulleted-list",
  ListItem = "list-item",
  Emoji = "emoji",
}

export const LIST_TYPES = [ElementType.NumberedList, ElementType.BulletedList];
export const PARENT_TYPES = [
  ...LIST_TYPES,
  ElementType.Paragraph,
  ElementType.Heading,
];
export const INLINE_TYPES = [ElementType.Link, ElementType.Mention, ElementType.Emoji];
