import React, { useCallback, useMemo, useRef, useState } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import moment from "moment";
import { DatePicker } from "@/shared/components";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption, Loader } from "@/shared/components";
import { addBankDetails } from "@/containers/Common/store/actions";
import { uploadFile } from "@/shared/utils/firebaseUploadFile";
import {
  BankAccountDetails,
  PaymeTypeCodes,
} from "@/shared/interfaces/api/payMe";
import { countryList } from "@/shared/assets/countries";
import { FileUploadButton } from "../FileUploadButton";
import validationSchema from "./validationSchema";
import { BANKS_OPTIONS, Gender, GENDER_OPTIONS } from "./constans";
import "./index.scss";

interface IProps {
  onBankDetails: () => void;
}

interface FormValues {
  idNumber: string;
  socialIdIssueDate: Date;
  birthdate: Date;
  gender: Gender;
  phoneNumber: string;
  email: string;
  accountNumber: number | undefined;
  bankCode: number | undefined;
  branchNumber: number | undefined;
  address: string;
  streetNumber: number | undefined;
  city: string;
  country: string;
  photoId: string;
  bankLetter: string;
}

const INITIAL_VALUES: FormValues = {
  idNumber: "",
  socialIdIssueDate: new Date(),
  birthdate: new Date(),
  gender: Gender.None,
  phoneNumber: "",
  email: "",
  accountNumber: undefined,
  bankCode: undefined,
  branchNumber: undefined,
  address: "",
  streetNumber: undefined,
  city: "",
  country: "",
  photoId: "",
  bankLetter: "",
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const banksOptions = useMemo<DropdownOption[]>(
    () =>
      BANKS_OPTIONS.map((item) => ({
        text: item.name,
        value: item.value,
      })),
    []
  );

  const countriesOptions = useMemo<DropdownOption[]>(
    () =>
      countryList.map((item) => ({
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
    async (values) => {
      setSending(true);
      setError("");

      try {
        values.photoId = await uploadFile(
          `${values.idNumber}_photoId`,
          "public_img",
          photoIdFile!
        );
        values.bankLetter = await uploadFile(
          `${values.idNumber}_bankLetter`,
          "public_img",
          bankLetterFile!
        );
      } catch (error: any) {
        console.error(error);
        setError(error?.message ?? "Something went wrong :/");
        setSending(false);
        return;
      }

      const bankAccountDetails: BankAccountDetails = {
        bankName: BANKS_OPTIONS.find((bank) => bank.value === values.bankCode)
          ?.name!, // TODO: maybe save it while selecting?
        bankCode: values.bankCode!,
        branchNumber: Number(values.branchNumber!),
        accountNumber: Number(values.accountNumber!),
        identificationDocs: [
          {
            name: `${values.idNumber}_photoId`,
            legalType: PaymeTypeCodes["Social Id"],
            amount: 2000,
            mimeType: "image/jpg",
            downloadURL: values.photoId,
          },
          {
            name: `${values.idNumber}_bankLetter`,
            legalType: PaymeTypeCodes["Bank Account Ownership"],
            amount: 2000,
            mimeType: "image/jpg",
            downloadURL: values.bankLetter,
          },
        ],
        city: values.city,
        country: values.country,
        streetAddress: values.address,
        streetNumber: values.streetNumber!,
        socialId: values.idNumber,
        socialIdIssueDate: moment(new Date(values.socialIdIssueDate)).format(
          "dd/mm/yyyy"
        ),
        birthdate: moment(new Date(values.birthdate)).format("dd/mm/yyyy"),
        gender: values.gender,
        phoneNumber: values.phoneNumber!,
      };

      dispatch(
        addBankDetails.request({
          payload: { ...bankAccountDetails },
          callback: (error) => {
            setSending(false);
            if (error) {
              console.error(error);
              setError(error?.message ?? "Something went wrong :/");
              return;
            }
            onBankDetails();
          },
        })
      );
    },
    [dispatch, onBankDetails, bankLetterFile, photoIdFile]
  );

  return (
    <div className="add-bank-details-wrapper">
      <div className="add-bank-details-title">Add Bank Account</div>
      <div className="add-bank-details-description">
        The following details are required inorder to transfer funds <br /> to
        you after your proposal is approved
      </div>
      <div className="add-bank-details-form">
        {sending ? (
          <Loader />
        ) : (
          <Formik
            initialValues={INITIAL_VALUES}
            onSubmit={handleSubmit}
            innerRef={formRef}
            validationSchema={validationSchema}
          >
            {({ values, isValid, setFieldValue }) => (
              <Form>
                <h3>Personal Info</h3>
                <div className="section personal-info">
                  <TextField
                    className="field"
                    id="idNumber"
                    name="idNumber"
                    label="ID Number"
                    placeholder="Add your ID number"
                    isRequired
                    styles={{
                      label: "add-bank-details-form__label",
                    }}
                  />
                  <DatePicker
                    className="add-bank-details-form__date-picker"
                    name="socialIdIssueDate"
                    label="ID Issuance day"
                    selected={values.socialIdIssueDate}
                    onChange={(date) =>
                      setFieldValue("socialIdIssueDate", date)
                    }
                    styles={{
                      label: "add-bank-details-form__label",
                    }}
                  />
                  <DatePicker
                    className="add-bank-details-form__date-picker"
                    name="birthdate"
                    label="Birth Date"
                    selected={values.birthdate}
                    onChange={(date) => setFieldValue("birthdate", date)}
                    styles={{
                      label: "add-bank-details-form__label",
                    }}
                  />
                  <Dropdown
                    className="field"
                    name="gender"
                    label="Gender"
                    placeholder="---Select gender---"
                    options={GENDER_OPTIONS}
                    shouldBeFixed={false}
                  />
                </div>

                <h3>Contact Info</h3>
                <div className="section contact-info">
                  <TextField
                    className="field"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Add your phone number"
                    isRequired
                  />
                  <TextField
                    className="field"
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Add your email"
                    isRequired
                  />
                </div>

                <h3>Bank Details</h3>
                <div className="section bank-details">
                  <Dropdown
                    className="field"
                    name="bankCode"
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
                </div>

                <h3>Billing Details</h3>
                <div className="section billing-details">
                  <TextField
                    className="field"
                    id="address"
                    name="address"
                    label="Address"
                    placeholder="Add your address"
                    isRequired
                  />
                  <TextField
                    className="field"
                    id="streetNumber"
                    name="streetNumber"
                    label="Street Number"
                    placeholder="Add your street number"
                    isRequired
                  />
                  <TextField
                    className="field"
                    id="city"
                    name="city"
                    label="City"
                    placeholder="Add city"
                    isRequired
                  />
                  <Dropdown
                    className="field"
                    name="country"
                    label="Country/Region"
                    placeholder="---Select country---"
                    options={countriesOptions}
                    shouldBeFixed={false}
                  />
                </div>

                <div className="files-upload-wrapper">
                  <FileUploadButton
                    className="files-upload-wrapper__upload-button add-photo-id"
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
                    hint="The form can be found on the bank's website"
                    logo="/icons/add-proposal/add-bank-account-letter.svg"
                    logoUploaded="/icons/add-proposal/add-bank-account-letter-done.svg"
                    alt="Bank letter file"
                    onUpload={(file) => selectFile(file, FileType.BankLetter)}
                    onDelete={handleBankLetterDelete}
                  />
                </div>
                <Button
                  onClick={() => handleSubmit}
                  disabled={!isValid || !photoIdFile || !bankLetterFile}
                  className="save-button"
                >
                  Save
                </Button>
                {error && <div className="error">{error}</div>}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};
