import React, { useState, FC } from "react";
import { Country, Value } from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import { NativeSelect } from "./NativeSelect";
import { INITIAL_COUNTRY_CODE } from "./constants";
import { getCountryOptions } from "./helpers";
import "./index.scss";

const COUNTRY_OPTIONS = getCountryOptions();

export type PhoneInputProps = {};

const PhoneInput: FC<PhoneInputProps> = (props) => {
  const {} = props;
  const [countryCode, setCountryCode] = useState<Country>(INITIAL_COUNTRY_CODE);
  const [value, setValue] = useState<Value | undefined>();

  return (
    <div className="custom-phone-input">
      <NativeSelect
        countryCode={countryCode}
        options={COUNTRY_OPTIONS}
        onChange={setCountryCode}
      />
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
