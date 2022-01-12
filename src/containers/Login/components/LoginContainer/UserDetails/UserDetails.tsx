import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
// eslint-disable-next-line import/order
import * as Yup from "yup";

import { TextField } from "../../../../../shared/components/Form/Formik";
import "./index.scss";
import "../../../containers/LoginContainer/index.scss";
import { useDispatch } from "react-redux";

import { User } from "../../../../../shared/models";
import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";
import { countryList } from "../../../../../shared/assets/countries";
import { updateUserDetails } from "../../../../Auth/store/actions";
import { uploadImage } from "../../../../Auth/store/saga";
import { Loader } from "../../../../../shared/components";

interface UserDetailsProps {
  user: User;
  closeModal: () => void;
}

interface UserDetailsInterface {
  firstName: string;
  lastName: string;
  country: string;
  photo: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
  lastName: Yup.string().required(FORM_ERROR_MESSAGES.REQUIRED),
});

const UserDetails = ({ user, closeModal }: UserDetailsProps) => {
  const [formValues, setFormValues] = useState<UserDetailsInterface>({
    firstName: "",
    lastName: "",
    country: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const inputFile: any = useRef(null);

  const dispatch = useDispatch();

  const countries = countryList.map((country) => (
    <option
      key={country.name}
      value={country.value}
    >{`${country.name} `}</option>
  ));

  useEffect(() => {
    if (user) {
      if (user.firstName || user.lastName) {
        setFormValues({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          country: "",
          photo: user.photoURL || "",
        });
      } else {
        const name = user.displayName?.split(" ");

        if (name) {
          setFormValues({
            firstName: name[0],
            lastName: name[1],
            country: "",
            photo: user.photoURL || "",
          });
        }
      }
    }
  }, [user]);

  const uploadAvatar = (
    files: FileList | null,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    if (files) {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.addEventListener("load", async function () {
        const imageUrl = await uploadImage(this.result);
        setLoading(false);
        setFieldValue("photo", imageUrl);
      });
    }
  };

  return (
    <div className="details-wrapper">
      <span className="title">Complete your account</span>
      <span className="sub-text">
        Help the community to get to know you better
      </span>
      <Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);

          dispatch(
            updateUserDetails.request({
              user: { ...user, ...values },
              callback: closeModal,
            })
          );
        }}
        initialValues={formValues}
        enableReinitialize={true}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <form>
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img src={values.photo} alt="avatar" />
                  {!loading ? (
                    <div
                      className="edit-avatar"
                      onClick={() =>
                        inputFile?.current && inputFile?.current?.click()
                      }
                    >
                      <img src="/icons/edit-avatar.svg" alt="edit-avatar" />
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputFile}
                    onChange={(value) =>
                      uploadAvatar(value.target.files, setFieldValue)
                    }
                  />
                </div>
                <div className="user-account-name">{user?.email} </div>
                {loading ? <Loader /> : null}
              </div>
              <TextField
                className="details-wrapper__text-field"
                id="firstName"
                name="firstName"
                label="First name"
                placeholder="Ashley"
                isRequired
                styles={{
                  labelWrapper: "details-wrapper__text-field-label-wrapper",
                  input: {
                    default: "details-wrapper__text-field-input",
                  },
                }}
              />
              <TextField
                className="details-wrapper__text-field"
                id="lastName"
                name="lastName"
                label="Last name"
                placeholder="Johnson"
                isRequired
                styles={{
                  labelWrapper: "details-wrapper__text-field-label-wrapper",
                  input: {
                    default: "details-wrapper__text-field-input",
                  },
                }}
              />
              <label className="details-wrapper__label">Country</label>

              <div className="country">
                <select
                  name="country"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.country}
                >
                  <option value="" disabled>
                    --- select country ---
                  </option>
                  {countries}
                </select>
              </div>
            </form>
            <div className="actions-wrapper">
              <button
                className="button-blue white"
                type="submit"
                onClick={() => closeModal()}
              >
                Skip
              </button>
              <button
                className="button-blue"
                type="submit"
                onClick={() => handleSubmit()}
              >
                Continue
              </button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default UserDetails;
