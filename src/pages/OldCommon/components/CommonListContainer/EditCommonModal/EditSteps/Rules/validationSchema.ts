import * as Yup from "yup";
import { BaseRule } from "@/shared/models";
import {
  MAX_RULE_TITLE_LENGTH,
  MAX_RULE_DESCRIPTION_LENGTH,
} from "./constants";

const schema = Yup.object().shape({
  rules: Yup.array()
    .of(
      Yup.object().shape<BaseRule>(
        {
          title: Yup.string().when("definition", (definition: string) => {
            if (definition) {
              return Yup.string()
                .max(MAX_RULE_TITLE_LENGTH, "Entered title is too long")
                .required("Please enter rule title");
            }
          }),
          definition: Yup.string().when("title", (title: string) => {
            if (title) {
              return Yup.string()
                .max(
                  MAX_RULE_DESCRIPTION_LENGTH,
                  "Entered description is too long",
                )
                .required("Please enter rule description");
            }
          }),
        },
        [["definition", "title"]],
      ),
    )
    .test(
      "isCorrectLength",
      "Please enter at least 1 rule",
      (data?: BaseRule[]) =>
        Boolean(
          data &&
            data.length > 0 &&
            data.some((item) => item.title && item.definition),
        ),
    ),
});

export default schema;
