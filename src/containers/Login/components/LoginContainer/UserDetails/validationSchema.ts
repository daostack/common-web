import * as Yup from "yup";
import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";

export const validationSchema = Yup.object({
  firstName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  lastName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  email: Yup.string()
    .required(FORM_ERROR_MESSAGES.EMAIL)
    .email(FORM_ERROR_MESSAGES.EMAIL),
});
