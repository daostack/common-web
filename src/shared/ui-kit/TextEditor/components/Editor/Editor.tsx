import React, {
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  KeyboardEvent,
  useCallback,
} from "react";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import {
  DefaultPlaceholder,
  Editable,
  ReactEditor,
  RenderPlaceholderProps,
  useSlate,
} from "slate-react";
import { DOMRange } from "slate-react/dist/utils/dom";
import { Element, Leaf } from "../../components";
import { HOTKEYS, TextEditorSize } from "../../constants";
import { EditorElementStyles } from "../../types";
import { checkIsCheckboxItemElement, toggleMark } from "../../utils";
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
  elementStyles?: EditorElementStyles;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void;
}

const renderPlaceholder = ({
  attributes,
  children,
}: RenderPlaceholderProps) => (
  <DefaultPlaceholder
    attributes={{
      ...attributes,
      style: {
        ...attributes.style,
        top: "50%",
        transform: "translateY(-50%)",
      },
    }}
  >
    {children}
  </DefaultPlaceholder>
);

const Editor: FC<EditorProps> = (props) => {
  const {
    size = TextEditorSize.Small,
    elementStyles,
    readOnly = false,
    disabled = false,
    onBlur,
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
  const placeholder =
    editor.children[0] && checkIsCheckboxItemElement(editor.children[0])
      ? undefined
      : props.placeholder;

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
      renderPlaceholder={renderPlaceholder}
      spellCheck
      readOnly={readOnly || disabled}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      scrollSelectionIntoView={scrollSelectionIntoView}
    />
  );
};

export default Editor;
