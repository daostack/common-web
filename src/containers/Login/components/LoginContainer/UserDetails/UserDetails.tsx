import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "../../../../../shared/components/Form/Formik";
import "../../../containers/LoginContainer/index.scss";
import { User } from "../../../../../shared/models";
import { FORM_ERROR_MESSAGES } from "../../../../../shared/constants";
import { countryList } from "../../../../../shared/assets/countries";
import { updateUserDetails } from "../../../../Auth/store/actions";
import { uploadImage } from "../../../../Auth/store/saga";
import { Button, Loader } from "../../../../../shared/components";
import "./index.scss";

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
    <div className="user-details">
      <h2 className="user-details__title">Complete your account</h2>
      <p className="user-details__sub-title">
        Help the community to get to know you better
      </p>
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
            <form className="user-details__form">
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
                    className="avatar_input-file"
                    type="file"
                    accept="image/*"
                    ref={inputFile}
                    onChange={(value) =>
                      uploadAvatar(value.target.files, setFieldValue)
                    }
                  />
                </div>
                <div className="user-details__account-name">{user?.email} </div>
                {loading ? <Loader /> : null}
              </div>
              <div className="user-details__text-field-container">
                <TextField
                  className="user-details__text-field"
                  id="firstName"
                  name="firstName"
                  label="First name"
                  placeholder="Ashley"
                  isRequired
                  styles={{
                    labelWrapper: "user-details__text-field-label-wrapper",
                    input: {
                      default: "user-details__text-field-input",
                    },
                  }}
                />
                <TextField
                  className="user-details__text-field"
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  placeholder="Johnson"
                  isRequired
                  styles={{
                    labelWrapper: "user-details__text-field-label-wrapper",
                    input: {
                      default: "user-details__text-field-input",
                    },
                  }}
                />
                <TextField
                  className="user-details__text-field"
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="user@gmail.com"
                  isRequired
                  styles={{
                    labelWrapper: "user-details__text-field-label-wrapper",
                    input: {
                      default: "user-details__text-field-input",
                    },
                  }}
                />
                <div className="user-details__input-country-container">
                  <label className="user-details__text-field-label">
                    Country
                  </label>
                  <select
                    className="user-details__select"
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
                <TextField
                  className="user-details__textarea"
                  id="email"
                  name="email"
                  label="Intro"
                  placeholder="What are you most passionate about, really good at, or love"
                  styles={{
                    labelWrapper: "user-details__text-field-label-wrapper",
                    input: {
                      default: "user-details__text-field-input",
                    },
                  }}
                />
              </div>
            </form>
            <Button
              className="user-details__save-button"
              type="submit"
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default UserDetails;
