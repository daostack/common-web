import React, {
  FC,
  FocusEventHandler,
  KeyboardEvent,
  MutableRefObject,
  RefCallback,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useDebounce } from "react-use";
import classNames from "classnames";
import { isEqual } from "lodash";
import {
  createEditor,
  Transforms,
  Range,
  Editor as EditorSlate,
  BaseRange,
  BaseSelection,
} from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { DOMRange } from "slate-react/dist/utils/dom";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { User } from "@/shared/models";
import { getUserName, isMobile, isRtlText } from "@/shared/utils";
import {
  Editor,
  MentionDropdown,
  MENTION_TAG,
  EmojiPicker,
} from "./components";
import { TextEditorSize } from "./constants";
import { withInlines, withMentions, withEmojis, withChecklists } from "./hofs";
import { TextEditorValue, EditorElementStyles } from "./types";
import {
  parseStringToTextEditorValue,
  insertEmoji,
  insertMention,
  checkIsCheckboxCreationText,
  toggleCheckboxItem,
  checkIsEmptyCheckboxCreationText,
} from "./utils";
import styles from "./BaseTextEditor.module.scss";

export interface TextEditorProps {
  className?: string;
  classNameRtl?: string;
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
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void;
  elementStyles?: EditorElementStyles;
  groupChat?: boolean;
}

const INITIAL_SEARCH_VALUE = {
  path: [0, 0],
  offset: 0,
  text: "",
  range: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  },
};

const BaseTextEditor: FC<TextEditorProps> = (props) => {
  const {
    className,
    classNameRtl,
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
    scrollSelectionIntoView,
    elementStyles,
    groupChat,
  } = props;
  const editor = useMemo(
    () =>
      withChecklists(
        withEmojis(
          withMentions(
            withInlines(withHistory(withReact(createEditor())), {
              shouldInsertURLAsLink: false,
            }),
          ),
        ),
      ),
    [],
  );

  const [target, setTarget] = useState<Range | null>();
  const [shouldFocusTarget, setShouldFocusTarget] = useState(false);

  const [isRtlLanguage, setIsRtlLanguage] = useState(false);

  useDebounce(
    () => {
      setIsRtlLanguage(isRtlText(EditorSlate.string(editor, [])));
    },
    5000,
    [value],
  );

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

  const [search, setSearch] = useState(INITIAL_SEARCH_VALUE);

  const handleSearch = (text: string, value?: BaseRange) => {
    if (!value || !value?.anchor || !text || text === "") {
      setSearch(INITIAL_SEARCH_VALUE);
      setTarget(null);
      setShouldFocusTarget(false);
      return;
    }

    if (text === MENTION_TAG) {
      setSearch({
        text,
        ...value.anchor,
        range: value,
      });
    } else if (text.match(/^(\s|$)/)) {
      setSearch(INITIAL_SEARCH_VALUE);
      setTarget(null);
      setShouldFocusTarget(false);
    } else if (
      search.text.includes(MENTION_TAG) &&
      isEqual(search.path, value.anchor.path) &&
      search.offset + 1 === value.anchor.offset
    ) {
      setSearch({
        ...search,
        text: search.text + text,
        ...value.anchor,
      });
      setShouldFocusTarget(false);
    }
  };

  const chars = (users ?? []).filter((user) => {
    return getUserName(user)
      ?.toLowerCase()
      .startsWith(search.text.substring(1).toLowerCase());
  });

  useEffect(() => {
    if (search && search.text) {
      setTarget({
        ...search.range,
        focus: {
          ...search.range.focus,
          offset: search.range.focus.offset + search.text.length - 1,
        },
      });
    }
  }, [search]);

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

  const handleOnChangeSelection = (selection: BaseSelection) => {
    if (selection && Range.isCollapsed(selection)) {
      const {
        anchor: { path: selectionPath, offset: selectionOffset },
      } = selection;
      const [start] = Range.edges(selection);
      const before = EditorSlate.before(editor, start);
      const lineLastPoint = EditorSlate.after(
        editor,
        {
          anchor: {
            offset: 0,
            path: selectionPath,
          },
          focus: {
            offset: 0,
            path: selectionPath,
          },
        },
        { unit: "line" },
      );
      const beforeRange = before && EditorSlate.range(editor, before, start);
      const beforeText = beforeRange && EditorSlate.string(editor, beforeRange);
      const checkboxText = EditorSlate.string(editor, {
        anchor: { offset: 0, path: selectionPath },
        focus: { offset: 3, path: selectionPath },
      }).trim();

      if (
        beforeText === " " &&
        (selectionOffset === 3 || selectionOffset === 4) &&
        selectionOffset === lineLastPoint?.offset &&
        checkIsCheckboxCreationText(checkboxText)
      ) {
        toggleCheckboxItem(
          editor,
          !checkIsEmptyCheckboxCreationText(checkboxText),
          true,
        );
        return;
      }

      handleSearch(beforeText ?? "", beforeRange);
    }
  };

  const handleOnChange = useCallback(
    (updatedContent) => {
      // Prevent update for cursor clicks
      if (isEqual(updatedContent, value)) {
        return;
      }
      onChange && onChange(updatedContent);
      const { selection } = editor;

      handleOnChangeSelection(selection);
    },
    [onChange, value],
  );

  return (
    <div ref={inputContainerRef} className={styles.container}>
      <Slate editor={editor} initialValue={value} onChange={handleOnChange}>
        <Editor
          className={classNames(
            className,
            classNameRtl && {
              [classNameRtl]: isRtlLanguage,
            },
          )}
          id={id}
          name={name}
          size={size}
          placeholder={placeholder}
          readOnly={false}
          disabled={disabled}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          scrollSelectionIntoView={scrollSelectionIntoView}
          elementStyles={elementStyles}
        />
        <EmojiPicker
          isRtl={isRtlLanguage}
          isMessageSent={isMessageSent}
          onToggleIsMessageSent={onToggleIsMessageSent}
          containerClassName={emojiContainerClassName}
          pickerContainerClassName={emojiPickerContainerClassName}
          onEmojiSelect={(emoji) => {
            insertEmoji(editor, emoji.native);
          }}
        />

        {/* For now, we don't support the ability to mention in a group chat.
          See https://github.com/daostack/common-web/issues/2380 */}
        {!groupChat && target && chars.length > 0 && (
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
