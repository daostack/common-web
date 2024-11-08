import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import moment from "moment";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  addBankDetails,
  updateBankDetails,
} from "@/pages/OldCommon/store/actions";
import { isRequestError } from "@/services/Api";
import { BANKS_OPTIONS } from "@/shared/assets/banks";
import { countryList } from "@/shared/assets/countries";
import {
  DatePicker,
  DropdownOption,
  FilePreview,
  Loader,
} from "@/shared/components";
import { Dropdown, TextField } from "@/shared/components/Form/Formik";
import {
  AVAILABLE_COUNTRIES,
  CountryCode,
  ErrorCode,
} from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  PaymeTypeCodes,
  isPaymeDocument,
  PaymeDocument,
} from "@/shared/interfaces/api/payMe";
import { BankAccountDetails, DateFormat, User } from "@/shared/models";
import { Gender, GENDER_OPTIONS } from "@/shared/models/Gender";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { formatDate } from "@/shared/utils";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import { FileUploadButton } from "../FileUploadButton";
import validationSchema from "./validationSchema";
import "./index.scss";

interface IProps {
  className?: string;
  descriptionClassName?: string;
  title?: string | null;
  onBankDetails: (data: BankAccountDetails) => void;
  onBankDetailsAfterError?: (data: BankAccountDetails) => void;
  initialBankAccountDetails?: BankAccountDetails | null;
  onCancel?: () => void;
}

interface FormValues {
  idNumber: string;
  socialIdIssueDate: Date;
  birthdate: Date;
  gender?: Gender;
  firstName: string;
  lastName: string;
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
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  accountNumber: undefined,
  bankCode: undefined,
  branchNumber: undefined,
  address: "",
  streetNumber: undefined,
  city: "",
  country: AVAILABLE_COUNTRIES.length === 1 ? AVAILABLE_COUNTRIES[0] : "",
  photoId: "",
  bankLetter: "",
};

enum FileType {
  PhotoID,
  BankLetter,
}

