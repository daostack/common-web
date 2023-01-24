import React, { FC } from "react";
import classNames from "classnames";
import { Formik } from "formik";
import { Form } from "@/shared/components/Form/Formik";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { Circles } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import validationSchema from "../../validationSchema";
import { DiscussionForm } from "../DiscussionForm";
import { DiscussionFormPersist } from "../DiscussionFormPersist";
import { NewDiscussionHeader } from "../NewDiscussionHeader";
import styles from "./DiscussionCreationForm.module.scss";

type FormValues = NewDiscussionCreationFormValues;

interface Styles {
  buttonsWrapper?: string;
}

interface DiscussionCreationFormProps {
  className?: string;
  initialValues: FormValues;
  governanceCircles: Circles;
  userCircleIds: string[];
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  styles?: Styles;
}

const DiscussionCreationForm: FC<DiscussionCreationFormProps> = (props) => {
  const {
    className,
    initialValues,
    governanceCircles,
    userCircleIds,
    onSubmit,
    onCancel,
    isLoading = false,
    styles: outerStyles,
  } = props;
  const disabled = isLoading;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ values, setFieldValue }) => (
        <Form className={classNames(styles.form, className)}>
          <NewDiscussionHeader
            currentCircle={values.circle}
            governanceCircles={governanceCircles}
            userCircleIds={userCircleIds}
            onCircleSave={(circle) => setFieldValue("circle", circle)}
            disabled={disabled}
          />
          <DiscussionForm
            className={styles.discussionForm}
            disabled={disabled}
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
                  variant={ButtonVariant.PrimaryGray}
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              )}
              <Button
                className={styles.button}
                type="submit"
                disabled={disabled}
              >
                Publish discussion
              </Button>
            </div>
          </div>
          <DiscussionFormPersist />
        </Form>
      )}
    </Formik>
  );
};

export default DiscussionCreationForm;
