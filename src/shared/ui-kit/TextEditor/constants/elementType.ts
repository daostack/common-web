export enum ElementType {
  Paragraph = "paragraph",
  Link = "link",
  NumberedList = "numbered-list",
  BulletedList = "bulleted-list",
  ListItem = "list-item",
}

export const LIST_TYPES = [ElementType.NumberedList, ElementType.BulletedList];
export const PARENT_TYPES = [...LIST_TYPES, ElementType.Paragraph];
export const INLINE_TYPES = [ElementType.Link];
