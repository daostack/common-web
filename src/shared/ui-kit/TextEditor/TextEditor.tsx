import React, { FC, FocusEventHandler, useMemo } from "react";
import classNames from "classnames";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import { ErrorText } from "@/shared/components/Form/ErrorText";
import { Editor, Header, Toolbar } from "./components";
import { TextEditorSize } from "./constants";
import { withInlines } from "./hofs";
import { TextEditorValue, TextEditorStyles } from "./types";
import styles from "./TextEditor.module.scss";

export interface TextEditorProps {
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  optional?: boolean;
  value: TextEditorValue;
  onChange?: (value: TextEditorValue) => void;
  onBlur?: FocusEventHandler;
  size?: TextEditorSize;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
  styles?: TextEditorStyles;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const {
    className,
    id,
    name,
    label,
    hint,
    optional,
    value,
    onChange,
    onBlur,
    size,
    placeholder,
    error,
    readOnly = false,
    styles: outerStyles,
  } = props;
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className={classNames(styles.container, className)}>
        <Header
          label={label}
          hint={hint}
          optional={optional}
          styles={outerStyles}
        />
        <div
          className={classNames(styles.editorWrapper, {
            [styles.editorWrapperReadOnly]: readOnly,
          })}
        >
          <Editor
            id={id}
            name={name}
            size={size}
            placeholder={placeholder}
            readOnly={readOnly}
            onBlur={onBlur}
          />
          {!readOnly && <Toolbar />}
        </div>
        {Boolean(error) && (
          <ErrorText className={outerStyles?.error}>{error}</ErrorText>
        )}
      </div>
    </Slate>
  );
};

export default TextEditor;
