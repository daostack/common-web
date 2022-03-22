import React, { useCallback, useMemo, useRef, useState } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption } from "@/shared/components";
import { FileInfo } from "../FileInfo";
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

  const selectFile = (event: any, fileType: FileType) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
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
                <label
                  className={classNames("files-upload-wrapper__upload-button", {
                    "files-upload-wrapper__upload-button--between": photoIdFile,
                  })}
                >
                  <img
                    className="files-upload-wrapper__icon"
                    src={`/icons/add-proposal/add-photo-id${
                      photoIdFile ? "-done" : ""
                    }.svg`}
                    alt="id file"
                  />
                  {photoIdFile ? (
                    <FileInfo
                      file={photoIdFile}
                      onDelete={handlePhotoIDDelete}
                    />
                  ) : (
                    "Add photo ID"
                  )}
                  <input
                    className="files-upload-wrapper__file-input"
                    type="file"
                    onChange={(e) => selectFile(e, FileType.PhotoID)}
                    accept={ACCEPTED_EXTENSIONS}
                  />
                </label>
                <label
                  className={classNames("files-upload-wrapper__upload-button", {
                    "files-upload-wrapper__upload-button--between": bankLetterFile,
                  })}
                >
                  <img
                    className="files-upload-wrapper__icon"
                    src={`/icons/add-proposal/add-bank-account-letter${
                      bankLetterFile ? "-done" : ""
                    }.svg`}
                    alt="bank letter file"
                  />
                  {bankLetterFile ? (
                    <FileInfo
                      file={bankLetterFile}
                      onDelete={handleBankLetterDelete}
                    />
                  ) : (
                    <>
                      Add bank account letter
                      <span className="files-upload-wrapper__button-hint">
                        The form can be found on the bank’s website
                      </span>
                    </>
                  )}
                  <input
                    className="files-upload-wrapper__file-input"
                    type="file"
                    onChange={(e) => selectFile(e, FileType.BankLetter)}
                    accept={ACCEPTED_EXTENSIONS}
                  />
                </label>
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
