import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { Element, Leaf, MarkButton, Toolbar } from "./components";
import { ElementType, FormatType, HOTKEYS } from "./constants";
import { toggleMark } from "./utils";

const TextEditor = () => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
      <Toolbar>
        <MarkButton format={FormatType.Bold} />
        {/*<BlockButton format="numbered-list" icon="format_list_numbered" />*/}
        {/*<BlockButton format="bulleted-list" icon="format_list_bulleted" />*/}
      </Toolbar>
    </Slate>
  );
};

// const BlockButton: FC<{ elementType: ElementType }> = ({ elementType }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isElementActive(editor, elementType)}
//       onMouseDown={(event) => {
//         event.preventDefault();
//         toggleElement(editor, elementType);
//       }}
//     >
//       {icon}
//     </Button>
//   );
// };

const initialValue: Descendant[] = [
  {
    type: ElementType.Paragraph,
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
];

export default TextEditor;
