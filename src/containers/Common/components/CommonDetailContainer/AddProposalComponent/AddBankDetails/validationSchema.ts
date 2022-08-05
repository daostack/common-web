import * as Yup from "yup";
import {
  AVAILABLE_COUNTRIES,
  NAME_REGEXP,
  NUMBERS_ONLY_REGEXP,
} from "@/shared/constants";
import { Gender, GENDER_OPTIONS } from "@/shared/models/Gender";

const schema = Yup.object().shape({
  idNumber: Yup.string()
    .required("Please enter your ID number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed")
    .length(9, "Social ID should have 9 digits"),
  bankCode: Yup.number().required("Please choose a bank"),
  branchNumber: Yup.string()
    .required("Please enter the branch number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  accountNumber: Yup.string()
    .required("Please enter the account number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  gender: Yup.number()
    .oneOf(GENDER_OPTIONS.map((option) => option.value as Gender))
    .required("Please choose gender"),
  phoneNumber: Yup.string()
    .phone("Phone number must be in valid international Israeli format")
    .required("Please enter a phone number"),
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),
  address: Yup.string().required("Please enter your address"),
  streetNumber: Yup.string()
    .required("Please enter the street number")
    .matches(NUMBERS_ONLY_REGEXP, "Only numbers allowed"),
  city: Yup.string().required("Please enter your city"),
  country: Yup.string()
    .oneOf(AVAILABLE_COUNTRIES)
    .required("Please select a country"),
  firstName: Yup.string()
    .matches(NAME_REGEXP, "Only alphabets are allowed for this field")
    .required("Please enter your first name"),
  lastName: Yup.string()
    .matches(NAME_REGEXP, "Only alphabets are allowed for this field")
    .required("Please enter your last name"),
  socialIdIssueDate: Yup.date().required("Please select a date"),
  birthdate: Yup.date().required("Please select a date"),
});

export default schema;
