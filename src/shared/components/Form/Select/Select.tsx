import React, { FC } from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { RightArrowThinIcon } from "@/shared/icons";
import { SelectOptionType } from "@/shared/interfaces/Select";
import { selectorStyles } from "./selectorStyles";
import styles from "./Select.module.scss";

interface FormSelectProps {
  label: string;
  formName: string;
  placeholder: string;
  options: Record<string, unknown>[];
  containerClassName?: string;
  disabled?: boolean;
  isOptionDisabled?: (option: SelectOptionType) => boolean;
  menuPortalTarget?: HTMLElement | null;
}

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
  return (
    <components.DropdownIndicator {...props}>
      <RightArrowThinIcon className={styles.selectDropdownIcon} />
    </components.DropdownIndicator>
  );
};

const FormSelect: FC<FormSelectProps> = ({
  label,
  formName,
  placeholder,
  options,
  containerClassName,
  disabled,
  isOptionDisabled,
  menuPortalTarget,
}) => {
  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<Record<string, unknown>>();
  const hasError = Boolean(touched[formName] && errors[formName]);

  return (
    <div className={classNames(styles.container, containerClassName)}>
      <label className={styles.label}>{label}</label>
      <Select
        closeMenuOnSelect
        isDisabled={disabled}
        value={values?.[formName] as SelectOptionType}
        options={options as SelectOptionType[]}
        placeholder={placeholder}
        onChange={(selectedValue) => {
          setFieldValue(formName, selectedValue);
        }}
        onBlur={handleBlur(formName)}
        hideSelectedOptions={false}
        styles={selectorStyles(hasError)}
        components={{
          DropdownIndicator,
        }}
        menuPortalTarget={menuPortalTarget}
        isOptionDisabled={isOptionDisabled}
      />
    </div>
  );
};

export default FormSelect;
