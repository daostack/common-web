import React, {
  FC,
  FocusEventHandler,
  MutableRefObject,
  RefCallback,
  useEffect,
  useMemo,
} from "react";
import classNames from "classnames";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { ErrorText } from "@/shared/components/Form/ErrorText";
import { Editor, Header, Toolbar } from "./components";
import { TextEditorSize } from "./constants";
import { withInlines } from "./hofs";
import {
  TextEditorValue,
  TextEditorStyles,
  EditorElementStyles,
} from "./types";
import styles from "./TextEditor.module.scss";

export interface TextEditorProps {
  className?: string;
  editorClassName?: string;
  editorRef?: MutableRefObject<HTMLElement | null> | RefCallback<HTMLElement>;
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
  disabled?: boolean;
  styles?: TextEditorStyles;
  elementStyles?: EditorElementStyles;
  hideToolbar?: boolean;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const {
    className,
    editorClassName,
    editorRef,
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
    disabled = false,
    styles: outerStyles,
    elementStyles,
    hideToolbar = false,
  } = props;
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  useEffect(() => {
    if (!editorRef) {
      return;
    }

    const editorEl = ReactEditor.toDOMNode(editor, editor);

    if (typeof editorRef === "function") {
      editorRef(editorEl);
    } else {
      editorRef.current = editorEl;
    }
  }, [editorRef, editor]);

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
            className={editorClassName}
            id={id}
            name={name}
            size={size}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            onBlur={onBlur}
            elementStyles={elementStyles}
          />
          {!readOnly && !hideToolbar && <Toolbar disabled={disabled} />}
        </div>
        {Boolean(error) && (
          <ErrorText className={outerStyles?.error}>{error}</ErrorText>
        )}
      </div>
    </Slate>
  );
};

export default TextEditor;
