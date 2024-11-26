import React, {
  FocusEventHandler,
  KeyboardEvent,
  MutableRefObject,
  RefCallback,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
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
import { AI_PRO_USER, AI_USER, FeatureFlags } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useFeatureFlag } from "@/shared/hooks";
import { Discussion, User } from "@/shared/models";
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
  insertStreamMention,
  checkIsCheckboxCreationText,
  toggleCheckboxItem,
  checkIsEmptyCheckboxCreationText,
} from "./utils";
import styles from "./BaseTextEditor.module.scss";

export interface BaseTextEditorHandles {
  focus: () => void;
  clear: () => void;
}

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
  discussions?: Discussion[];
  shouldReinitializeEditor: boolean;
  onClearFinished: () => void;
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void;
  elementStyles?: EditorElementStyles;
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

const BaseTextEditor = forwardRef<BaseTextEditorHandles, TextEditorProps>(
  (props, ref) => {
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
      discussions,
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
    const featureFlags = useFeatureFlag();
    const isAiBotProEnabled = featureFlags?.get(FeatureFlags.AiBotPro);

    const usersWithAI = useMemo(
      () => [isAiBotProEnabled ? AI_PRO_USER : AI_USER, ...(users ?? [])],
      [users],
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

    const clearInput = () => {
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
    };

    useEffect(() => {
      if (!shouldReinitializeEditor) {
        return;
      }

      clearInput();
    }, [shouldReinitializeEditor, clearInput]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (editorRef) {
          const end = EditorSlate.end(editor, []);

          // Move the selection to the end
          Transforms.select(editor, end);

          // Focus the editor DOM node
          const editorEl = ReactEditor.toDOMNode(editor, editor);
          editorEl.focus();

          // Ensure the editor itself is focused programmatically
          ReactEditor.focus(editor);
        }
      },
      clear: () => {
        clearInput();
      },
    }));

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

    const chars = (usersWithAI ?? []).filter((user) => {
      return getUserName(user)
        ?.toLowerCase()
        .startsWith(search.text.substring(1).toLowerCase());
    });

    const discussionChars = (discussions ?? []).filter((discussion) => {
      return discussion.title
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
        // event.stopPropagation();
        onKeyDown && onKeyDown(event); // Call any custom onKeyDown handler
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
        const beforeText =
          beforeRange && EditorSlate.string(editor, beforeRange);
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

    const handleMentionSelectionChange = useCallback(() => {
      if (!editor.selection || editor.selection.anchor.path.length <= 2) {
        return;
      }

      const { anchor } = editor.selection;
      const point: BaseRange["anchor"] = {
        ...anchor,
        path: [anchor.path[0], anchor.path[1] + 1],
      };
      Transforms.select(editor, {
        anchor: point,
        focus: point,
      });
    }, []);

    const handleOnChange = useCallback(
      (updatedContent) => {
        // Prevent update for cursor clicks
        if (isEqual(updatedContent, value)) {
          handleMentionSelectionChange();
          return;
        }
        onChange && onChange(updatedContent);
        const { selection } = editor;

        handleOnChangeSelection(selection);
      },
      [onChange, value, handleMentionSelectionChange],
    );

    const customScrollSelectionIntoView = () => {
      if (
        inputContainerRef &&
        "current" in inputContainerRef &&
        inputContainerRef?.current
      ) {
        inputContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    };

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
            scrollSelectionIntoView={
              scrollSelectionIntoView ?? customScrollSelectionIntoView
            }
            elementStyles={elementStyles}
          />
          <EmojiPicker
            isMessageSent={isMessageSent}
            onToggleIsMessageSent={onToggleIsMessageSent}
            containerClassName={emojiContainerClassName}
            pickerContainerClassName={emojiPickerContainerClassName}
            onEmojiSelect={(emoji) => {
              insertEmoji(editor, emoji.native);
            }}
          />

          {target && (
            <MentionDropdown
              shouldFocusTarget={shouldFocusTarget}
              onClick={(user: User) => {
                Transforms.select(editor, target);
                insertMention(editor, user);
                setTarget(null);
                setShouldFocusTarget(false);
              }}
              onClickDiscussion={(discussion: Discussion) => {
                Transforms.select(editor, target);
                insertStreamMention(editor, discussion);
                setTarget(null);
                setShouldFocusTarget(false);
              }}
              users={chars}
              discussions={discussionChars}
              initUsers={usersWithAI}
              initDiscussions={discussions}
              onClose={() => {
                setTarget(null);
                setShouldFocusTarget(false);
              }}
            />
          )}
        </Slate>
      </div>
    );
  },
);

export default BaseTextEditor;
