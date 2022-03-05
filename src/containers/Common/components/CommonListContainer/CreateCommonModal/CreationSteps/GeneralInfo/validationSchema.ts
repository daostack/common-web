import * as Yup from "yup";

import {
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
  MAX_ABOUT_LENGTH,
  MAX_LINK_TITLE_LENGTH,
  HTTPS_URL_REGEXP,
} from "./constants";

const schema = Yup.object().shape({
  commonName: Yup.string()
    .max(MAX_COMMON_NAME_LENGTH, "Entered common name is too long")
    .required("Please enter a common name"),
  tagline: Yup.string().max(MAX_TAGLINE_LENGTH, "Entered tagline is too long"),
  about: Yup.string()
    .max(MAX_ABOUT_LENGTH, "Entered text is too long")
    .required("Please enter a common description"),
  links: Yup.array().of(
    Yup.object().shape(
      {
        title: Yup.string()
          .max(MAX_LINK_TITLE_LENGTH, "Entered title is too long")
          .when("value", (value: string) => {
            if (value)
              return Yup.string()
                .max(MAX_LINK_TITLE_LENGTH, "Entered title is too long")
                .required("Please enter link title");
          }),
        value: Yup.string()
          .matches(HTTPS_URL_REGEXP, "Please enter correct URL")
          .when("title", (title: string) => {
            if (title)
              return Yup.string()
                .matches(HTTPS_URL_REGEXP, "Please enter correct URL")
                .required("Please enter a link");
          }),
      },
      [["title", "value"]]
    )
  ),
});

export default schema;
