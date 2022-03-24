import * as Yup from "yup";

const schema = Yup.object().shape({
  idNumber: Yup.string().required("Please enter your ID number"),
  gender: Yup.number().required("Please choose gender"),
  phoneNumber: Yup.string().required("Please etner a phone number"),
  email: Yup.string().required("Please enter your email"),
  bankCode: Yup.number().required("Please choose a bank"),
  branchNumber: Yup.number().required("Please enter the branch number"),
  accountNumber: Yup.number().required("Please enter the account number"),
  address: Yup.string().required("Please enter your address"),
  streetNumber: Yup.number().required("Please enter the street number"),
  city: Yup.string().required("Please enter your city"),
});

export default schema;
