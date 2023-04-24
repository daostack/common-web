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
import { MentionDropdown } from "@/pages/common/components/ChatComponent/components/MentionDropdown";
import { User } from "@/shared/models";
import { Editor } from "./components";
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
  const [search, setSearch] = useState("");

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

  const chars = (users ?? [])
    .filter(({ displayName }) =>
      displayName?.toLowerCase().startsWith(search.toLowerCase()),
    )
    .slice(0, 10);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(val) => {
        onChange && onChange(val);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = EditorSlate.before(editor, start, {
            unit: "word",
          });
          const before = wordBefore && EditorSlate.before(editor, wordBefore);
          const beforeRange =
            before && EditorSlate.range(editor, before, start);
          const beforeText =
            beforeRange && EditorSlate.string(editor, beforeRange);
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
        }

        setTarget(null);
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
        onKeyDown={onKeyDown}
      />
      {target && chars.length > 0 && (
        <MentionDropdown
          onClick={(user: User) => {
            Transforms.select(editor, target);
            insertMention(editor, user);
            setTarget(null);
          }}
          users={chars}
        />
      )}
    </Slate>
  );
};

export default BaseTextEditor;
