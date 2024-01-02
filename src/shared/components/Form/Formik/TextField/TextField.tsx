import React, { FC } from "react";
import { useField } from "formik";
import { useZoomDisabling } from "@/shared/hooks";
import { Input, InputProps } from "../../Input";

export type TextFieldProps = InputProps & {
  isRequired?: boolean;
  value?: string;
};

const TextField: FC<TextFieldProps> = (props) => {
  const { isRequired, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");
  useZoomDisabling();

  return (
    <Input
      {...restProps}
      {...field}
      hint={hintToShow}
      error={touched ? error : ""}
    />
  );
};

export default TextField;
