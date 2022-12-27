import { Editor, Range, Transforms } from "slate";
import { ElementType } from "../constants";
import { LinkElement } from "../types";
import { isElementActive } from "./isElementActive";
import { unwrapLink } from "./unwrapLink";

export const wrapLink = (editor: Editor, url: string = ""): void => {
  if (isElementActive(editor, ElementType.Link)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = Boolean(selection && Range.isCollapsed(selection));
  const linkElement: LinkElement = {
    type: ElementType.Link,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, linkElement);
  } else {
    Transforms.wrapNodes(editor, linkElement, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
