import React, {
  useRef,
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
  BasePoint,
  Text,
} from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { DOMRange } from "slate-react/dist/utils/dom";
import { AI_PRO_USER, AI_USER, FeatureFlags } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useFeatureFlag } from "@/shared/hooks";
import { Discussion, User } from "@/shared/models";
import { generateDiscussionShareLink, getUserName, isMobile, isRtlText } from "@/shared/utils";
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
  circleVisibility?: string[];
  user?: User | null;
  commonId?: string;
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
      circleVisibility,
      user,
      commonId,
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
    const isNewMentionCreated = useRef<boolean>(false);

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

    const getTextByRange = (editor, range) => {
      if (
        !range ||
        !EditorSlate.hasPath(editor, range.anchor.path) ||
        !EditorSlate.hasPath(editor, range.focus.path)
      ) {
        return "";
      }

      const filteredNodes = Array.from(
        EditorSlate.nodes(editor, { at: range }),
      ).filter(([node]) => Text.isText(node));
      const nodes = filteredNodes.map(([node, path]) => {
        // Determine the start and end offsets for this node
        const { anchor, focus } =
          Range.intersection(range, EditorSlate.range(editor, path)) || {};

        if (!anchor || !focus) return "";

        // Extract the substring within the offsets
        const text =
          (node as Text)?.text.slice(anchor.offset, focus.offset + 1) +
          (filteredNodes.length > 1 ? " " : "");

        // Remove newlines from the text
        return text.replace(/\n/g, "");
      });

      if(nodes.length > 1) {
        return nodes.join("").slice(0, -1);
      }

      return nodes.join("");
    };

    const handleSearch = (
      text: string,
      value?: BaseRange,
      afterValue?: BasePoint,
    ) => {
      if (!value || !value?.anchor || isNewMentionCreated.current) {
        setSearch(INITIAL_SEARCH_VALUE);
        isNewMentionCreated.current = false;
        setTarget(null);
        setShouldFocusTarget(false);
        return;
      }

      const newText = target?.anchor
        ? getTextByRange(editor, {
            ...target,
            focus: afterValue ? { ...afterValue, offset: afterValue.offset } : { ...value.anchor, offset: value.anchor.offset + 1 },
          })
        : "";

      if (text === MENTION_TAG) {
        setSearch({
          text,
          ...value.anchor,
          range: value,
        });
      } else if (search.text.includes(MENTION_TAG) && text.match(/^\s+/)) {
        setSearch((prevSearch) => {
          {
            return {
              ...prevSearch,
              text: newText,
              ...value.anchor,
              range: {
                ...prevSearch.range,
                focus: afterValue ? afterValue : value.anchor,
              },
            };
          }
        });
      } else if (search.text.includes(MENTION_TAG)) {
        setSearch((prevSearch) => {
          return {
            ...prevSearch,
            text: newText,
            ...value.anchor,
            range: {
              ...prevSearch.range,
              focus: afterValue ? afterValue : value.anchor,
            },
          };
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
            offset: search.range.focus.offset + 1,
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
      } else if (
        event.key === KeyboardKeys.Enter &&
        !event.shiftKey &&
        target
      ) {
        setSearch(INITIAL_SEARCH_VALUE);
        setTarget(null);
        setShouldFocusTarget(false);
        isNewMentionCreated.current = true;
      } else if (event.key === KeyboardKeys.Escape && target) {
        event.preventDefault();
        setSearch(INITIAL_SEARCH_VALUE);
        setTarget(null);
        setShouldFocusTarget(false);
      } else {
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

        handleSearch(beforeText ?? "", beforeRange, lineLastPoint);
      }
    };

    const handleMentionSelectionChange = () => {
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
    };

    const handleOnChange = useCallback(
      (updatedContent) => {
        if (isEqual(updatedContent, value)) {
          handleMentionSelectionChange();
          return;
        }
        onChange && onChange(updatedContent);
        handleOnChangeSelection(editor.selection);
      },
      [onChange, value, handleSearch, handleMentionSelectionChange],
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
                isNewMentionCreated.current = true;
              }}
              onClickDiscussion={(discussion: Discussion) => {
                Transforms.select(editor, target);
                insertStreamMention(editor, discussion);
                setTarget(null);
                setShouldFocusTarget(false);
                isNewMentionCreated.current = true;
              }}
              onCreateDiscussion={(createdDiscussionCommonId: string, discussionId: string) => {
                Transforms.select(editor, target);
                const link = generateDiscussionShareLink(createdDiscussionCommonId, discussionId);
                Transforms.insertText(editor, link);
                setTarget(null);
                setShouldFocusTarget(false);
                isNewMentionCreated.current = true;
              }}
              user={user}
              commonId={commonId}
              circleVisibility={circleVisibility}
              users={chars}
              discussions={discussionChars}
              initUsers={usersWithAI}
              initDiscussions={discussions}
              searchText={search.text}
              onClose={() => {
                setSearch(INITIAL_SEARCH_VALUE);
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
