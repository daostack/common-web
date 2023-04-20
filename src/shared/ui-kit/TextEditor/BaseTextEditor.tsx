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
import classNames from "classnames";
import { createEditor, Transforms, Range, Editor as EditorSlate } from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, Slate, withReact } from "slate-react";
import { MentionDropdown } from "@/pages/common/components/ChatComponent/components/MentionDropdown";
import { UserAvatar } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form/ErrorText";
import { User } from "@/shared/models";
import { Portal } from "@/shared/ui-kit";
import { Editor, Header, Toolbar } from "./components";
import { ElementType, TextEditorSize } from "./constants";
import { withInlines, withMentions } from "./hofs";
import { TextEditorValue, TextEditorStyles, MentionElement } from "./types";
import styles from "./TextEditor.module.scss";

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
  } = props;
  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    [],
  );

  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");

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

  console.log("---search", search, chars, target, value);
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
            setIndex(0);
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

const insertMention = (editor, character) => {
  const mention: MentionElement = {
    type: ElementType.Mention,
    character: character?.displayName,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

export default BaseTextEditor;
