import React, { FC, useMemo } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { Editor, Header, Toolbar } from "./components";
import { TextEditorSize } from "./constants";
import { TextEditorValue, TextEditorStyles } from "./types";
import styles from "./TextEditor.module.scss";

interface TextEditorProps {
  label?: string;
  hint?: string;
  optional?: boolean;
  value: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
  size?: TextEditorSize;
  placeholder?: string;
  styles?: TextEditorStyles;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const {
    label,
    hint,
    optional,
    value,
    onChange,
    size,
    placeholder,
    styles: outerStyles,
  } = props;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className={styles.container}>
        <Header
          label={label}
          hint={hint}
          optional={optional}
          styles={outerStyles}
        />
        <div className={styles.editorWrapper}>
          <Editor size={size} placeholder={placeholder} />
          <Toolbar />
        </div>
      </div>
    </Slate>
  );
};

export default TextEditor;
