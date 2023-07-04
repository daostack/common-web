import React, {
  PropsWithChildren,
  ReactElement,
  forwardRef,
  useRef,
  ForwardedRef,
  useImperativeHandle,
} from "react";
import { Formik, FormikValues } from "formik";
import { FormikProps } from "formik/dist/types";
import { ErrorText } from "@/shared/components/Form";
import { Form } from "@/shared/components/Form/Formik";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Item } from "./components";
import { CreationFormItem } from "./types";
import { generateValidationSchema } from "./utils";
import styles from "./CreationForm.module.scss";

interface CreationFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  items: CreationFormItem[];
  submitButtonText?: string;
  disabled?: boolean;
  error?: string;
}

export interface CreationFormRef {
  isDirty: () => boolean;
}

const CreationForm = <T extends FormikValues>(
  props: PropsWithChildren<CreationFormProps<T>>,
  ref: ForwardedRef<CreationFormRef>,
): ReactElement => {
  const {
    initialValues,
    onSubmit,
    items,
    submitButtonText = "Create",
    disabled,
    error,
  } = props;
  const validationSchema = generateValidationSchema(items);
  const formRef = useRef<FormikProps<T>>(null);

  useImperativeHandle(
    ref,
    () => ({
      isDirty: () => formRef.current?.dirty ?? true,
    }),
    [formRef],
  );

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount
    >
      <Form className={styles.form}>
        <div className={styles.itemsWrapper}>
          {items.map((item) => (
            <Item
              key={item.props.name}
              className={styles.item}
              item={item}
              disabled={disabled}
            />
          ))}
        </div>
        <Button
          variant={ButtonVariant.PrimaryPink}
          className={styles.submitButton}
          type="submit"
          disabled={disabled}
        >
          {submitButtonText}
        </Button>
        {Boolean(error) && (
          <ErrorText className={styles.error}>{error}</ErrorText>
        )}
      </Form>
    </Formik>
  );
};

const generateCreationForm = <T extends FormikValues>() =>
  forwardRef<CreationFormRef, CreationFormProps<T>>(CreationForm);

export default generateCreationForm;
