import * as Yup from "yup";
import { MAX_DISCUSSION_TITLE_LENGTH } from "./constants";

const schema = Yup.object().shape({
  title: Yup.string()
    .max(MAX_DISCUSSION_TITLE_LENGTH, "Entered title is too long")
    .required("This field is required"),
});

export default schema;
