import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "@/shared/components/Form/Formik";
import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onDiscussionAdd: (payload: { title: string; message: string }) => void;
}

const validationSchema = Yup.object({
  message: Yup.string().required("Field required"),
  title: Yup.string().required("Field required").max(49, "Title too long"),
});

const AddDiscussionComponent = ({
  isShowing,
  onClose,
  onDiscussionAdd,
}: AddDiscussionComponentProps) => {
  const [formValues] = useState({
    title: "",
    message: "",
  });
  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      <Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          onDiscussionAdd(values);
        }}
        initialValues={formValues}
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        isInitialValid={false}
      >
        {(formikProps) => (
          <div className="add-discussion-wrapper">
            <div className="add-discussion-title">New Post</div>
            <div className="discussion-form-wrapper">
              <div className="input-wrapper">
                <div
                  className={`text-area-wrapper ${
                    formikProps.errors.title ? "error" : ""
                  }`}
                >
                  <TextField
                    id="title"
                    label="Post Title"
                    name={"title"}
                    value={formikProps.values.title}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isRequired={true}
                  />
                </div>
              </div>
              <div className="input-wrapper">
                <div
                  className={`text-area-wrapper ${
                    formikProps.errors.message ? "error" : ""
                  }`}
                >
                  <TextField
                    className="big"
                    label="Message"
                    id="message"
                    name={"message"}
                    value={formikProps.values.message}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isRequired={true}
                    isTextarea={true}
                  />
                </div>
              </div>

              <div className="action-wrapper">
                <button
                  className="button-blue"
                  disabled={!formikProps.isValid}
                  onClick={formikProps.submitForm}
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </Modal>
  );
};

export default AddDiscussionComponent;
