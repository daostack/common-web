import React, { FC, useEffect, useState } from "react";
import TextEditor, { TextEditorProps } from "./TextEditor";

const TextEditorWithReinitialization: FC<TextEditorProps> = (props) => {
  const [textEditorKey, setTextEditorKey] = useState(true);

  useEffect(() => {
    setTextEditorKey((currentKey) => !currentKey);
  }, [props.value]);

  return <TextEditor key={String(textEditorKey)} {...props} />;
};

export default TextEditorWithReinitialization;
