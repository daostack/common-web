import React, { useState, FC } from "react";
import { Country, Value } from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import { isMobile } from "../../../utils";
import { CustomSelect } from "./CustomSelect";
import { NativeSelect } from "./NativeSelect";
import { INITIAL_COUNTRY_CODE } from "./constants";
import { getCountryOptions } from "./helpers";
import "./index.scss";

const COUNTRY_OPTIONS = getCountryOptions();

export type PhoneInputValue = Value | undefined;

interface PhoneInputProps {
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
}

const PhoneInput: FC<PhoneInputProps> = (props) => {
  const { value, onChange } = props;
  const [countryCode, setCountryCode] = useState<Country>(INITIAL_COUNTRY_CODE);
  const selectProps = {
    countryCode,
    className: "custom-phone-input__select",
    options: COUNTRY_OPTIONS,
    onChange: setCountryCode,
  };

  return (
    <div className="custom-phone-input">
      {isMobile() ? (
        <NativeSelect {...selectProps} />
      ) : (
        <CustomSelect {...selectProps} />
      )}
      <Input
        className="custom-phone-input__input"
        country={countryCode}
        international
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default PhoneInput;
