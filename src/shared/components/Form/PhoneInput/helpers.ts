import { Country } from "react-phone-number-input";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { INITIAL_COUNTRY_CODE } from "./constants";
import { CountrySelectOption } from "./types";

export const getCountryOption = (country: Country): CountrySelectOption => ({
  text: `${en[country]} (+${getCountryCallingCode(country)})`,
  value: country,
});

export const getCountryOptions = (): CountrySelectOption[] => [
  getCountryOption(INITIAL_COUNTRY_CODE),
  ...getCountries().reduce<CountrySelectOption[]>(
    (acc, country) =>
      country === INITIAL_COUNTRY_CODE
        ? acc
        : acc.concat(getCountryOption(country)),
    []
  ),
];
