import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import "./index.scss";
import "../../../containers/LoginContainer/index.scss";
import { User } from "../../../../../shared/models";
import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";
import { countryList } from "../../../../../shared/assets/countries";
import { useDispatch } from "react-redux";

import { updateUserDetails } from "../../../../Auth/store/actions";

interface UserDetailsProps {
  user: User;
}

interface UserDetailsInterface {
  firstName: string;
  lastName: string;
  country: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  lastName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
});

const UserDetails = ({ user }: UserDetailsProps) => {
  const [formValues, setFormValues] = useState<UserDetailsInterface>({
    firstName: "",
    lastName: "",
    country: "",
  });

  const dispatch = useDispatch();

  const countries = countryList.map((country) => (
    <option key={country.name} value={country.value}>{`${country.name} `}</option>
  ));

  console.log(countries);

  useEffect(() => {
    if (user) {
      if (user.firstName || user.lastName) {
        setFormValues({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          country: "",
        });
      } else {
        const name = user.displayName?.split(" ");

        if (name) {
          setFormValues({
            firstName: name[0],
            lastName: name[1],
            country: "",
          });
        }
      }
    }
  }, [user]);

  return (
    <div className="details-wrapper">
      <span className="title">Complete your account</span>
      <span className="sub-text">Help the community to get to know you better</span>
      <Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);

          dispatch(updateUserDetails.request({ ...user, ...values }));
          // submitFormHandler(values);
        }}
        initialValues={formValues}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <>
            <form>
              <label>
                <span>First name</span>
                <span>Required</span>
              </label>
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                name="firstName"
              />
              <label>
                <span>Last name</span>
                <span>Required</span>
              </label>
              <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.lastName} name="lastName" />
              <label>Country</label>
              <select name="country" onChange={handleChange} onBlur={handleBlur} value={values.country}>
                <option value="" disabled>
                  --- select country ---
                </option>
                {countries}
              </select>
            </form>
            <button className="button-blue" type="submit" onClick={() => handleSubmit()}>
              Continue
            </button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default UserDetails;
