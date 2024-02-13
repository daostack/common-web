import React, { useCallback, FC } from "react";
import { useField } from "formik";
import {
  Dropdown as BaseDropdown,
  DropdownProps as BaseDropdownProps,
} from "../../../Dropdown";

type DropdownProps = Omit<BaseDropdownProps, "value" | "onSelect"> & {
  name: string;
  onSelect?: (value: unknown) => void;
};

const Dropdown: FC<DropdownProps> = (props) => {
  const { name, onSelect, ...restProps } = props;
  const [{ value }, , { setTouched, setValue }] = useField(name);

  const handleSelect = useCallback(
    (newValue: unknown) => {
      setValue(newValue);
      setTouched(true);
      onSelect && onSelect(newValue);
    },
    [setTouched, setValue],
  );

  return <BaseDropdown {...restProps} value={value} onSelect={handleSelect} />;
};

export default Dropdown;
