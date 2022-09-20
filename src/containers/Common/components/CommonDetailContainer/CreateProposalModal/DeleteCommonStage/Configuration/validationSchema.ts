import * as Yup from "yup";

const schema = Yup.object().shape({
  description: Yup.string().required("Please enter a description"),
  infoApproval: Yup.boolean().oneOf(
    [true],
    "You have to approve the info to continue"
  ),
});

export default schema;
