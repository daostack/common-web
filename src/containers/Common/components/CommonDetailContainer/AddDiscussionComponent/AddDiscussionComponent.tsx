import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import "./index.scss";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const validationSchema = Yup.object({
  message: Yup.string().required("Field required"),
  title: Yup.string().required("Field required").max(49, "Title too long"),
});

const AddDiscussionComponent = ({
  isShowing,
  onClose,
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

          console.log(values);
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
                <label>
                  Post Title <span className="required">Required</span>
                </label>
                <div
                  className={`text-area-wrapper ${
                    formikProps.errors.title ? "error" : ""
                  }`}
                >
                  <textarea
                    name="title"
                    value={formikProps.values.title}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                  />
                  <div className="error-message">
                    {formikProps.errors.title}
                  </div>
                </div>
              </div>
              <div className="input-wrapper">
                <label>
                  Message <span className="required">Required</span>
                </label>
                <div
                  className={`text-area-wrapper ${
                    formikProps.errors.message ? "error" : ""
                  }`}
                >
                  <textarea
                    className="big"
                    name="message"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.message}
                  />
                  <div className="error-message">
                    {formikProps.errors.message}
                  </div>
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
