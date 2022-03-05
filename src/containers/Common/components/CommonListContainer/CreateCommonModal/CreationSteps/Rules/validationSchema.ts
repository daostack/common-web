import * as Yup from "yup";

import { MAX_RULE_TITLE_LENGTH } from "./constants";

const schema = Yup.object().shape({
  rules: Yup.array().of(
    Yup.object().shape(
      {
        title: Yup.string()
          .max(MAX_RULE_TITLE_LENGTH, "Entered title is too long")
          .when("value", (value: string) => {
            if (value)
              return Yup.string()
                .max(MAX_RULE_TITLE_LENGTH, "Entered title is too long")
                .required("Please enter rule title");
          }),
        value: Yup.string().when("title", (title: string) => {
          if (title)
            return Yup.string().required("Please enter rule description");
        }),
      },
      [["value", "title"]]
    )
  ),
});

export default schema;
