import React, { FC, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { Editor, ElementButton, MarkButton, Toolbar } from "./components";
import { ElementType, FormatType, TextEditorSize } from "./constants";
import styles from "./TextEditor.module.scss";

interface TextEditorProps {
  size?: TextEditorSize;
  placeholder?: string;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const { size, placeholder } = props;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={initialValue}>
      <div className={styles.container}>
        <Editor size={size} placeholder={placeholder} />
        <Toolbar>
          <MarkButton format={FormatType.Bold} />
          <ElementButton elementType={ElementType.BulletedList} />
        </Toolbar>
      </div>
    </Slate>
  );
};

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
