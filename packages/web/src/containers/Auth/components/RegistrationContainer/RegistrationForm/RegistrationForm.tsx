import React, { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";
import { Input, LoadingIndicator } from "../../../../../shared/components/Common";
import RedirectLink from "../../RedirectLink";
import { FormProps, RegisterShape } from "../../../interface";

const validationSchema = Yup.object<RegisterShape>().shape({
  email: Yup.string().email(FORM_ERROR_MESSAGES.EMAIL).required(FORM_ERROR_MESSAGES.REQUIRED),
  first_name: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  last_name: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  password: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
});

const RegistrationForm: React.FunctionComponent<FormProps> = (props) => {
  const [formValues] = useState({
    first_name: "",
    last_name: "",
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
            Registration
            {props.loading && <LoadingIndicator />}
            <form onSubmit={handleSubmit}>
              <ErrorMessage name="email" render={(msg: string) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="email"
                label="Email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              <ErrorMessage name="first_name" render={(msg: string) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="text"
                label="First Name"
                name="first_name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.first_name}
              />
              <ErrorMessage name="last_name" render={(msg: string) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="text"
                label="Last Name"
                name="last_name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.last_name}
              />
              <ErrorMessage name="password" render={(msg: string) => <p style={{ color: "red" }}>{msg}</p>} />
              <Input
                type="password"
                label="Password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />

              <RedirectLink to="/auth/">Login</RedirectLink>
              <button type="submit" disabled={props.loading}>
                Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default RegistrationForm;
