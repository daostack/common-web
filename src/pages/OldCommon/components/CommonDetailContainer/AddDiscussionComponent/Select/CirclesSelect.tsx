import React, { ReactElement } from "react";
import Select, { MultiValue, StylesConfig, SingleValue } from "react-select";
import { ErrorText } from "@/shared/components/Form/ErrorText";
import { Colors } from "@/shared/constants";
import { SelectType } from "@/shared/interfaces/Select";
import { Circle } from "@/shared/models";
import { CircleSelectOption } from "./CircleSelectOption";
import "./index.scss";

export type CircleSelectType = SelectType<Circle>;

interface CirclesSelectProps {
  placeholder?: string;
  options: CircleSelectType[];
  handleChange: (
    data: MultiValue<CircleSelectType> | SingleValue<CircleSelectType>,
  ) => void;
  value: CircleSelectType | CircleSelectType[] | null;
  selectStyles?: StylesConfig<CircleSelectType>;
  error?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isOptionDisabled?: (option: CircleSelectType) => boolean;
}

export const CirclesSelect = ({
  options,
  handleChange,
  value,
  placeholder,
  error,
  onBlur,
  isOptionDisabled,
}: CirclesSelectProps): ReactElement => {
  return (
    <div className="circle-select">
      <p className="circle-select__limited-circles-title">
        Choose limited circles
      </p>
      <Select
        placeholder={placeholder}
        closeMenuOnSelect={false}
        isClearable
        isMulti
        value={value}
        options={options}
        noOptionsMessage={() => (
          <p className="circle-select__no-option-text">
            There are no circles to select
          </p>
        )}
        onChange={handleChange}
        onBlur={onBlur}
        hideSelectedOptions={false}
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 10000 }),
          menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
          control: (provided) => ({
            ...provided,
            ...(error && { borderColor: Colors.error }),
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: Colors.lightGray9,
          }),
        }}
        components={{ Option: CircleSelectOption }}
        isOptionDisabled={isOptionDisabled}
      />
      {Boolean(error) && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
