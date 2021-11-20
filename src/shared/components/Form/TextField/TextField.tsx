import React, { FC } from "react";
import { useField } from "formik";
import { FieldHookConfig } from "formik/dist/Field";

import { Input, InputProps } from "../Input";
import "./index.scss";

type TextFieldProps = Omit<InputProps, "error"> & FieldHookConfig<string> & {
  isRequired?: boolean;
};

const TextField: FC<TextFieldProps> = (props) => {
  const { className, label, isRequired, hint, maxLength, shouldDisplayCount, styles, isTextarea, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = hint || (isRequired ? "Required" : "");

  return (
    <Input
      {...field}
      className={className}
      label={label}
      placeholder={restProps.placeholder}
      hint={hintToShow}
      maxLength={maxLength}
      shouldDisplayCount={shouldDisplayCount}
      error={touched ? error : ''}
      styles={styles}
      isTextarea={isTextarea}
    />
  );
};

export default TextField;
