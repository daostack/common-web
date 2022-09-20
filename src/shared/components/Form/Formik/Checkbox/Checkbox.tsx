import React, { useCallback, ChangeEventHandler, FC } from "react";
import { useField } from "formik";
import {
  Checkbox as BaseCheckbox,
  CheckboxProps as BaseCheckboxProps,
} from "../../Checkbox";

type CheckboxProps = Omit<BaseCheckboxProps, "type" | "error" | "checked">;

const Checkbox: FC<CheckboxProps> = (props) => {
  const { onChange, ...restProps } = props;
  const [{ value }, { touched, error }, { setTouched, setValue }] = useField(
    props.name
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setTouched(true);
      if (onChange) {
        onChange(event);
      }

      setValue(event.target.checked);

    },
    [setTouched, setValue, onChange]
  );

  return (
    <BaseCheckbox
      {...restProps}
      checked={value}
      onChange={handleChange}
      error={touched ? error : ""}
    />
  );
};

export default Checkbox;
