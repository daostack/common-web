import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter correct email")
    .required("Please enter email"),
  password: Yup.string().required("Please enter password"),
});

export default schema;
