import React, { FC, KeyboardEventHandler, useCallback } from "react";
import isHotkey from "is-hotkey";
import { Editable, useSlate } from "slate-react";
import { Element, Leaf } from "../../components";
import { HOTKEYS } from "../../constants";
import { toggleMark } from "../../utils";
import styles from "./Editor.module.scss";

interface EditorProps {
  placeholder?: string;
}

const Editor: FC<EditorProps> = (props) => {
  const { placeholder } = props;
  const editor = useSlate();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

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
      className={styles.editor}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      onKeyDown={handleKeyDown}
    />
  );
};

export default Editor;
