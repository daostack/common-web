import React, { FC } from "react";
import { Country } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input/input";
import classNames from "classnames";
import { Dropdown } from "../../../Dropdown";
import { CountrySelectOption } from "../types";
import "./index.scss";

interface CustomSelectProps {
  className?: string;
  countryCode: Country;
  options: CountrySelectOption[];
  onChange: (countryCode: Country) => void;
}

const CustomSelect: FC<CustomSelectProps> = (props) => {
  const { className, countryCode, options, onChange } = props;

  const handleSelect = (value: unknown) => {
    onChange(value as Country);
  };

  return (
    <Dropdown
      className={classNames("custom-phone-input-custom-select", className)}
      value={countryCode}
      options={options}
      onSelect={handleSelect}
      menuButtonText={`+${getCountryCallingCode(countryCode)}`}
      styles={{
        menuButton: "custom-phone-input-custom-select__menu-button",
        placeholder: "custom-phone-input-custom-select__placeholder",
        arrowIcon: "custom-phone-input-custom-select__arrow-icon",
        menu: "custom-phone-input-custom-select__menu",
        menuList: "custom-phone-input-custom-select__menu-list",
      }}
    />
  );
};

export default CustomSelect;
