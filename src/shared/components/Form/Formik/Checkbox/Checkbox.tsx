import React, { useCallback, FC } from "react";
import { useField } from "formik";

import {
  Checkbox as BaseCheckbox,
  CheckboxProps as BaseCheckboxProps,
} from "../../Checkbox";

type CheckboxProps = Omit<BaseCheckboxProps, "type" | "error" | "checked" | "onChange">;

const Checkbox: FC<CheckboxProps> = (props) => {
  const [{ value }, { touched, error }, { setTouched, setValue }] = useField(props.name);

  const handleChange = useCallback(() => {
    setTouched(true);
    setValue(!value);
  }, [setTouched, setValue, value]);

  return (
    <BaseCheckbox
      {...props}
      checked={value}
      onChange={handleChange}
      error={touched ? error : ''}
    />
  );
};

export default Checkbox;
