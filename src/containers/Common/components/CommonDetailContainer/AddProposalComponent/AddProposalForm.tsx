import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LinksArray, TextField } from "@/shared/components/Form/Formik";
import { formatPrice } from "@/shared/utils";
import { Common } from "@/shared/models";
import { uploadFile } from "@/shared/utils/firebaseUploadFile";
import { MAX_LINK_TITLE_LENGTH } from "@/containers/Common/components/CommonListContainer/CreateCommonModal/CreationSteps/GeneralInfo/constants";

const validationSchema = Yup.object({
  message: Yup.string().required("Field required"),
  title: Yup.string().required("Field required").max(49, "Title too long"),
});

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface AddProposalFormInterface {
  onProposalAdd: (payload: any) => void;
  common: Common;
}

export const AddProposalForm = ({
  common,
  onProposalAdd,
}: AddProposalFormInterface) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFile] = useState<string[]>([]);

  const [formValues] = useState({
    title: "",
    message: "",
    links: [],
  });

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    setSelectedFiles((selectedFiles) => [...selectedFiles, file]);
  };

  useEffect(() => {
    (async () => {
      if (selectedFiles.length) {
        const files = await Promise.all(
          selectedFiles.map(async (file: File) => {
            const downloadURL = await uploadFile(file.name, "public_img", file);
            return downloadURL;
          })
        );

        setUploadedFile((f) => [...f, ...files]);
        setSelectedFiles([]);
      }
    })();
  }, [selectedFiles]);

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        onProposalAdd(values);
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
                  name={"funding"}
                  placeholder={"₪0"}
                  value={formikProps.values.title}
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
                value={formikProps.values.title}
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
                  Add link
                </div>
                <div
                  className="link"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Add image
                </div>
              </div>
              <div className="additional-content-wrapper">
                <div className="files-preview">
                  {uploadedFiles.map((f, i) => (
                    <img src={f} alt={i.toString()} key={f} />
                  ))}
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
