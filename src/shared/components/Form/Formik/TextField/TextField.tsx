import React, { FC } from "react";
import { useField } from "formik";
import { Input, InputProps } from "../../Input";

export type TextFieldProps = InputProps & {
  isRequired?: boolean;
  value?: string;
};

const TextField: FC<TextFieldProps> = (props) => {
  const { isRequired, value, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");

  return (
    <Input
      {...restProps}
      {...field}
      hint={hintToShow}
      error={touched ? error : ""}
      value={value}
    />
  );
};

export default TextField;
