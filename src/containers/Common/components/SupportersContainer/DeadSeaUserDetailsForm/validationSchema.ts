import * as Yup from "yup";
import i18n from "@/i18n";
import { countryList } from "@/shared/assets/countries";

const AVAILABLE_COUNTRIES = countryList.map((country) => country.value);

export const getValidationSchema = (): Yup.ObjectSchema => {
  const requiredText = i18n.t("form.errors.required");

  return Yup.object().shape({
    firstName: Yup.string().required(requiredText),
    lastName: Yup.string().required(requiredText),
    email: Yup.string()
      .email(i18n.t("form.errors.invalidEmail"))
      .required(requiredText),
    country: Yup.string().oneOf(AVAILABLE_COUNTRIES).required(requiredText),
    phoneNumber: Yup.string().phone(i18n.t("form.errors.invalidPhoneNumber")),
  });
};
