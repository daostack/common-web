import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { ElementType } from "./constants";

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

interface BaseElement<Child = CustomText> {
  type: ElementType;
  children: Child[];
  indentLevel?: number;
}

export interface ParagraphElement extends BaseElement {
  type: ElementType.Paragraph;
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

export type CustomElement =
  | ParagraphElement
  | NumberedListElement
  | BulletedListElement
  | ListItemElement;
