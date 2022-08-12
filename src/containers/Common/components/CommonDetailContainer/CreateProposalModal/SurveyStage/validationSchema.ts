import * as yup from "yup";
import { formatPrice } from "@/shared/utils";
import { SURVEY_PROPOSAL_TITLE_LENGTH } from "./constants";

export const surveyValidationSchema = yup.object().shape({
  title: yup.string()
    .max(SURVEY_PROPOSAL_TITLE_LENGTH, "Entered title is too long")
    .required("Please enter proposal title"),
  description: yup.string().required("Please enter proposal description"),
  areImagesLoading: yup.boolean().oneOf([false]),
});
