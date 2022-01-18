import React, { useCallback, FC } from "react";
import { Formik, FormikConfig } from "formik";
import { Form, TextField } from "../../../../shared/components/Form/Formik";
import { SUPPORT_EMAIL } from "../../../../shared/constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface FormValues {
  email: string;
  password: string;
}

const INITIAL_VALUES: FormValues = {
  email: "",
  password: "",
};

const AuthenticationContainer: FC = () => {
  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      console.log(values);
    },
    []
  );

  return (
    <div className="trustee-authentication-container">
      <h1 className="trustee-authentication-container__title">
        Login to your account
      </h1>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="trustee-authentication-container__form">
            <TextField
              className="trustee-authentication-container__text-field"
              id="email"
              name="email"
              label="Email"
              placeholder="name@mail.com"
              styles={{
                labelWrapper:
                  "trustee-authentication-container__text-field-label-wrapper",
              }}
            />
            <TextField
              className="trustee-authentication-container__text-field"
              id="password"
              name="password"
              type="password"
              label="Password"
              styles={{
                labelWrapper:
                  "trustee-authentication-container__text-field-label-wrapper",
              }}
            />
            <button
              className="button-blue trustee-authentication-container__submit-button"
              type="submit"
              disabled={!isValid}
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
      <span className="trustee-authentication-container__hint">
        Forgot password? Contact us at{" "}
        <a
          className="trustee-authentication-container__support-email"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
      </span>
    </div>
  );
};

export default AuthenticationContainer;
