import * as Yup from "yup";
import { countryList } from "@/shared/assets/countries";

const AVAILABLE_COUNTRIES = countryList.map((country) => country.value);

const schema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  country: Yup.string()
    .oneOf(AVAILABLE_COUNTRIES)
    .required("Please select a country"),
  phoneNumber: Yup.string().phone(
    "Phone number must be in valid international Israeli format"
  ),
});

export default schema;
