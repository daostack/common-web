import React, { useCallback, FC } from "react";
import { useField } from "formik";

import {
  CurrencyInput as BaseCurrencyInput,
  CurrencyInputProps as BaseCurrencyInputProps,
} from "../../CurrencyInput";

type CurrencyInputProps = Omit<BaseCurrencyInputProps, "type" | "error" | "value" | "onValueChange">;

const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  const [{ value }, { touched, error }, { setTouched, setValue }] = useField(props.name);

  const handleValueChange = useCallback((newValue?: string) => {
    setValue(newValue);
  }, [setValue]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, [setTouched]);

  return (
    <BaseCurrencyInput
      {...props}
      value={value}
      onValueChange={handleValueChange}
      onBlur={handleBlur}
      error={touched ? error : ''}
    />
  );
};

export default CurrencyInput;
