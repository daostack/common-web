import React, { useCallback, useState, FC } from "react";
import { Country, Value } from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import { isMobile } from "../../../utils";
import { ErrorText } from "../ErrorText";
import { CustomSelect } from "./CustomSelect";
import { NativeSelect } from "./NativeSelect";
import { INITIAL_COUNTRY_CODE } from "./constants";
import { getCountryOptions } from "./helpers";
import "./index.scss";

const COUNTRY_OPTIONS = getCountryOptions();

export type PhoneInputValue = Value | undefined;
export type PhoneInputCountryCode = Country;

interface PhoneInputProps {
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  error?: string;
  onCountryCodeChange?: (country: Country) => void;
  initialCountryCode?: Country;
}

const PhoneInput: FC<PhoneInputProps> = (props) => {
  const {
    value,
    onChange,
    error,
    onCountryCodeChange,
    initialCountryCode,
  } = props;
  const [countryCode, setCountryCode] = useState<Country>(
    initialCountryCode || INITIAL_COUNTRY_CODE
  );

  const handleCountryCodeChange = useCallback((country: Country) => {
    setCountryCode(country);

    if (onCountryCodeChange) {
      onCountryCodeChange(country);
    }
  }, [onCountryCodeChange]);

  const selectProps = {
    countryCode,
    className: "custom-phone-input__select",
    options: COUNTRY_OPTIONS,
    onChange: handleCountryCodeChange,
  };

  return (
    <div className="custom-phone-input">
      <div className="custom-phone-input__wrapper">
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
      {Boolean(error) && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default PhoneInput;
