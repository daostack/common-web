import React, { FC } from "react";
import { useField } from "formik";
import {
  TextEditor as BaseTextEditor,
  TextEditorProps as BaseTextEditorProps,
} from "@/shared/ui-kit/TextEditor";

interface TextEditorProps
  extends Omit<BaseTextEditorProps, "value" | "onChange"> {
  name: string;
  isRequired?: boolean;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const { name, isRequired, ...restProps } = props;
  const [field, { touched, error }] = useField(name);
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");

  return (
    <BaseTextEditor
      {...restProps}
      {...field}
      hint={hintToShow}
      error={touched ? error : ""}
    />
  );
};

export default TextEditor;
