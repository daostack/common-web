import React, { useCallback, useMemo, useRef, useState } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption } from "@/shared/components";
import { FileUploadButton } from "../FileUploadButton";
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
};

enum FileType {
  PhotoID,
  BankLetter,
}

export const AddBankDetails = ({ onBankDetails }: IProps) => {
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [bankLetterFile, setBankLetterFile] = useState<File | null>(null);

  const banksOptions = useMemo<DropdownOption[]>(
    () =>
      BANK_NAMES_OPTIONS.map((item) => ({
        text: item.name,
        value: item.value,
      })),
    []
  );

  const selectFile = (file: File, fileType: FileType) => {
    if (fileType === FileType.PhotoID) {
      setPhotoIdFile(file);
    } else {
      setBankLetterFile(file);
    }
  };
  const handlePhotoIDDelete = () => {
    setPhotoIdFile(null);
  };
  const handleBankLetterDelete = () => {
    setBankLetterFile(null);
  };

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log(values);
    },
    []
  );

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
                shouldBeFixed={false}
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
                <FileUploadButton
                  className="files-upload-wrapper__upload-button"
                  file={photoIdFile}
                  text="Add photo ID"
                  logo="/icons/add-proposal/add-photo-id.svg"
                  logoUploaded="/icons/add-proposal/add-photo-id-done.svg"
                  alt="ID file"
                  onUpload={(file) => selectFile(file, FileType.PhotoID)}
                  onDelete={handlePhotoIDDelete}
                />
                <FileUploadButton
                  className="files-upload-wrapper__upload-button"
                  file={bankLetterFile}
                  text="Add bank account letter"
                  hint="The form can be found on the bank’s website"
                  logo="/icons/add-proposal/add-bank-account-letter.svg"
                  logoUploaded="/icons/add-proposal/add-bank-account-letter-done.svg"
                  alt="Bank letter file"
                  onUpload={(file) => selectFile(file, FileType.BankLetter)}
                  onDelete={handleBankLetterDelete}
                />
              </div>
              <Button
                //onClick={}
                disabled={!isValid || !photoIdFile || !bankLetterFile}
                className="save-button"
              >
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
