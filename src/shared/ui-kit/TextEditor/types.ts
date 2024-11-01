import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { Skin } from "@emoji-mart/data";
import { ElementType, FormatType } from "./constants";

export type TextEditorValue = Descendant[];

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
}

export type CustomText = FormattedText;

type BaseElementChild = CustomText | LinkElement | MentionElement;

interface BaseElement<Child = BaseElementChild> {
  type: ElementType;
  text?: string;
  children: Child[];
  indentLevel?: number;
  textDirection?: FormatType.LTR | FormatType.RTL;
}

export interface ParagraphElement extends BaseElement {
  type: ElementType.Paragraph;
}

export interface HeadingElement extends BaseElement {
  type: ElementType.Heading;
}

export interface LinkElement extends BaseElement {
  type: ElementType.Link;
  url?: string;
}

export interface NumberedListElement extends BaseElement<ListItemElement> {
  type: ElementType.NumberedList;
}

export interface BulletedListElement extends BaseElement<ListItemElement> {
  type: ElementType.BulletedList;
}

export interface ListItemElement extends BaseElement {
  type: ElementType.ListItem;
}

export interface MentionElement extends BaseElement<CustomText> {
  type: ElementType.Mention;
  displayName: string;
  userId: string;
}

export interface StreamMentionElement extends BaseElement<CustomText> {
  type: ElementType.StreamMention;
  title: string;
  commonId: string;
  discussionId
}

export interface EmojiElement extends BaseElement<CustomText> {
  type: ElementType.Emoji;
  emoji: Skin;
}

export interface CheckboxItemElement extends BaseElement<CustomText> {
  type: ElementType.CheckboxItem;
  id: string;
  checked: boolean;
}

export interface TextEditorStyles {
  label?: string;
  hint?: string;
  labelWrapper?: string;
  error?: string;
}

export interface EditorElementStyles {
  mention?: string;
  emoji?: string;
}

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | LinkElement
  | NumberedListElement
  | BulletedListElement
  | ListItemElement
  | MentionElement
  | StreamMentionElement
  | EmojiElement
  | CheckboxItemElement;
