import { Editor, Element, NodeEntry, Node } from "slate";
import { EditorNodesOptions } from "slate/dist/interfaces/editor";
import { checkIsParentElementType } from "./checkIsParentElementType";

export const getParentElements = (
  editor: Editor,
  options?: EditorNodesOptions<Node>,
): NodeEntry[] =>
  Array.from(
    Editor.nodes(editor, {
      ...options,
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        checkIsParentElementType(node.type),
    }),
  ) || [];
