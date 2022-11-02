import * as Yup from "yup";
import { URL_REGEXP, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import {
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
  MAX_ABOUT_LENGTH,
} from "../constants";

const schema = Yup.object().shape({
  commonName: Yup.string()
    .max(MAX_COMMON_NAME_LENGTH, "Entered common name is too long")
    .required("Please enter a common name"),
  tagline: Yup.string().max(MAX_TAGLINE_LENGTH, "Entered tagline is too long"),
  about: Yup.string()
    .max(MAX_ABOUT_LENGTH, "Entered text is too long")
    .required("Please enter a common description"),
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
                .matches(URL_REGEXP, "Please enter correct URL")
                .required("Please enter a link");
            }
          }),
        },
        [["title", "value"]],
      ),
    )
    .required("Please add at least 1 link")
    .min(1, "Please add at least 1 link"),
});

export default schema;
