import React, { FC, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { updateUserDetails } from "@/containers/Auth/store/actions";
import { countryList } from "@/shared/assets/countries";
import { Button, DropdownOption, Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import {
  Checkbox,
  Dropdown,
  Form,
  TextField,
} from "@/shared/components/Form/Formik";
import { CountryCode, ScreenSize } from "@/shared/constants";
import { User } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import validationSchema from "./validationSchema";
import "./index.scss";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  about: string;
  supportPlan: string;
  marketingContentAgreement: boolean;
  whatsappGroupAgreement: boolean;
}

const getInitialValues = (user?: User | null): FormValues => ({
  firstName:
    user?.firstName.trim() || user?.displayName?.trim().split(" ")[0] || "",
  lastName:
    user?.lastName.trim() || user?.displayName?.trim().split(" ")[1] || "",
  email: user?.email || "",
  country: user?.country || CountryCode.IL,
  about: user?.intro || "",
  supportPlan: "",
  marketingContentAgreement: false,
  whatsappGroupAgreement: false,
});

interface DeadSeaUserDetailsFormProps {
  user: User;
  onFinish: () => void;
}

const DeadSeaUserDetailsForm: FC<DeadSeaUserDetailsFormProps> = (props) => {
  const { user, onFinish } = props;
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState("");
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const textAreaRowsAmount = isMobileView ? 3 : 2;

  const countriesOptions = useMemo<DropdownOption[]>(
    () =>
      countryList.map((item) => ({
        text: item.name,
        value: item.value,
      })),
    []
  );

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values, { setSubmitting }) => {
      const { firstName, lastName, email, country, about } = values;

      setSubmitting(true);
      setErrorText("");

      dispatch(
        updateUserDetails.request({
          user: {
            ...user,
            firstName,
            lastName,
            email,
            country,
            intro: about,
          },
          callback: (error) => {
            setSubmitting(false);

            if (error) {
              setErrorText(error.message || "Something went wrong");
            } else {
              onFinish();
            }
          },
        })
      );
    },
    [dispatch, user]
  );

  return (
    <Formik
      initialValues={getInitialValues(user)}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isValid, isSubmitting }) => (
        <Form className="dead-sea-user-details-form">
          <div className="dead-sea-user-details-form__fields-wrapper">
            <TextField
              id="firstName"
              name="firstName"
              label="First name"
              placeholder="Yossi"
              styles={{
                label: "dead-sea-user-details-form__field-label",
              }}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last name"
              placeholder="Mordachai"
              styles={{
                label: "dead-sea-user-details-form__field-label",
              }}
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              placeholder="yossi.mor@gmail.com"
              styles={{
                label: "dead-sea-user-details-form__field-label",
              }}
            />
            <Dropdown
              name="country"
              label="Country"
              placeholder="---Select country---"
              options={countriesOptions}
              shouldBeFixed={false}
            />
            <TextField
              className="dead-sea-user-details-form__all-columns"
              id="about"
              name="about"
              label="About you"
              placeholder="What are you most passionate about, really good at, or love"
              hint="(optional)"
              styles={{
                label: "dead-sea-user-details-form__field-label",
                hint: "dead-sea-user-details-form__field-hint",
              }}
              isTextarea
              rows={textAreaRowsAmount}
            />
            <TextField
              className="dead-sea-user-details-form__all-columns"
              id="supportPlan"
              name="supportPlan"
              label="How could you support DSG further?"
              placeholder="Amet minim mollit non deserunt ullamco est sit aliqua dolor do good at, or love"
              hint="(optional)"
              styles={{
                label: "dead-sea-user-details-form__field-label",
                hint: "dead-sea-user-details-form__field-hint",
              }}
              isTextarea
              rows={textAreaRowsAmount}
            />
          </div>
          <Checkbox
            id="marketingContentAgreement"
            name="marketingContentAgreement"
            label="Agree to receive marketing content"
          />
          <Checkbox
            className="dead-sea-user-details-form__checkbox"
            id="whatsappGroupAgreement"
            name="whatsappGroupAgreement"
            label="Interested to join DSG whatsapp group"
          />
          {isSubmitting && (
            <div>
              <Loader />
            </div>
          )}
          <Button
            className="dead-sea-user-details-form__submit-button"
            type="submit"
            disabled={!isValid || isSubmitting}
            shouldUseFullWidth
          >
            Next
          </Button>
          {errorText && (
            <ErrorText className="dead-sea-user-details-form__error">
              {errorText}
            </ErrorText>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default DeadSeaUserDetailsForm;
