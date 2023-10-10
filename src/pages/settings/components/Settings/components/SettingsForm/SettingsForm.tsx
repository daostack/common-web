import React, { FC, useRef } from "react";
import classNames from "classnames";
import { Formik } from "formik";
import { FormikProps } from "formik/dist/types";
import { Dropdown, Form } from "@/shared/components/Form/Formik";
import {
  UserEmailNotificationPreference,
  UserPushNotificationPreference,
} from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { EMAILS_OPTIONS, PUSH_NOTIFICATIONS_OPTIONS } from "./constants";
import styles from "./SettingsForm.module.scss";

interface SettingsFormProps {
  className?: string;
  withoutPushNotifications: boolean;
  onCancel: () => void;
  onSave: () => void;
}

interface FormValues {
  pushNotifications: UserPushNotificationPreference;
  emails: UserEmailNotificationPreference;
}

const getInitialValues = (): FormValues => ({
  pushNotifications: UserPushNotificationPreference.None,
  emails: UserEmailNotificationPreference.None,
});

const SettingsForm: FC<SettingsFormProps> = (props) => {
  const { className, withoutPushNotifications, onCancel, onSave } = props;
  const formRef = useRef<FormikProps<FormValues>>(null);

  const handleSubmit = () => {
    onSave();
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
    >
      <Form className={classNames(styles.form, className)}>
        <Dropdown
          className={classNames(
            styles.formItem,
            styles.pushNotificationsDropdown,
          )}
          name="pushNotifications"
          label="Push notifications"
          options={PUSH_NOTIFICATIONS_OPTIONS}
          shouldBeFixed={false}
          disabled={withoutPushNotifications}
        />
        <Dropdown
          className={styles.formItem}
          name="emails"
          label="Emails"
          options={EMAILS_OPTIONS}
          shouldBeFixed={false}
        />
        <div className={styles.buttonsWrapper}>
          <Button variant={ButtonVariant.OutlineDarkPink} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={ButtonVariant.PrimaryPink} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default SettingsForm;
