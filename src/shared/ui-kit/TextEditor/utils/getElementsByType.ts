import { Editor, Element, NodeEntry, Node } from "slate";
import { EditorNodesOptions } from "slate/dist/interfaces/editor";
import { ElementType } from "../constants";
import { CustomElement } from "../types";

export const getElementsByType = <T extends CustomElement>(
  editor: Editor,
  elementType: ElementType,
  options?: EditorNodesOptions<Node>,
): NodeEntry<T>[] =>
  Array.from(
    Editor.nodes(editor, {
      ...options,
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        node.type === elementType,
    }),
  ) || [];
