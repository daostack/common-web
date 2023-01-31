import React, { PropsWithChildren, ReactElement } from "react";
import { Formik, FormikValues } from "formik";
import { Form } from "@/shared/components/Form/Formik";
import { Button } from "@/shared/ui-kit";
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
}

const CreationForm = <T extends FormikValues>(
  props: PropsWithChildren<CreationFormProps<T>>,
): ReactElement => {
  const {
    initialValues,
    onSubmit,
    items,
    submitButtonText = "Create",
    disabled,
  } = props;
  const validationSchema = generateValidationSchema(items);

  return (
    <Formik
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
          className={styles.submitButton}
          type="submit"
          disabled={disabled}
        >
          {submitButtonText}
        </Button>
      </Form>
    </Formik>
  );
};

export default CreationForm;
