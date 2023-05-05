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
import { isEqual } from "lodash";
import {
  createEditor,
  Transforms,
  Range,
  Editor as EditorSlate,
  BaseRange,
} from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { User } from "@/shared/models";
import { Editor, MentionDropdown, MENTION_TAG } from "./components";
import { TextEditorSize } from "./constants";
import { withInlines, withMentions } from "./hofs";
import { TextEditorValue } from "./types";
import { parseStringToTextEditorValue } from "./utils";
import { insertMention } from "./utils/insertMention";

export interface TextEditorProps {
  className?: string;
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
    editorRef,
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
  } = props;
  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    [],
  );

  const [target, setTarget] = useState<Range | null>();
  useEffect(() => {
    if (shouldReinitializeEditor) {
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
      onClearFinished();
    }
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
        text: search.text + text,
        ...value.anchor,
        range: value,
      });
    }
  };

  const chars = (users ?? []).filter(({ displayName }) => {
    return displayName
      ?.toLowerCase()
      .startsWith(search.text.substring(1).toLowerCase());
  });

  useEffect(() => {
    if (search && search.text && !target) {
      setTarget({ ...search.range });
    }
  }, [search]);

  const [shouldFocusTarget, setShouldFocusTarget] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === KeyboardKeys.ArrowUp && target && !shouldFocusTarget) {
      event.preventDefault();
      setShouldFocusTarget(true);
    } else {
      onKeyDown && onKeyDown(event);
    }
  };

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(val) => {
        onChange && onChange(val);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const before = EditorSlate.before(editor, start);
          const beforeRange =
            before && EditorSlate.range(editor, before, start);
          const beforeText =
            beforeRange && EditorSlate.string(editor, beforeRange);

          handleSearch(beforeText ?? "", beforeRange);
        }
      }}
    >
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
  );
};

export default BaseTextEditor;
