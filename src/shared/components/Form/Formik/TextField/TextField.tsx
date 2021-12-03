import React, { FC } from "react";
import { useField } from "formik";

import { Input, InputProps } from "../../Input";

type TextFieldProps = InputProps & {
  isRequired?: boolean;
};

const TextField: FC<TextFieldProps> = (props) => {
  const { isRequired, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");

  return (
    <Input
      {...restProps}
      {...field}
      hint={hintToShow}
      error={touched ? error : ''}
    />
  );
};

export default TextField;
