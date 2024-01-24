import React, {
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
  useCallback,
} from "react";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { Editable, ReactEditor, useSlate } from "slate-react";
import { DOMRange } from "slate-react/dist/utils/dom";
import { Element, Leaf } from "../../components";
import { HOTKEYS, TextEditorSize } from "../../constants";
import { EditorElementStyles } from "../../types";
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
  onFocus?: FocusEventHandler;
  elementStyles?: EditorElementStyles;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void;
}

const Editor: FC<EditorProps> = (props) => {
  const {
    size = TextEditorSize.Small,
    placeholder,
    elementStyles,
    readOnly = false,
    disabled = false,
    onBlur,
    onFocus,
    onKeyDown,
    scrollSelectionIntoView,
  } = props;
  const editor = useSlate();
  const renderElement = useCallback(
    (props) => <Element {...props} styles={elementStyles} />,
    [elementStyles],
  );
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const className = classNames(
    styles.editor,
    {
      [styles.editorSmallSize]: size === TextEditorSize.Small,
      [styles.editorBigSize]: size === TextEditorSize.Big,
      [styles.editorAutoSize]: size === TextEditorSize.Auto,
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
    onKeyDown && onKeyDown(event);
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
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      scrollSelectionIntoView={scrollSelectionIntoView}
    />
  );
};

export default Editor;
