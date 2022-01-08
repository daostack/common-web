import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "@/shared/components/Form/Formik";
import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { Common } from "@/shared/models";
import { formatPrice } from "@/shared/utils";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onProposalAdd: (payload: any) => void;
  common: Common;
}

const validationSchema = Yup.object({
  message: Yup.string().required("Field required"),
  title: Yup.string().required("Field required").max(49, "Title too long"),
});

const AddProposalComponent = ({
  isShowing,
  onClose,
  onProposalAdd,
  common,
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
            </div>
          </div>
        )}
      </Formik>
    </Modal>
  );
};

export default AddProposalComponent;
