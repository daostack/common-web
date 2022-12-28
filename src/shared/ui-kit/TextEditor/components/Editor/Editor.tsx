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
  size?: TextEditorSize;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: FocusEventHandler;
}

const Editor: FC<EditorProps> = (props) => {
  const {
    size = TextEditorSize.Small,
    placeholder,
    readOnly = false,
    onBlur,
  } = props;
  const editor = useSlate();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const className = classNames(styles.editor, {
    [styles.editorSmallSize]: size === TextEditorSize.Small,
    [styles.editorBigSize]: size === TextEditorSize.Big,
    [styles.editorReadOnly]: readOnly,
  });

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
      className={className}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      readOnly={readOnly}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

export default Editor;
