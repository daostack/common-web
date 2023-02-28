import * as Yup from "yup";
import {
  ProposalsTypes,
} from "@/shared/constants";
import { MAX_PROPOSAL_TITLE_LENGTH } from "./constants";

const schema = Yup.object().shape({
  title: Yup.string()
    .max(MAX_PROPOSAL_TITLE_LENGTH, "Entered title is too long")
    .required("This field is required"),
  proposalType: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }).required(),
  recipientInfo: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }).when("proposalType", {
    is: (proposalType) => proposalType.value === ProposalsTypes.FUNDS_ALLOCATION,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional()
  })
});

export default schema;
