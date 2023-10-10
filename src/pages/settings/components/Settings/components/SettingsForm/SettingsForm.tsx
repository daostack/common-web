import React, { FC, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Formik } from "formik";
import { FormikProps } from "formik/dist/types";
import { updateUserDetails } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ErrorText } from "@/shared/components/Form";
import { Dropdown, Form } from "@/shared/components/Form/Formik";
import {
  User,
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
  onSave: (withoutCall?: boolean) => void;
}

interface State {
  loading: boolean;
  updatedUser: User | null;
  error: string;
}

interface FormValues {
  pushNotificationPreference: UserPushNotificationPreference;
  emailNotificationPreference: UserEmailNotificationPreference;
}

const getInitialValues = (
  data?: Pick<
    User,
    "pushNotificationPreference" | "emailNotificationPreference"
  > | null,
): FormValues => ({
  pushNotificationPreference:
    data?.pushNotificationPreference ?? UserPushNotificationPreference.None,
  emailNotificationPreference:
    data?.emailNotificationPreference ?? UserEmailNotificationPreference.None,
});

const SettingsForm: FC<SettingsFormProps> = (props) => {
  const { className, withoutPushNotifications, onCancel, onSave } = props;
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const user = useSelector(selectUser());
  const [userUpdateState, setUserUpdateState] = useState<State>({
    loading: false,
    updatedUser: null,
    error: "",
  });

  const handleSubmit = (values: FormValues) => {
    if (!user) {
      return;
    }
    if (
      user.pushNotificationPreference === values.pushNotificationPreference &&
      user.emailNotificationPreference === values.emailNotificationPreference
    ) {
      onSave(true);
      return;
    }

    setUserUpdateState({
      loading: true,
      updatedUser: null,
      error: "",
    });

    dispatch(
      updateUserDetails.request({
        user: {
          ...user,
          ...values,
        },
        callback: (error, updatedUser) => {
          const nextState: State = {
            loading: false,
            updatedUser: null,
            error: "",
          };

          if (!error && updatedUser) {
            nextState.updatedUser = updatedUser;
          } else {
            nextState.error = "Something went wrong...";
          }

          setUserUpdateState(nextState);

          if (nextState.updatedUser) {
            onSave();
          }
        },
      }),
    );
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={getInitialValues(user)}
      onSubmit={handleSubmit}
    >
      <Form className={classNames(styles.form, className)}>
        <Dropdown
          className={classNames(
            styles.formItem,
            styles.pushNotificationsDropdown,
          )}
          name="pushNotificationPreference"
          label="Push notifications"
          options={PUSH_NOTIFICATIONS_OPTIONS}
          shouldBeFixed={false}
          disabled={withoutPushNotifications}
        />
        <Dropdown
          className={styles.formItem}
          name="emailNotificationPreference"
          label="Emails"
          options={EMAILS_OPTIONS}
          shouldBeFixed={false}
        />
        <div className={styles.buttonsWrapper}>
          <Button
            variant={ButtonVariant.OutlineDarkPink}
            onClick={onCancel}
            disabled={userUpdateState.loading}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.PrimaryPink}
            type="submit"
            disabled={userUpdateState.loading}
          >
            Save
          </Button>
        </div>
        {userUpdateState.error && (
          <ErrorText className={styles.errorText}>
            {userUpdateState.error}
          </ErrorText>
        )}
      </Form>
    </Formik>
  );
};

export default SettingsForm;
