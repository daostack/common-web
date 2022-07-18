import React, { FC, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  Button,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import DollarIcon from "@/shared/icons/dollar.icon";
import { Circle, CommonMemberWithUserInfo, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { generateCirclesBinaryNumber } from "../../../CommonWhitepaper/utils";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { FundsAllocationData } from "../types";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Form, TextField, LinksArray } from "@/shared/components/Form/Formik";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  //commonMembers: CommonMemberWithUserInfo[];
  initialData: FundsAllocationData | null;
  onFinish: (data: FundsAllocationData) => void;
}

interface FormValues {
  title: string;
  description: string;
  goalOfPayment: string;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { governance, initialData, onFinish } = props;
  const isInitialCircleUpdate = useRef(true);
  const user = useSelector(selectUser());
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
        title: values.title,
        description: values.description,
        goalOfPayment: values.goalOfPayment
      });
    },
    [onFinish]
  );

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
      onFinish(formRef.current.values)
    }
  }, []);

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
      <Separator className="funds-allocation-configuration__separator" />
      <div className="funds-allocation-configuration__form">
        <Formik
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          innerRef={formRef}
          //validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <TextField
                className="create-funds-allocation__text-field"
                id="title"
                name="title"
                label="Title"
                placeholder="Briefly describe your proposal"
                maxLength={60}
                isRequired
              />
              <TextField
                className="create-funds-allocation__text-field"
                id="description"
                name="description"
                label="Description"
                placeholder="What exactly do you plan to do and how? How does it align with the Common's agenda and goals"
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
