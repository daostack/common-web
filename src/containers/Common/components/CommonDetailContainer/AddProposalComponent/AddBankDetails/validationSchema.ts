import * as Yup from "yup";

const schema = Yup.object().shape({
  idNumber: Yup.string().required("Please enter your ID number"),
  branchNumber: Yup.string().required("Please enter the branch number"),
  accountNumber: Yup.string().required("Please enter the account number"),
});

export default schema;
