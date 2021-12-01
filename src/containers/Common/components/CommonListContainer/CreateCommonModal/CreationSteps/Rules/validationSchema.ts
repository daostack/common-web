import * as Yup from "yup";

import { MAX_RULE_TITLE_LENGTH } from "./constants";

const schema = Yup.object().shape({
  rules: Yup.array()
    .of(Yup.object().shape({
      title: Yup.string()
        .max(MAX_RULE_TITLE_LENGTH, "Entered title is too long")
        .required("Please enter rule title"),
      description: Yup.string()
        .required("Please enter rule description"),
    }))
    .required("Please add at least 1 rule")
    .min(1, "Please add at least 1 rule"),
});

export default schema;
