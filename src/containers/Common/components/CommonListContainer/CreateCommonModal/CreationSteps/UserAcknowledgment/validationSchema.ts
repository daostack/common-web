import * as Yup from "yup";

const schema = Yup.object().shape({
  // commonName: Yup.string()
  //   .max(MAX_COMMON_NAME_LENGTH, 'Entered common name is too long')
  //   .required('Please enter a common name'),
  // tagline: Yup.string()
  //   .max(MAX_TAGLINE_LENGTH, 'Entered tagline is too long'),
  // about: Yup.string()
  //   .max(MAX_ABOUT_LENGTH, 'Entered text is too long'),
  // links: Yup.array()
  //   .of(Yup.object().shape({
  //     title: Yup.string()
  //       .max(MAX_LINK_TITLE_LENGTH, 'Entered title is too long'),
  //     link: Yup.string(),
  //   }))
  //   .required('Please add at least 1 link')
  //   .min(1, 'Please add at least 1 link'),
});

export default schema;
