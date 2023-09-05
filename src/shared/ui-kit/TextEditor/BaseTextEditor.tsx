import React, {
  FC,
  FocusEventHandler,
  KeyboardEvent,
  MutableRefObject,
  RefCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createEditor, Transforms, Range, Editor as EditorSlate } from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { User } from "@/shared/models";
import { getUserName, isMobile } from "@/shared/utils";
import {
  Editor,
  MentionDropdown,
  MENTION_TAG,
  EmojiPicker,
} from "./components";
import { TextEditorSize } from "./constants";
import { withInlines, withMentions, withEmojis } from "./hofs";
import { TextEditorValue, EditorElementStyles } from "./types";
import {
  parseStringToTextEditorValue,
  insertEmoji,
  insertMention,
} from "./utils";
import styles from "./BaseTextEditor.module.scss";

export interface TextEditorProps {
  className?: string;
  emojiContainerClassName?: string;
  emojiPickerContainerClassName?: string;
  inputContainerRef?:
    | MutableRefObject<HTMLDivElement | null>
    | RefCallback<HTMLDivElement>;
  editorRef?: MutableRefObject<HTMLElement | null> | RefCallback<HTMLElement>;
  id?: string;
  name?: string;
  placeholder?: string;
  optional?: boolean;
  value: TextEditorValue;
  onChange?: (value: TextEditorValue) => void;
  onBlur?: FocusEventHandler;
  size?: TextEditorSize;
  disabled?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  users?: User[];
  shouldReinitializeEditor: boolean;
  onClearFinished: () => void;
  elementStyles?: EditorElementStyles;
}

const BaseTextEditor: FC<TextEditorProps> = (props) => {
  const {
    className,
    emojiContainerClassName,
    emojiPickerContainerClassName,
    editorRef,
    inputContainerRef,
    id,
    name,
    value,
    onChange,
    onBlur,
    onKeyDown,
    size,
    placeholder,
    disabled = false,
    users,
    shouldReinitializeEditor = false,
    onClearFinished,
    elementStyles,
  } = props;
  const editor = useMemo(
    () =>
      withEmojis(
        withMentions(
          withInlines(withHistory(withReact(createEditor())), {
            shouldInsertURLAsLink: false,
          }),
        ),
      ),
    [],
  );

  const [target, setTarget] = useState<Range | null>();
  const [shouldFocusTarget, setShouldFocusTarget] = useState(false);
  useEffect(() => {
    if (!shouldReinitializeEditor) {
      return;
    }

    setTimeout(() => {
      Transforms.delete(editor, {
        at: {
          anchor: EditorSlate.start(editor, []),
          focus: EditorSlate.end(editor, []),
        },
      });

      // Removes empty node
      Transforms.removeNodes(editor, {
        at: [0],
      });

      // Insert array of children nodes
      Transforms.insertNodes(editor, parseStringToTextEditorValue());
      const editorEl = ReactEditor.toDOMNode(editor, editor);
      editorEl.scrollTo(0, 0);
      onClearFinished();
    }, 0);
  }, [shouldReinitializeEditor, onClearFinished]);

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

  const [search, setSearch] = useState("");

  const chars = (users ?? []).filter((user) => {
    if (!search) {
      return getUserName(user);
    }

    return getUserName(user)?.toLowerCase().startsWith(search.toLowerCase());
  });

  const [isMessageSent, setIsMessageSent] = useState(false);

  const onToggleIsMessageSent = () => {
    setIsMessageSent((value) => !value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === KeyboardKeys.ArrowUp && target) {
      event.preventDefault();
      setShouldFocusTarget(true);
    } else {
      onKeyDown && onKeyDown(event);
      if (event.key === KeyboardKeys.Enter && !isMobile()) {
        onToggleIsMessageSent();
      }
    }
  };

  const onChangeSlate = (value) => {
    onChange && onChange(value);
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = EditorSlate.before(editor, start, {
        unit: "word",
      });

      const lastCharacterRange =
        start &&
        EditorSlate.range(
          editor,
          { ...start, offset: start.offset - 1 },
          start,
        );

      const lastCharacter = EditorSlate.string(editor, lastCharacterRange);

      const before = wordBefore && EditorSlate.before(editor, wordBefore);
      const beforeRange = before && EditorSlate.range(editor, before, start);

      const beforeText = beforeRange && EditorSlate.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);

      const after = EditorSlate.after(editor, start);
      const afterRange = EditorSlate.range(editor, start, after);
      const afterText = EditorSlate.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[1]);
        return;
      }

      if (lastCharacter === MENTION_TAG && lastCharacterRange) {
        setTarget(lastCharacterRange);
        setSearch("");
        return;
      }
    }

    setTarget(null);
  };

  return (
    <div ref={inputContainerRef} className={styles.container}>
      <Slate editor={editor} value={value} onChange={onChangeSlate}>
        <Editor
          className={className}
          id={id}
          name={name}
          size={size}
          placeholder={placeholder}
          readOnly={false}
          disabled={disabled}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          elementStyles={elementStyles}
        />
        <EmojiPicker
          isMessageSent={isMessageSent}
          onToggleIsMessageSent={onToggleIsMessageSent}
          containerClassName={emojiContainerClassName}
          pickerContainerClassName={emojiPickerContainerClassName}
          onEmojiSelect={(emoji) => {
            Transforms.select(editor, EditorSlate.end(editor, []));
            insertEmoji(editor, emoji.native);
          }}
        />

        {target && chars.length > 0 && (
          <MentionDropdown
            shouldFocusTarget={shouldFocusTarget}
            onClick={(user: User) => {
              Transforms.select(editor, target);
              insertMention(editor, user);
              setTarget(null);
              setShouldFocusTarget(false);
            }}
            users={chars}
            onClose={() => {
              setTarget(null);
              setShouldFocusTarget(false);
            }}
          />
        )}
      </Slate>
    </div>
  );
};

export default BaseTextEditor;
