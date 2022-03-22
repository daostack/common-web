import React, { useCallback, useMemo, useRef, useState } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption } from "@/shared/components";
import validationSchema from "./validationSchema";
import { ACCEPTED_EXTENSIONS, BANK_NAMES_OPTIONS } from "./constans";
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

enum File {
  PhotoID,
  BankLetter
}

export const AddBankDetails = ({ onBankDetails }: IProps) => {
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [photoIdFile, setPhotoIdFile] = useState<string | File | null>();
  const [bankLetterFile, setBankLetterFile] = useState<string | File | null>();

  const banksOptions = useMemo<DropdownOption[]>(
    () => BANK_NAMES_OPTIONS.map((item) => ({
      text: item.name,
      value: item.value,
    })), []);

  const selectFile = (event: any, fileType: File) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
    if (fileType === File.PhotoID) {
      setPhotoIdFile(file);
    } else {
      setBankLetterFile(file);
    }
  };

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
      <div className="add-bank-details-form">
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
        >
          {({ values, isValid }) => (
            <Form>
              <TextField
                className="field"
                id="idNumber"
                name="idNumber"
                label="ID Number"
                placeholder="Add your ID number"
                isRequired
              />
              <Dropdown
                className="field"
                name="bankName"
                label="Bank Name"
                placeholder="---Select bank---"
                options={banksOptions}
              />
              <TextField
                className="field"
                id="branchNumber"
                name="branchNumber"
                label="Branch Number"
                placeholder="Exp. 867"
                isRequired
              />
              <TextField
                className="field"
                id="accountNumber"
                name="accountNumber"
                label="Account Number"
                placeholder="Add your account number"
                isRequired
              />
              <div className="files-upload-wrapper">
                <label className="">
                  <input
                    type="file"
                    onChange={(e) => selectFile(e, File.PhotoID)}
                    accept={ACCEPTED_EXTENSIONS}
                  />
                  <img src="" alt="id file" />
                  Add photo ID
                </label>
                <label className="">
                  <input
                    type="file"
                    onChange={(e) => selectFile(e, File.BankLetter)}
                    accept={ACCEPTED_EXTENSIONS}
                  />
                  <img src="" alt="bank letter file" />
                  Add bank account letter
                </label>
              </div>
              <Button
                //onClick={}
                disabled={!isValid || !photoIdFile || !bankLetterFile}
                className="save-button">
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
