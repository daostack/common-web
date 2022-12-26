import React, { FC, useMemo } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { Editor, Toolbar } from "./components";
import { TextEditorSize } from "./constants";
import { TextEditorValue } from "./types";
import styles from "./TextEditor.module.scss";

interface TextEditorProps {
  value: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
  size?: TextEditorSize;
  placeholder?: string;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const { value, onChange, size, placeholder } = props;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className={styles.container}>
        <Editor size={size} placeholder={placeholder} />
        <Toolbar />
      </div>
    </Slate>
  );
};

export default TextEditor;
