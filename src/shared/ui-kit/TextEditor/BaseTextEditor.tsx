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
import { ErrorText } from "@/shared/components/Form/ErrorText";
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
  } = props;
  const editor = useMemo(
    () => withMentions(withInlines(withHistory(withReact(createEditor())))),
    [],
  );

  const [target, setTarget] = useState<Range | undefined>();
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

  const chars = CHARACTERS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase()),
  ).slice(0, 10);

  console.log("---search", search, chars);
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={() => {
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
        <Portal>
          <div
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                key={char}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, char);
                  setTarget(null);
                }}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: i === index ? "#B4D5FF" : "transparent",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

const insertMention = (editor, character) => {
  const mention: MentionElement = {
    type: ElementType.Mention,
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const CHARACTERS = [
  "Aayla Secura",
  "Adi Gallia",
  "Admiral Dodd Rancit",
  "Admiral Firmus Piett",
  "Admiral Gial Ackbar",
  "Admiral Ozzel",
  "Admiral Raddus",
  "Admiral Terrinald Screed",
  "Admiral Trench",
  "Admiral U.O. Statura",
  "Agen Kolar",
  "Agent Kallus",
  "Aiolin and Morit Astarte",
  "Aks Moe",
  "Almec",
];

export default BaseTextEditor;
