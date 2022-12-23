import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { ElementType } from "./constants";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

export type CustomText = FormattedText;

interface BaseElement {
  type: ElementType;
  children: CustomText[];
}

export interface ParagraphElement extends BaseElement {
  type: ElementType.Paragraph;
}

export interface NumberedListElement extends BaseElement {
  type: ElementType.NumberedList;
}

export interface BulletedListElement extends BaseElement {
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
