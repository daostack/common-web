import React, { useCallback, FC, useEffect } from "react";
import { useField } from "formik";
import {
  Dropdown as BaseDropdown,
  DropdownProps as BaseDropdownProps,
} from "../../../Dropdown";

type DropdownProps = Omit<BaseDropdownProps, "value" | "onSelect"> & {
  name: string;
  onSelect?: (value: unknown) => void;
  autoSelect?: boolean;
};

const Dropdown: FC<DropdownProps> = (props) => {
  const { name, onSelect, autoSelect, options, ...restProps } = props;
  const [{ value }, , { setTouched, setValue }] = useField(name);
  const handleSelect = useCallback(
    (newValue: unknown) => {
      setValue(newValue);
      setTouched(true);
      onSelect && onSelect(newValue);
    },
    [setTouched, setValue],
  );

  useEffect(() => {
    const firstOption = options[0];
    if (autoSelect && !value && firstOption) {
      handleSelect(firstOption.value);
    }
  }, [autoSelect, options, value, handleSelect]);

  return (
    <BaseDropdown
      {...restProps}
      value={value}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default Dropdown;
