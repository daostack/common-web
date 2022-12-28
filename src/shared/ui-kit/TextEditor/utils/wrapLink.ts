import { Editor, Range, Transforms } from "slate";
import { ElementType } from "../constants";
import { LinkElement } from "../types";
import { getElementsByType } from "./getElementsByType";
import { unwrapLink } from "./unwrapLink";

export const wrapLink = (editor: Editor, url = ""): void => {
  const { selection } = editor;
  const isCollapsed = Boolean(selection && Range.isCollapsed(selection));
  const linkElement: LinkElement = {
    type: ElementType.Link,
    url,
    children: [],
  };

  if (!isCollapsed) {
    unwrapLink(editor);
    Transforms.wrapNodes(editor, linkElement, { split: true });
    Transforms.collapse(editor, { edge: "end" });
    return;
  }

  linkElement.children = [{ text: url }];

  if (!selection) {
    Transforms.insertNodes(editor, linkElement);
    return;
  }

  const [linkEntity] = getElementsByType<LinkElement>(
    editor,
    ElementType.Link,
    {
      at: Editor.unhangRange(editor, selection),
    },
  );

  if (!linkEntity) {
    Transforms.insertNodes(editor, linkElement);
    return;
  }

  const newLinkProperties: Partial<LinkElement> = { url };
  Transforms.setNodes(editor, newLinkProperties, {
    at: linkEntity[1],
  });
};
