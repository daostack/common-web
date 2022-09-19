import React, { FC, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button, ModalFooter } from "@/shared/components";
import { Checkbox, Form, TextField } from "@/shared/components/Form/Formik";
import { ScreenSize } from "@/shared/constants";
import TrashIcon from "@/shared/icons/trash.icon";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { DeleteCommonData } from "../types";
import validationSchema from "./validationSchema";
import "./index.scss";

interface ConfigurationProps {
  commonBalance: number;
  activeProposalsExist: boolean;
  initialData: DeleteCommonData | null;
  onFinish: (data: DeleteCommonData) => void;
}

interface FormValues {
  description: string;
  infoApproval: boolean;
}

const getInitialValues = (
  initialData: DeleteCommonData | null
): FormValues => ({
  description: initialData?.description || "",
  infoApproval: false,
});

const Configuration: FC<ConfigurationProps> = (props) => {
  const { commonBalance, activeProposalsExist, initialData, onFinish } = props;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isCommonDeletionAllowed = commonBalance === 0 && !activeProposalsExist;

  const handleContinue = () => {
    formRef.current?.submitForm();
  };

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        description: values.description,
      });
    },
    [onFinish]
  );

  return (
    <div className="delete-common-configuration">
      <StageName
        className="delete-common-configuration__stage-name"
        name="Delete common"
        icon={<TrashIcon className="delete-common-configuration__trash-icon" />}
      />
      <ol className="delete-common-configuration__ordered-list">
        <li>
          Common wallet must be empty (We can try to refund the members
          contributions they previously transferred)
        </li>
        <li>All proposals must be completed</li>
      </ol>
      <Formik
        initialValues={getInitialValues(initialData)}
        onSubmit={handleSubmit}
        innerRef={formRef}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="delete-common-configuration__form">
            <TextField
              className="delete-common-configuration__input"
              id="description"
              name="description"
              label="Description"
              rows={isMobileView ? 4 : 3}
              isTextarea
              styles={{
                label: "delete-common-configuration__input-label",
              }}
            />
            <Checkbox
              className="delete-common-configuration__checkbox"
              name="infoApproval"
              label="I understand and approve"
              styles={{
                label: "delete-common-configuration__checkbox-label",
              }}
            />
            <ModalFooter sticky>
              <div className="delete-common-configuration__modal-footer">
                <Button
                  key="delete-common-configuration"
                  className="delete-common-configuration__submit-button"
                  onClick={handleContinue}
                  disabled={!isValid || !isCommonDeletionAllowed}
                  shouldUseFullWidth
                >
                  {isMobileView ? "Continue" : "Create Proposal"}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Configuration;
