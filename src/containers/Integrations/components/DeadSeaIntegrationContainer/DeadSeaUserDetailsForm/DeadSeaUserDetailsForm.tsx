import React, { FC, useCallback, useMemo } from "react";
import { Formik, FormikConfig } from "formik";
import { countryList } from "@/shared/assets/countries";
import { Button, DropdownOption } from "@/shared/components";
import {
  Checkbox,
  Dropdown,
  Form,
  TextField,
} from "@/shared/components/Form/Formik";
import { AVAILABLE_COUNTRIES, CountryCode } from "@/shared/constants";
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

const getInitialValues = (): FormValues => ({
  firstName: "",
  lastName: "",
  email: "",
  country: AVAILABLE_COUNTRIES.length === 1 ? AVAILABLE_COUNTRIES[0] : "",
  about: "",
  supportPlan: "",
  marketingContentAgreement: false,
  whatsappGroupAgreement: false,
});

const DeadSeaUserDetailsForm: FC = () => {
  const countriesOptions = useMemo<DropdownOption[]>(
    () =>
      countryList
        .filter((item) =>
          AVAILABLE_COUNTRIES.includes(item.value as CountryCode)
        )
        .map((item) => ({
          text: item.name,
          value: item.value,
        })),
    []
  );

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log(values);
    },
    []
  );

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isValid }) => (
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
              rows={2}
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
              rows={2}
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
          <Button
            className="dead-sea-user-details-form__submit-button"
            type="submit"
            disabled={!isValid}
          >
            Next
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default DeadSeaUserDetailsForm;
