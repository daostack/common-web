import React, { ChangeEventHandler, FC } from "react";
import { Country } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input/input";
import classNames from "classnames";
import RightArrowIcon from "../../../../icons/rightArrow.icon";
import { ButtonLink } from "../../../ButtonLink";
import { CountrySelectOption } from "../types";
import "./index.scss";

interface NativeSelectProps {
  className?: string;
  countryCode: Country;
  options: CountrySelectOption[];
  onChange: (countryCode: Country) => void;
}

const NativeSelect: FC<NativeSelectProps> = (props) => {
  const { className, countryCode, options, onChange } = props;

  const handleNativeSelectChange: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    onChange(event.target.value as Country);
  };

  return (
    <div className={classNames("custom-phone-input-native-select", className)}>
      <ButtonLink className="custom-phone-input-native-select__value">
        +{getCountryCallingCode(countryCode)}
        <RightArrowIcon className="custom-phone-input-native-select__arrow-icon" />
      </ButtonLink>
      <select
        id="phone-input"
        name="phone-input"
        className="custom-phone-input-native-select__select"
        value={countryCode}
        onChange={handleNativeSelectChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NativeSelect;