const getInitialValues = (
  data?: BankAccountDetails | null,
  user?: User | null,
): FormValues => {
  if (!data) {
    return {
      ...INITIAL_VALUES,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    };
  }

  return {
    idNumber: data.socialId,
    socialIdIssueDate: moment(
      data.socialIdIssueDate,
      DateFormat.ShortSecondary,
    ).toDate(),
    birthdate: moment(data.birthdate, DateFormat.ShortSecondary).toDate(),
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    email: data.email || "",
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
    onBankDetailsAfterError,
    initialBankAccountDetails,
    onCancel,
  } = props;
  const { notify } = useNotification();
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const user = useSelector(selectUser());
  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    getInitialValues(initialBankAccountDetails, user),
  );
  const [photoIdFile, setPhotoIdFile] = useState<File | PaymeDocument | null>(
    () =>
      initialBankAccountDetails?.identificationDocs.find(
        (doc) => doc.legalType === PaymeTypeCodes.SocialId,
      ) || null,
  );
  const [bankLetterFile, setBankLetterFile] = useState<
    File | PaymeDocument | null
  >(
    initialBankAccountDetails?.identificationDocs.find(
      (doc) => doc.legalType === PaymeTypeCodes.BankAccountOwnership,
    ) || null,
  );
  const [reviewingDoc, setReviewingDoc] = useState<File | PaymeDocument | null>(
    null,
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
    [],
  );

  const countriesOptions = useMemo<DropdownOption[]>(
    () =>
      countryList
        .filter((item) =>
          AVAILABLE_COUNTRIES.includes(item.value as CountryCode),
        )
        .map((item) => ({
          text: item.name,
          value: item.value,
        })),
    [],
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

  const handleUploadedFileClick = (file: File | PaymeDocument) => {
    setReviewingDoc(file);
  };
  const handleFilePreviewClose = () => {
    setReviewingDoc(null);
  };

  const handleDataChange = useCallback(
    (error: Error | null, data?: BankAccountDetails) => {
      setSending(false);

      if (!error && data) {
        onBankDetails(data);
        notify(`Bank details ${isEditing ? "updated" : "added"} successfully`);
        return;
      }

      console.error(error);

      if (!error || !isRequestError(error)) {
        setError(error?.message ?? "Something went wrong :/");
        return;
      }

      const errorCode = error.response?.data?.errorCode;
      const { errorDescription, bankAccountDetails } =
        error.response?.data?.data || {};
      let errorMessage = "Something went wrong :/";

      if (errorCode === ErrorCode.InvalidBankDetails) {
        errorMessage =
          "Please enter correct bank account details and try again.";
      } else if (errorCode === ErrorCode.CannotUploadDocs) {
        errorMessage = "Please upload valid identification docs.";
      }

      errorMessage = errorDescription || errorMessage;

      if (!isEditing && onBankDetailsAfterError && bankAccountDetails) {
        onBankDetailsAfterError(bankAccountDetails);
      }

      setError(errorMessage);
    },
    [onBankDetails, notify, isEditing, onBankDetailsAfterError],
  );

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    async (values) => {
      setSending(true);
      setError("");

      const photoIdFileName = getFileNameForUploading(photoIdFile!.name);
      const bankLetterFileName = getFileNameForUploading(bankLetterFile!.name);

      try {
        values.photoId = isPaymeDocument(photoIdFile)
          ? photoIdFile.downloadURL
          : await uploadFile(photoIdFileName, "private", photoIdFile!);
        values.bankLetter = isPaymeDocument(bankLetterFile)
          ? bankLetterFile.downloadURL
          : await uploadFile(bankLetterFileName, "private", bankLetterFile!);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Something went wrong :/");
        setSending(false);
        return;
      }

      setInitialValues(values);

      const bankAccountDetails: BankAccountDetails = {
        bankCode: values.bankCode!,
        branchNumber: Number(values.branchNumber!),
        accountNumber: Number(values.accountNumber!),
        identificationDocs: [
          isPaymeDocument(photoIdFile)
            ? { ...photoIdFile }
            : {
                name: photoIdFileName,
                legalType: PaymeTypeCodes.SocialId,
                mimeType: photoIdFile!.type,
                downloadURL: values.photoId,
              },
          isPaymeDocument(bankLetterFile)
            ? { ...bankLetterFile }
            : {
                name: bankLetterFileName,
                legalType: PaymeTypeCodes.BankAccountOwnership,
                mimeType: bankLetterFile!.type,
                downloadURL: values.bankLetter,
              },
        ],
        city: values.city,
        country: values.country,
        streetAddress: values.address,
        streetNumber: values.streetNumber!,
        firstName: values.firstName,
        lastName: values.lastName,
        socialId: values.idNumber,
        socialIdIssueDate: formatDate(
          values.socialIdIssueDate,
          DateFormat.ShortSecondary,
        ),
        birthdate: formatDate(values.birthdate, DateFormat.ShortSecondary),
        gender: values.gender!,
        phoneNumber: values.phoneNumber!,
        email: values.email,
      };

      if (isEditing) {
        dispatch(
          updateBankDetails.request({
            payload: bankAccountDetails,
            callback: handleDataChange,
          }),
        );
      } else {
        dispatch(
          addBankDetails.request({
            payload: bankAccountDetails,
            callback: handleDataChange,
          }),
        );
      }
    },
    [dispatch, isEditing, bankLetterFile, photoIdFile, handleDataChange],
  );

  const handleSubmitForm = () => {
    formRef.current?.submitForm();
  };

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
          descriptionClassName,
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
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formRef}
            validationSchema={validationSchema}
            validateOnMount
          >
            {({ values, isValid, setFieldValue }) => {
              const isSubmitButtonDisabled =
                !isValid || !photoIdFile || !bankLetterFile;

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
                      className="field add-bank-details-form__dropdown"
                      name="gender"
                      label="Gender"
                      placeholder="---Select gender---"
                      options={GENDER_OPTIONS}
                      shouldBeFixed={false}
                    />
                  </div>

                  <h3>Contact Info</h3>
                  <div className="section">
                    <TextField
                      className="field"
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      placeholder="Add your first name"
                      isRequired
                      styles={{
                        label: "add-bank-details-form__label",
                      }}
                    />
                    <TextField
                      className="field"
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      placeholder="Add your last name"
                      isRequired
                      styles={{
                        label: "add-bank-details-form__label",
                      }}
                    />
                  </div>
                  <div className="section add-bank-details-form__contact-info-general-data">
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
                      className="field add-bank-details-form__dropdown"
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
                      className="field add-bank-details-form__dropdown"
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
                      onUploadedFileClick={
                        photoIdFile
                          ? () => handleUploadedFileClick(photoIdFile)
                          : undefined
                      }
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
                      onUploadedFileClick={
                        bankLetterFile
                          ? () => handleUploadedFileClick(bankLetterFile)
                          : undefined
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    onClick={handleSubmitForm}
                    disabled={isSubmitButtonDisabled}
                    className="save-button"
                    variant={ButtonVariant.PrimaryPink}
                  >
                    Save
                  </Button>
                  {onCancel && (
                    <Button
                      onClick={onCancel}
                      disabled={isSubmitButtonDisabled}
                      variant={ButtonVariant.OutlineDarkPink}
                    >
                      Cancel
                    </Button>
                  )}
                  {error && <div className="error">{error}</div>}
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
      {reviewingDoc && (
        <FilePreview doc={reviewingDoc} onClose={handleFilePreviewClose} />
      )}
    </div>
  );
};
