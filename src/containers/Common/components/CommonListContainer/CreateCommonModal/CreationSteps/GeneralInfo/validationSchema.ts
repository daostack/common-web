import * as Yup from "yup";

import {
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
  MAX_ABOUT_LENGTH,
} from "./constants";

const schema = Yup.object().shape({
  commonName: Yup.string()
    .max(MAX_COMMON_NAME_LENGTH, 'Entered common name is too long')
    .required('Please enter a common name'),
  tagline: Yup.string()
    .max(MAX_TAGLINE_LENGTH, 'Entered tagline is too long'),
  about: Yup.string()
    .max(MAX_ABOUT_LENGTH, 'Entered text is too long'),
});

export default schema;
