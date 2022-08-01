import React, { FC, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ModalFooter,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { FundsAllocationData } from "../types";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Form, TextField } from "@/shared/components/Form/Formik";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "./constants";
import { validationSchema } from "./validationSchema";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  initialData: FundsAllocationData;
  onFinish: (data: FundsAllocationData) => void;
}

interface FormValues {
  title: string;
  description: string;
  goalOfPayment: string;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { initialData, onFinish } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);

  const getInitialValues = (): FormValues => ({
    title: "",
    description: "",
    goalOfPayment: "",
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        title: values.title,
        description: values.description,
        goalOfPayment: values.goalOfPayment,
      });
    },
    [onFinish, initialData]
  );

  const handleContinueClick = () => {
    formRef.current?.submitForm();
  };

  return (
    <div className="funds-allocation-configuration">
      <StageName
        className="funds-allocation-configuration__stage-name"
        name="Funds Allocation"
        backgroundColor="light-yellow"
        icon={
          <DollarIcon className="funds-allocation-configuration__avatar-icon" />
        }
      />
      <div className="funds-allocation-configuration__form">
        <Formik
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ isValid }) => (
            <Form>
              <TextField
                className="create-funds-allocation__text-field"
                id="title"
                name="title"
                label="Title"
                placeholder="Briefly describe your proposal"
                maxLength={FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH}
                isRequired
              />
              <TextField
                className="create-funds-allocation__text-field"
                id="description"
                name="description"
                label="Description"
                placeholder="What exactly do you plan to do and how? How does it align with the Common's agenda and goals"
                rows={isMobileView ? 4 : 3}
                isTextarea
                isRequired
              />
              <TextField
                className="create-funds-allocation__text-field"
                id="goalOfPayment"
                name="goalOfPayment"
                label="Goal of Payment"
                placeholder="What exactly do you plan to do with the funding?"
                rows={isMobileView ? 4 : 3}
                isTextarea
                isRequired
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="funds-allocation-configuration__modal-footer">
                  <Button
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={!isValid}
                  >
                    Continue
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Configuration;
