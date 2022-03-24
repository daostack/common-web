import * as Yup from "yup";
import { HTTPS_URL_REGEXP, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";

export const introduceStageSchema = Yup.object().shape({
  intro: Yup.string().required("Please enter something about yourself"),
  links: Yup.array()
    .of(
      Yup.object().shape(
        {
          title: Yup.string().when("value", (value: string) => {
            if (value) {
              return Yup.string()
                .max(MAX_LINK_TITLE_LENGTH, "Entered title is too long")
                .required("Please enter link title");
            }
          }),
          value: Yup.string().when("title", (title: string) => {
            if (title) {
              return Yup.string()
                .matches(HTTPS_URL_REGEXP, "Please enter correct URL")
                .required("Please enter a link");
            }
          }),
        },
        [["title", "value"]]
      )
    )
    .required("Please add at least 1 link")
    .min(1, "Please add at least 1 link"),
});
