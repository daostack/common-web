import * as Yup from "yup";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { FORM_ERROR_MESSAGES } from "@/shared/constants";

const schema = Yup.object().shape({
  name: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  commonTitle: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  description: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  residence: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  email: Yup.string()
    .email(FORM_ERROR_MESSAGES.EMAIL)
    .required(FORM_ERROR_MESSAGES.REQUIRED),
  phoneNumber: Yup.string()
    .required(FORM_ERROR_MESSAGES.REQUIRED)
    .test("isValidPhoneNumber", FORM_ERROR_MESSAGES.PHONE_NUMBER, (data = "") =>
      isPossiblePhoneNumber(data)
    ),
});

export default schema;
