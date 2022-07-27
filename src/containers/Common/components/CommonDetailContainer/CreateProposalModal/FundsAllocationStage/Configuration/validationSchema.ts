import * as Yup from "yup";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "./constants";

export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH, "Entered title is too long")
    .required("Please enter proposal title"),
  description: Yup.string().required("Please enter proposal description"),
  goalOfPayment: Yup.string().required("Please enter goal of payment"),
});
