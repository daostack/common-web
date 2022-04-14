import * as Yup from "yup";
import { NUMBERS_ONLY_REGEXP } from "@/shared/constants";
import { Gender, GENDER_OPTIONS } from "@/shared/models/Gender";

const schema = Yup.object().shape({
  idNumber: Yup.string()
    .required("Please enter your ID number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  gender: Yup.number()
    .oneOf(GENDER_OPTIONS.map((option) => option.value as Gender))
    .required("Please choose gender"),
  phoneNumber: Yup.string()
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed")
    .required("Please enter a phone number"),
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),
  bankCode: Yup.number().required("Please choose a bank"),
  branchNumber: Yup.string()
    .required("Please enter the branch number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  accountNumber: Yup.string()
    .required("Please enter the account number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  address: Yup.string().required("Please enter your address"),
  streetNumber: Yup.string()
    .required("Please enter the street number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  city: Yup.string().required("Please enter your city"),
});

export default schema;
