import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { updateUserDetails } from "@/containers/Auth/store/actions";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
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
import { useFormErrorsTranslate } from "@/shared/hooks";
import { SupportersDataFields, User } from "@/shared/models";
import {
  getScreenSize,
  selectIsRtlLanguage,
  selectLanguage,
} from "@/shared/store/selectors";
import { getValidationSchema } from "./validationSchema";
import "./index.scss";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  about: string;
  supportPlan: string;
  marketingContentAgreement?: boolean;
  whatsappGroupAgreement?: boolean;
}

const getInitialValues = (
  user?: User | null,
  hiddenFields?: SupportersDataFields[]
): FormValues => ({
  firstName:
    user?.firstName.trim() || user?.displayName?.trim().split(" ")[0] || "",
  lastName:
    user?.lastName.trim() || user?.displayName?.trim().split(" ")[1] || "",
  email: user?.email || "",
  country: user?.country || CountryCode.IL,
  phoneNumber: user?.phoneNumber || "",
  about: user?.intro || "",
  supportPlan: "",
  marketingContentAgreement: !hiddenFields?.includes(
    "marketingContentAgreement"
  )
    ? false
    : undefined,
  whatsappGroupAgreement: !hiddenFields?.includes("whatsappGroupAgreement")
    ? false
    : undefined,
});

interface DeadSeaUserDetailsFormProps {
  user: User;
  onFinish: (supportPlan: string) => void;
}

const DeadSeaUserDetailsForm: FC<DeadSeaUserDetailsFormProps> = (props) => {
  const { user, onFinish } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const formRef = useRef<FormikProps<FormValues>>(null);
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const [errorText, setErrorText] = useState("");
  const language = useSelector(selectLanguage());
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const textAreaRowsAmount = isMobileView ? 3 : 2;
  const validationSchema = useMemo(getValidationSchema, [language]);
  useFormErrorsTranslate(formRef.current);

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
      const { firstName, lastName, email, country, phoneNumber, about } =
        values;

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
            phoneNumber,
            intro: about,
          },
          callback: (error) => {
            setSubmitting(false);

            if (error) {
              setErrorText(error.message || "Something went wrong");
            } else {
              onFinish(values.supportPlan);
            }
          },
        })
      );
    },
    [dispatch, user]
  );

  return (
    <Formik
      initialValues={getInitialValues(user, supportersData?.hiddenFields)}
      onSubmit={handleSubmit}
      innerRef={formRef}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isValid, isSubmitting }) => (
        <Form className="supporters-page-user-details-form">
          <div className="supporters-page-user-details-form__fields-wrapper">
            <TextField
              id="firstName"
              name="firstName"
              label={t("userDetailsForm.firstNameLabel")}
              placeholder={t("userDetailsForm.firstNamePlaceholder")}
              styles={{
                label: "supporters-page-user-details-form__field-label",
              }}
            />
            <TextField
              id="lastName"
              name="lastName"
              label={t("userDetailsForm.lastNameLabel")}
              placeholder={t("userDetailsForm.lastNamePlaceholder")}
              styles={{
                label: "supporters-page-user-details-form__field-label",
              }}
            />
            <TextField
              id="email"
              name="email"
              label={t("userDetailsForm.emailLabel")}
              placeholder={t("userDetailsForm.emailPlaceholder")}
              styles={{
                label: "supporters-page-user-details-form__field-label",
              }}
            />
            <Dropdown
              name="country"
              label={t("userDetailsForm.countryLabel")}
              placeholder={t("userDetailsForm.countryPlaceholder")}
              options={countriesOptions}
              shouldBeFixed={false}
            />
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              label={t("userDetailsForm.phoneNumberLabel")}
              placeholder="+972"
              hint={`(${t("userDetailsForm.optionalHint")})`}
              styles={{
                label: "supporters-page-user-details-form__field-label",
                hint: "supporters-page-user-details-form__field-hint",
                input: {
                  default: isRtlLanguage
                    ? "supporters-page-user-details-form__rtl"
                    : "",
                },
                error: isRtlLanguage
                  ? "supporters-page-user-details-form__rtl"
                  : "",
              }}
            />
            {!supportersData?.hiddenFields?.includes("aboutYou") && (
              <TextField
                className="supporters-page-user-details-form__all-columns"
                id="about"
                name="about"
                label="About you"
                placeholder="What are you most passionate about, really good at, or love"
                hint={`(${t("userDetailsForm.optionalHint")})`}
                styles={{
                  label: "supporters-page-user-details-form__field-label",
                  hint: "supporters-page-user-details-form__field-hint",
                }}
                isTextarea
                rows={textAreaRowsAmount}
              />
            )}
            {!supportersData?.hiddenFields?.includes("furtherSupportPlan") && (
              <TextField
                className="supporters-page-user-details-form__all-columns"
                id="supportPlan"
                name="supportPlan"
                label="How could you support DSG further?"
                placeholder="Special skills, connections or other assets you have that could help accomplish the DSG mission"
                hint={`(${t("userDetailsForm.optionalHint")})`}
                styles={{
                  label: "supporters-page-user-details-form__field-label",
                  hint: "supporters-page-user-details-form__field-hint",
                }}
                isTextarea
                rows={textAreaRowsAmount}
              />
            )}
          </div>
          {!supportersData?.hiddenFields?.includes(
            "marketingContentAgreement"
          ) && (
            <Checkbox
              id="marketingContentAgreement"
              name="marketingContentAgreement"
              label="Agree to receive marketing content"
            />
          )}
          {!supportersData?.hiddenFields?.includes(
            "whatsappGroupAgreement"
          ) && (
            <Checkbox
              className="supporters-page-user-details-form__checkbox"
              id="whatsappGroupAgreement"
              name="whatsappGroupAgreement"
              label="Interested to join DSG whatsapp group"
            />
          )}
          {isSubmitting && (
            <div>
              <Loader />
            </div>
          )}
          <Button
            className="supporters-page-user-details-form__submit-button"
            type="submit"
            disabled={!isValid || isSubmitting}
            shouldUseFullWidth
          >
            {t("buttons.next")}
          </Button>
          {errorText && (
            <ErrorText className="supporters-page-user-details-form__error">
              {errorText}
            </ErrorText>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default DeadSeaUserDetailsForm;
