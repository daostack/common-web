import React, { useCallback, useMemo, useRef, useState } from "react";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { useDispatch } from "react-redux";
import moment from "moment";
import classNames from "classnames";
import { DatePicker, FilePreview } from "@/shared/components";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import { Button, DropdownOption, Loader } from "@/shared/components";
import {
  addBankDetails,
  updateBankDetails,
} from "@/containers/Common/store/actions";
import { UpdateBankAccountDetailsData } from "@/shared/interfaces/api/bankAccount";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  PaymeTypeCodes,
  isPaymeDocument,
  PaymeDocument,
} from "@/shared/interfaces/api/payMe";
import { countryList } from "@/shared/assets/countries";
import { BankAccountDetails, DateFormat } from "@/shared/models";
import { formatDate } from "@/shared/utils";
import { BANKS_OPTIONS } from "@/shared/assets/banks";
import { FileUploadButton } from "../FileUploadButton";
import validationSchema, {
  validationSchemaForEditing,
} from "./validationSchema";
import { Gender, GENDER_OPTIONS } from "@/shared/models/Gender";
import "./index.scss";

interface IProps {
  className?: string;
  descriptionClassName?: string;
  title?: string | null;
  onBankDetails: (data: BankAccountDetails) => void;
  initialBankAccountDetails?: BankAccountDetails | null;
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

const getInitialValues = (data?: BankAccountDetails | null): FormValues => {
  if (!data) {
    return INITIAL_VALUES;
  }

  return {
    idNumber: data.socialId,
    socialIdIssueDate: moment(
      data.socialIdIssueDate,
      DateFormat.ShortSecondary
    ).toDate(),
    birthdate: moment(data.birthdate, DateFormat.ShortSecondary).toDate(),
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    email: "",
    accountNumber: data.accountNumber,
    bankCode: data.bankCode,
    branchNumber: data.branchNumber,
    address: data.streetAddress,
    streetNumber: data.streetNumber,
    city: data.city,
    country: data.country,
    photoId: "",
    bankLetter: "",
  };
};

export const AddBankDetails = (props: IProps) => {
  const {
    className,
    descriptionClassName,
    title,
    onBankDetails,
    initialBankAccountDetails,
  } = props;
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [photoIdFile, setPhotoIdFile] = useState<File | PaymeDocument | null>(
    () =>
      initialBankAccountDetails?.identificationDocs.find(
        (doc) => doc.legalType === PaymeTypeCodes.SocialId
      ) || null
  );
  const [bankLetterFile, setBankLetterFile] = useState<
    File | PaymeDocument | null
  >(
    initialBankAccountDetails?.identificationDocs.find(
      (doc) => doc.legalType === PaymeTypeCodes.BankAccountOwnership
    ) || null
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(initialBankAccountDetails);

  const banksOptions = useMemo<DropdownOption[]>(
    () =>
      BANKS_OPTIONS.map((item) => ({
        text: `${item.name} (${item.value})`,
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

  const handleDataChange = useCallback(
    (error: Error | null, data?: BankAccountDetails) => {
      setSending(false);

      if (error || !data) {
        console.error(error);
        setError(error?.message ?? "Something went wrong :/");
        return;
      }

      onBankDetails(data);
    },
    [onBankDetails]
  );

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    async (values) => {
      if (!photoIdFile || !bankLetterFile) {
        return;
      }

      setSending(true);
      setError("");

      const photoIdFileName = getFileNameForUploading(photoIdFile.name);
      const bankLetterFileName = getFileNameForUploading(bankLetterFile.name);

      try {
        values.photoId = isPaymeDocument(photoIdFile)
          ? photoIdFile.downloadURL
          : await uploadFile(photoIdFileName, "private", photoIdFile);
        values.bankLetter = isPaymeDocument(bankLetterFile)
          ? bankLetterFile.downloadURL
          : await uploadFile(bankLetterFileName, "private", bankLetterFile);
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
          isPaymeDocument(photoIdFile)
            ? { ...photoIdFile }
            : {
                name: photoIdFileName,
                legalType: PaymeTypeCodes.SocialId,
                amount: 2000,
                mimeType: photoIdFile.type,
                downloadURL: values.photoId,
              },
          isPaymeDocument(bankLetterFile)
            ? { ...bankLetterFile }
            : {
                name: bankLetterFileName,
                legalType: PaymeTypeCodes.BankAccountOwnership,
                amount: 2000,
                mimeType: bankLetterFile.type,
                downloadURL: values.bankLetter,
              },
        ],
        city: values.city,
        country: values.country,
        streetAddress: values.address,
        streetNumber: values.streetNumber!,
        socialId: values.idNumber,
        socialIdIssueDate: formatDate(
          values.socialIdIssueDate,
          DateFormat.ShortSecondary
        ),
        birthdate: formatDate(values.birthdate, DateFormat.ShortSecondary),
        gender: values.gender,
        phoneNumber: values.phoneNumber!,
      };

      dispatch(
        addBankDetails.request({
          payload: bankAccountDetails,
          callback: handleDataChange,
        })
      );
    },
    [dispatch, bankLetterFile, photoIdFile, handleDataChange]
  );

  const handleDetailsUpdate = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      const bankName = BANKS_OPTIONS.find(
        (bank) => bank.value === values.bankCode
      )?.name;

      if (!bankName) {
        return;
      }

      setSending(true);
      setError("");

      const payload: Partial<UpdateBankAccountDetailsData> = {
        bankName,
        idNumber: values.idNumber,
        bankCode: values.bankCode,
        branchNumber: values.branchNumber,
        accountNumber: values.accountNumber,
      };

      dispatch(
        updateBankDetails.request({
          payload,
          callback: handleDataChange,
        })
      );
    },
    [dispatch, handleDataChange]
  );

  return (
    <div className={classNames("add-bank-details-wrapper", className)}>
      {title !== null && (
        <div className="add-bank-details-title">
          {title || `${isEditing ? "Edit" : "Add"} Bank Account`}
        </div>
      )}
      <div
        className={classNames(
          "add-bank-details-description",
          descriptionClassName
        )}
      >
        The following details are required inorder to transfer funds{" "}
        {!descriptionClassName && <br />}to you after your proposal is approved
      </div>
      <div className="add-bank-details-form">
        {sending ? (
          <div>
            <Loader />
          </div>
        ) : (
          <Formik
            initialValues={getInitialValues(initialBankAccountDetails)}
            onSubmit={isEditing ? handleDetailsUpdate : handleSubmit}
            innerRef={formRef}
            validationSchema={
              isEditing ? validationSchemaForEditing : validationSchema
            }
            validateOnMount
          >
            {({ values, isValid, setFieldValue }) => {
              const isSubmitButtonDisabled = isEditing
                ? !isValid
                : !isValid || !photoIdFile || !bankLetterFile;

              return (
                <Form className="add-bank-details-form__form">
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
                    {!isEditing && (
                      <>
                        <DatePicker
                          className="add-bank-details-form__date-picker"
                          name="socialIdIssueDate"
                          label="ID Issuance day"
                          selected={values.socialIdIssueDate}
                          maxDate={moment().toDate()}
                          onChange={(date) =>
                            setFieldValue("socialIdIssueDate", date)
                          }
                          showMonthDropdown
                          showYearDropdown
                          adjustDateOnChange
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
                        />
                        <DatePicker
                          className="add-bank-details-form__date-picker"
                          name="birthdate"
                          label="Birth Date"
                          selected={values.birthdate}
                          maxDate={moment().toDate()}
                          onChange={(date) => setFieldValue("birthdate", date)}
                          showMonthDropdown
                          showYearDropdown
                          adjustDateOnChange
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
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <>
                      <h3>Contact Info</h3>
                      <div className="section contact-info">
                        <TextField
                          className="field"
                          id="phoneNumber"
                          name="phoneNumber"
                          label="Phone Number"
                          placeholder="Add your phone number"
                          isRequired
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
                        />
                        <TextField
                          className="field"
                          id="email"
                          name="email"
                          label="Email"
                          placeholder="Add your email"
                          isRequired
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
                        />
                      </div>
                    </>
                  )}

                  <h3>Bank Details</h3>
                  <div className="section bank-details">
                    <TextField
                      className="field"
                      id="accountNumber"
                      name="accountNumber"
                      label="Bank Account number"
                      placeholder="Add your account number"
                      isRequired
                      styles={{
                        label: "add-bank-details-form__label",
                      }}
                    />
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
                      styles={{
                        label: "add-bank-details-form__label",
                      }}
                    />
                  </div>

                  {!isEditing && (
                    <>
                      <h3>Billing Details</h3>
                      <div className="section billing-details">
                        <TextField
                          className="field"
                          id="address"
                          name="address"
                          label="Address"
                          placeholder="Add your address"
                          isRequired
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
                        />
                        <TextField
                          className="field"
                          id="streetNumber"
                          name="streetNumber"
                          label="Street Number"
                          placeholder="Add your street number"
                          isRequired
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
                        />
                        <TextField
                          className="field"
                          id="city"
                          name="city"
                          label="City"
                          placeholder="Add city"
                          isRequired
                          styles={{
                            label: "add-bank-details-form__label",
                          }}
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
                          onUpload={(file) =>
                            selectFile(file, FileType.PhotoID)
                          }
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
                          onUpload={(file) =>
                            selectFile(file, FileType.BankLetter)
                          }
                          onDelete={handleBankLetterDelete}
                        />
                      </div>
                    </>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitButtonDisabled}
                    className="save-button"
                  >
                    Save
                  </Button>
                  {error && <div className="error">{error}</div>}
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
};
