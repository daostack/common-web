import React, {
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
} from "react";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { Editable, useSlate } from "slate-react";
import { Element, Leaf } from "../../components";
import { HOTKEYS, TextEditorSize } from "../../constants";
import { toggleMark } from "../../utils";
import styles from "./Editor.module.scss";

interface EditorProps {
  className?: string;
  id?: string;
  name?: string;
  size?: TextEditorSize;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onBlur?: FocusEventHandler;
}

const Editor: FC<EditorProps> = (props) => {
  const {
    size = TextEditorSize.Small,
    placeholder,
    readOnly = false,
    disabled = false,
    onBlur,
  } = props;
  const editor = useSlate();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const className = classNames(
    styles.editor,
    {
      [styles.editorSmallSize]: size === TextEditorSize.Small,
      [styles.editorBigSize]: size === TextEditorSize.Big,
      [styles.editorReadOnly]: readOnly,
    },
    props.className,
  );
  const id = props.id || props.name;

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    Object.entries(HOTKEYS).forEach(([hotkey, format]) => {
      if (!isHotkey(hotkey, event)) {
        return;
      }

      event.preventDefault();
      toggleMark(editor, format);
    });
  };

  return (
    <Editable
      id={id}
      className={className}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      readOnly={readOnly || disabled}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default Editor;
