import React, { FC } from "react";
import { useField } from "formik";
import { useZoomDisabling } from "@/shared/hooks";
import {
  TextEditor as BaseTextEditor,
  TextEditorProps as BaseTextEditorProps,
} from "@/shared/ui-kit/TextEditor";

export interface TextEditorProps
  extends Omit<BaseTextEditorProps, "value" | "onChange"> {
  name: string;
  isRequired?: boolean;
}

const TextEditor: FC<TextEditorProps> = (props) => {
  const { name, isRequired, ...restProps } = props;
  const [{ value }, { touched, error }, { setValue }] = useField(name);
  useZoomDisabling();
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");

  return (
    <BaseTextEditor
      {...restProps}
      value={value}
      onChange={setValue}
      hint={hintToShow}
      error={touched ? error : ""}
    />
  );
};

export default TextEditor;
