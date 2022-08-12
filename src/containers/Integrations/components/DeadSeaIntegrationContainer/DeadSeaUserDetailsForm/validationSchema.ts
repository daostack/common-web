import * as Yup from "yup";
import { countryList } from "@/shared/assets/countries";
import { NAME_REGEXP } from "@/shared/constants";

const AVAILABLE_COUNTRIES = countryList.map((country) => country.value);

const schema = Yup.object().shape({
  firstName: Yup.string()
    .matches(NAME_REGEXP, "Only alphabets are allowed for this field")
    .required("Please enter your first name"),
  lastName: Yup.string()
    .matches(NAME_REGEXP, "Only alphabets are allowed for this field")
    .required("Please enter your last name"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  country: Yup.string()
    .oneOf(AVAILABLE_COUNTRIES)
    .required("Please select a country"),
});

export default schema;
