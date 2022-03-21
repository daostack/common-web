import React, { useCallback, useMemo, useRef } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption } from "@/shared/components";
import validationSchema from "./validationSchema";
import { BANK_NAMES_OPTIONS } from "./constans";
import "./index.scss";

interface IProps {
  onBankDetails: () => void;
}

interface FormValues {
  idNumber: string;
  bankName: string;
  branchNumber: string;
  accountNumber: string;
  photoId: string | File | null;
  bankLetter: string | File | null;
}

const INITIAL_VALUES: FormValues = {
  idNumber: "",
  bankName: "",
  branchNumber: "",
  accountNumber: "",
  photoId: null,
  bankLetter: null,
}

export const AddBankDetails = ({ onBankDetails }: IProps) => {
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);

  const banksOptions = useMemo<DropdownOption[]>(
    () => BANK_NAMES_OPTIONS.map((item) => ({
      text: item.name,
      value: item.value,
    })), []);

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log(values);
    }, []);

  return (
    <div className="add-bank-details-wrapper">
      <div className="add-bank-details-title">Add Bank Account</div>
      <div className="add-bank-details-description">
        The following details are required inorder to transfer funds <br /> to
        you after your proposal is approved
      </div>
      <div className="add-bank-details-content">
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, isValid }) => (
            <Form>
              <TextField
                className=""
                id="idNumber"
                name="idNumber"
                label="ID Number"
                placeholder="Add your ID number"
                isRequired
              />
              <Dropdown
                className=""
                name="bankName"
                label="Bank Name"
                placeholder="---Select bank---"
                options={banksOptions}
              />
              <TextField
                className=""
                id="branchNumber"
                name="branchNumber"
                label="Branch Number"
                placeholder="Exp. 867"
                isRequired
              />
              <TextField
                className=""
                id="accountNumber"
                name="accountNumber"
                label="Account Number"
                placeholder="Add your account number"
                isRequired
              />
              <Button
                //onClick={}
                disabled={!isValid}>
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
