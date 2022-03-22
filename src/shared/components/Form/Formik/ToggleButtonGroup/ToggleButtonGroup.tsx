import React, { useCallback, FC } from "react";
import { useField } from "formik";

import {
  ToggleButtonGroup as BaseToggleButtonGroup,
  ToggleButtonGroupProps as BaseToggleButtonGroupProps,
} from "../../ToggleButtonGroup";

type ToggleButtonGroupProps = Pick<
  BaseToggleButtonGroupProps,
  "className" | "label" | "styles"
> & {
  name: string;
  onChange?: BaseToggleButtonGroupProps["onChange"];
};

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = (props) => {
  const { name, onChange, ...restProps } = props;
  const [{ value }, { touched, error }, { setTouched, setValue }] = useField(
    name
  );

  const handleChange = useCallback(
    (newValue: unknown) => {
      setTouched(true);
      setValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    },
    [setTouched, setValue, onChange]
  );

  return (
    <BaseToggleButtonGroup
      {...restProps}
      value={value}
      onChange={handleChange}
      error={touched ? error : ""}
    />
  );
};

export default ToggleButtonGroup;
