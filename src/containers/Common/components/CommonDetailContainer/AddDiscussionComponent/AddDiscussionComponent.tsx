import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "@/shared/components/Form/Formik";
import { Modal } from "@/shared/components";
import { useZoomDisabling } from '@/shared/hooks';
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { useSelector } from "react-redux";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import classNames from "classnames";

const MAX_TITLE_LENGTH = 49;

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onDiscussionAdd: (payload: { title: string; message: string }) => void;
}

const validationSchema = Yup.object({
  message: Yup.string().required("Field required"),
  title: Yup.string()
    .required("Field required")
    .max(MAX_TITLE_LENGTH, "Title too long"),
});

const AddDiscussionComponent = ({
  isShowing,
  onClose,
  onDiscussionAdd,
}: AddDiscussionComponentProps) => {
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const [formValues] = useState({
    title: "",
    message: "",
  });

  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }
  }, [isShowing, disableZoom, resetZoom]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className={classNames("create-discussion-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
    >
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
            <div className="add-discussion-title">New Discussion</div>
            <div className="discussion-form-wrapper">
              <div className="input-wrapper">
                <div
                  className={`text-area-wrapper ${
                    formikProps.errors.title ? "error" : ""
                  }`}
                >
                  <TextField
                    id="title"
                    label="Post Discussion"
                    name={"title"}
                    maxLength={MAX_TITLE_LENGTH}
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
                  Publish Discussion
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
