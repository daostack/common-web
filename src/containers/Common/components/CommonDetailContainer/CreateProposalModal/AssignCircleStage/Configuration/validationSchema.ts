import * as Yup from "yup";

const schema = Yup.object().shape({
  description: Yup.string().required("Please enter a description"),
});

export default schema;
