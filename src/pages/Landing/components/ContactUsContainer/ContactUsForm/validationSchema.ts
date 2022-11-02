import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import i18n from "@/i18n";

export const getValidationSchema = (): Yup.ObjectSchema => {
  const requiredText = i18n.t("form.errors.required");

  return Yup.object().shape({
    name: Yup.string().required(requiredText),
    commonTitle: Yup.string().required(requiredText),
    description: Yup.string().required(requiredText),
    residence: Yup.string().required(requiredText),
    email: Yup.string()
      .email(i18n.t("form.errors.invalidEmail"))
      .required(requiredText),
    phoneNumber: Yup.string()
      .required(requiredText)
      .test(
        "isValidPhoneNumber",
        i18n.t("form.errors.invalidPhoneNumber"),
        (data = "") => isPossiblePhoneNumber(data),
      ),
  });
};
