import React, { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

import { Input, LoadingIndicator } from "../../../../../shared/components/Common";
import RedirectLink from "../../RedirectLink";
import { FormProps, AuthShape } from "../../../interface";
import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";

const validationSchema = Yup.object<AuthShape>().shape({
  email: Yup.string().email(FORM_ERROR_MESSAGES.EMAIL).required(FORM_ERROR_MESSAGES.REQUIRED),
  password: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
});

const LoginForm: React.FunctionComponent<FormProps> = (props) => {
  const [formValues] = useState({
    email: "",
    password: "",
  });

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        props.submitHandler && props.submitHandler(values);
        setSubmitting(false);
      }}
      initialValues={formValues}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <div>
          <div>
            Login
            {props.loading && <LoadingIndicator />}
            <form onSubmit={handleSubmit}>
              <ErrorMessage name="email" render={(msg) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="email"
                label="Email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              <ErrorMessage name="password" render={(msg) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="password"
                label="Password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />

              <RedirectLink to="/auth/signup/">Registration</RedirectLink>
              <button type="submit" disabled={props.loading}>
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
