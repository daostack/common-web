import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LinksArray, TextField } from "@/shared/components/Form/Formik";
import { formatPrice } from "@/shared/utils";
import { Common } from "@/shared/models";
import { uploadFile } from "@/shared/utils/firebaseUploadFile";
import {
  HTTPS_URL_REGEXP,
  MAX_LINK_TITLE_LENGTH,
} from "@/containers/Common/components/CommonListContainer/CreateCommonModal/CreationSteps/GeneralInfo/constants";
import { ButtonIcon, Loader } from "@/shared/components";
import DeleteIcon from "@/shared/icons/delete.icon";
import { CreateFundingRequestProposalPayload } from "@/shared/interfaces/api/proposal";

const validationSchema = Yup.object({
  description: Yup.string().required("Field required"),
  title: Yup.string().required("Field required").max(49, "Title too long"),
  links: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .max(MAX_LINK_TITLE_LENGTH, "Entered title is too long")
        .required("Please enter link title"),
      link: Yup.string()
        .matches(HTTPS_URL_REGEXP, "Please enter correct URL")
        .required("Please enter a link"),
    })
  ),
});

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface AddProposalFormInterface {
  common: Common;
  saveProposalState: (
    payload: Partial<CreateFundingRequestProposalPayload>
  ) => void;
}

export const AddProposalForm = ({
  common,
  saveProposalState,
}: AddProposalFormInterface) => {
  const [showFileLoader, setShowFileLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFile] = useState<
    { title: string; value: string }[]
  >([]);

  const [formValues] = useState({
    title: "",
    description: "",
    links: [],
    images: [],
    amount: 0,
  });

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    setSelectedFiles((selectedFiles) => [...selectedFiles, file]);
  };

  const removeFile = (index: number) => {
    const f = [...uploadedFiles];
    f.splice(index, 1);
    setUploadedFile(f);
  };

  useEffect(() => {
    (async () => {
      if (selectedFiles.length) {
        setShowFileLoader(true);
        const files = await Promise.all(
          selectedFiles.map(async (file: File) => {
            const downloadURL = await uploadFile(file.name, "public_img", file);
            return { title: file.name, value: downloadURL };
          })
        );

        setUploadedFile((f) => [...f, ...files]);
        setShowFileLoader(false);
        setSelectedFiles([]);
      }
    })();
  }, [selectedFiles]);

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        saveProposalState({ ...values, images: uploadedFiles });
      }}
      initialValues={formValues}
      validateOnChange={true}
      validateOnBlur={false}
      validateOnMount={false}
      isInitialValid={false}
    >
      {(formikProps) => (
        <div className="add-proposal-wrapper">
          <div className="common-title">{common.name}</div>
          <div className="add-proposal-title">New proposal</div>
          <div className="add-proposal-description">
            Proposals allow you to make decisions as a group. If you choose to
            request funding and the proposal is accepted, you will be
            responsible to follow it through.
          </div>
          <div className="add-proposal-form-wrapper">
            <TextField
              id="title"
              label="Title"
              name={"title"}
              placeholder={"Briefly describe your proposal"}
              value={formikProps.values.title}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              isRequired={true}
            />
            <div className="funding-request-wrapper">
              <div className="funding-input-wrapper">
                <TextField
                  id="funding"
                  label="Funding amount requested"
                  name={"amount"}
                  placeholder={"₪0"}
                  value={formikProps.values.amount}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                />
              </div>
              <div className="funding-description">
                Leave as ₪0 if no funds are requested. <br /> Common balance:
                {formatPrice(common.balance)}
              </div>
            </div>
            <div className="proposal-description-wrapper">
              <TextField
                id="description"
                label="Description"
                name={"description"}
                placeholder={
                  "What exactly do you plan to do and how? How does it align with the Common's agenda and goals?"
                }
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isTextarea={true}
              />
            </div>
            <div className="add-additional-information">
              <div className="links-wrapper">
                <input
                  id="file"
                  type="file"
                  onChange={selectFiles}
                  accept={ACCEPTED_EXTENSIONS}
                  style={{ display: "none" }}
                />
                <div
                  className="link"
                  onClick={() =>
                    formikProps.setFieldValue("links", [
                      ...formikProps.values.links,
                      { title: "", link: "" },
                    ])
                  }
                >
                  <img
                    src="/icons/add-proposal/icons-link.svg"
                    alt="icons-link"
                  />
                  <span>Add link</span>
                </div>
                <div
                  className="link"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  <img
                    src="/icons/add-proposal/icons-picture.svg"
                    alt="icons-pic"
                  />
                  <span>Add image</span>
                </div>
              </div>
              <div className="additional-content-wrapper">
                <div className="files-preview">
                  {uploadedFiles.map((f, i) => (
                    <div className="file-item" key={f.value}>
                      <img src={f.value} alt={i.toString()} />
                      <ButtonIcon
                        className="file-item__remove-button"
                        onClick={() => removeFile(i)}
                      >
                        <DeleteIcon className="file-item__delete-icon" />
                      </ButtonIcon>
                    </div>
                  ))}
                  {showFileLoader && (
                    <div className="file-item">
                      <Loader />
                    </div>
                  )}
                </div>
                <div className="additional-links">
                  <LinksArray
                    hideAddButton={true}
                    name="links"
                    values={formikProps.values.links}
                    errors={formikProps.errors.links}
                    touched={formikProps.touched.links}
                    maxTitleLength={MAX_LINK_TITLE_LENGTH}
                    className="create-common-general-info__text-field"
                    itemClassName="create-common-general-info__links-array-item"
                  />
                </div>
              </div>
            </div>
            <div className="proposal-note-wrapper">
              <div className="note-title">Please note:</div>
              <div className="note-text">
                <img
                  src="/icons/add-proposal/icons-warning.svg"
                  alt="icons-warning"
                />
                Other proposals might be accepted and make the balance
                insufficient for the amount requested.
              </div>
            </div>
            <div className="action-wrapper">
              <button
                className="button-blue"
                disabled={!formikProps.isValid}
                onClick={formikProps.submitForm}
              >
                Create proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};
