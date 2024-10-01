import React, { forwardRef } from "react";
import { useField } from "formik";
import { useZoomDisabling } from "@/shared/hooks";
import { Input, InputProps, InputRef } from "../../Input";

export type TextFieldProps = InputProps & {
  isRequired?: boolean;
  value?: string;
};

const TextField = forwardRef<InputRef ,TextFieldProps>((props, ref) => {
  const { isRequired, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = restProps.hint || (isRequired ? "Required" : "");
  useZoomDisabling();

  return (
    <Input
      ref={ref}
      {...restProps}
      {...field}
      hint={hintToShow}
      error={touched ? error : ""}
    />
  );
});

export default TextField;
