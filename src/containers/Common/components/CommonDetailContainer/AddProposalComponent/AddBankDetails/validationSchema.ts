import * as Yup from "yup";

const schema = Yup.object().shape({
  idNumber: Yup.string().required("Please enter your ID number"),
  bankCode: Yup.number().required("Please choose a bank"),
  branchNumber: Yup.number().required("Please enter the branch number"),
  accountNumber: Yup.number().required("Please enter the account number"),
});

export default schema;
