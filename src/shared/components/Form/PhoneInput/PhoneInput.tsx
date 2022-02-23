import React, { useCallback, useState, ChangeEventHandler, FC } from "react";
import { Country, Value } from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import { INITIAL_COUNTRY_CODE } from "./constants";
import { getCountryOptions } from "./helpers";
import "./index.scss";

const COUNTRY_OPTIONS = getCountryOptions();

export type PhoneInputProps = {};

const PhoneInput: FC<PhoneInputProps> = (props) => {
  const {} = props;
  const [countryCode, setCountryCode] = useState<Country>(INITIAL_COUNTRY_CODE);
  const [value, setValue] = useState<Value | undefined>();

  const handleSelectChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      setCountryCode(event.target.value as Country);
    },
    []
  );

  return (
    <div className="custom-phone-input">
      <select
        name="phone-input"
        id="phone-input"
        value={countryCode}
        onChange={handleSelectChange}
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <Input
        className="custom-phone-input__input"
        country={countryCode}
        international
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default PhoneInput;
