import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
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

type BaseElementChild = CustomText | LinkElement;

interface BaseElement<Child = BaseElementChild> {
  type: ElementType;
  text?: string;
  children: Child[];
  indentLevel?: number;
  textDirection?: FormatType.LTR | FormatType.RTL;
}

export interface ParagraphElement extends BaseElement {
  type: ElementType.Paragraph;
  text?: string;
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

export interface MentionElement extends BaseElement {
  type: ElementType.Mention;
  displayName: string;
  userId: string;
  children: CustomText[];
}

export interface TextEditorStyles {
  label?: string;
  hint?: string;
  labelWrapper?: string;
  error?: string;
}

export interface EditorElementStyles {
  mention?: string;
}

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | LinkElement
  | NumberedListElement
  | BulletedListElement
  | ListItemElement
  | MentionElement;
