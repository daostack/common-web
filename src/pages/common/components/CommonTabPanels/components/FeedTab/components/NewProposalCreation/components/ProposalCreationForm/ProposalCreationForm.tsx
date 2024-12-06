import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Formik } from "formik";
import { Form } from "@/shared/components/Form/Formik";
import { NewProposalCreationFormValues } from "@/shared/interfaces";
import { Circles, Governance } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { selectProposalCreationData } from "@/store/states";
import validationSchema from "../../validationSchema";
import { NewProposalHeader } from "../NewProposalHeader";
import { ProposalForm } from "../ProposalForm";
import { ProposalFormPersist } from "../ProposalFormPersist";
import styles from "./ProposalCreationForm.module.scss";

type FormValues = NewProposalCreationFormValues;

interface Styles {
  header?: string;
  buttonsWrapper?: string;
}

interface ProposalCreationFormProps {
  className?: string;
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  styles?: Styles;
  governance: Governance;
  commonBalance: number;
}

const ProposalCreationForm: FC<ProposalCreationFormProps> = (props) => {
  const {
    className,
    initialValues,
    governanceCircles,
    onSubmit,
    onCancel,
    isLoading = false,
    styles: outerStyles,
    governance,
    commonBalance,
  } = props;
  const disabled = isLoading;
  const creationData = useSelector(
    selectProposalCreationData(governance.commonId),
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ values }) => (
        <Form className={classNames(styles.form, className)}>
          <NewProposalHeader
            className={outerStyles?.header}
            proposalType={creationData?.proposalType.label}
          />
          <ProposalForm
            className={styles.discussionForm}
            disabled={disabled}
            governanceCircles={governanceCircles}
            governance={governance}
            selectedProposalType={values.proposalType}
            commonBalance={commonBalance}
          />
          <div
            className={classNames(
              styles.buttonsContainer,
              outerStyles?.buttonsWrapper,
            )}
          >
            <div className={styles.buttonsWrapper}>
              {onCancel && (
                <Button
                  className={styles.button}
                  variant={ButtonVariant.OutlineDarkPink}
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant={ButtonVariant.PrimaryPink}
                className={styles.button}
                type="submit"
                disabled={disabled}
                loading={isLoading}
              >
                Publish proposal
              </Button>
            </div>
          </div>
          <ProposalFormPersist commonId={governance.commonId} />
        </Form>
      )}
    </Formik>
  );
};

export default ProposalCreationForm;
