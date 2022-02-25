import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import {
  Button,
  DropdownOption,
  Loader,
  UserAvatar,
} from "../../../../../shared/components";
import {
  Form,
  Dropdown,
  TextField,
} from "../../../../../shared/components/Form/Formik";
import { User } from "../../../../../shared/models";
import { countryList } from "../../../../../shared/assets/countries";
import { getUserName } from "../../../../../shared/utils";
import { updateUserDetails } from "../../../../Auth/store/actions";
import { uploadImage } from "../../../../Auth/store/saga";
import { selectAuthProvider } from "../../../../Auth/store/selectors";
import { UserAuthInfo } from "../UserAuthInfo";
import { validationSchema } from "./validationSchema";
import "./index.scss";

interface UserDetailsProps {
  user: User;
  closeModal: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  photo: string;
  intro: string;
}

const getInitialValues = (user: User): FormValues => {
  const names = (user.displayName || "").split(" ");

  return {
    firstName: user.firstName || names[0] || "",
    lastName: user.lastName || names[1] || "",
    email: user.email || "",
    country: user.country || "",
    photo: user.photoURL || "",
    intro: "",
  };
};

const UserDetails = ({ user, closeModal }: UserDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const inputFile: any = useRef(null);
  const authProvider = useSelector(selectAuthProvider());

  const dispatch = useDispatch();

  const options = useMemo<DropdownOption[]>(
    () =>
      countryList.map((item) => ({
        text: item.name,
        value: item.value,
      })),
    []
  );

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

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values, { setSubmitting }) => {
      setSubmitting(true);

      dispatch(
        updateUserDetails.request({
          user: { ...user, ...values },
          callback: closeModal,
        })
      );
    },
    [closeModal, dispatch, user]
  );

  const styles = {
    labelWrapper: "user-details__text-field-label-wrapper",
    input: {
      default: "user-details__text-field-input",
    },
  };

  return (
    <div className="user-details">
      <h2 className="user-details__title">Complete your account</h2>
      <p className="user-details__sub-title">
        Help the community to get to know you better
      </p>
      <Formik
        initialValues={getInitialValues(user)}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <>
            <Form className="user-details__form">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <UserAvatar
                    className="avatar__user-photo"
                    photoURL={values.photo}
                    nameForRandomAvatar={values.email}
                    userName={getUserName(values)}
                  />
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
                    className="avatar__input-file"
                    type="file"
                    accept="image/*"
                    ref={inputFile}
                    onChange={(value) =>
                      uploadAvatar(value.target.files, setFieldValue)
                    }
                  />
                </div>
                <UserAuthInfo
                  className="user-details__auth-info"
                  user={user}
                  authProvider={authProvider}
                />
                {loading ? <Loader /> : null}
              </div>
              <div className="user-details__text-field-container">
                <TextField
                  className="user-details__text-field"
                  id="firstName"
                  name="firstName"
                  label="First name"
                  isRequired
                  styles={styles}
                />
                <TextField
                  className="user-details__text-field"
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  isRequired
                  styles={styles}
                />
                <TextField
                  className="user-details__text-field"
                  id="email"
                  name="email"
                  label="Email"
                  isRequired
                  styles={styles}
                />
                <Dropdown
                  className="user-details__text-field"
                  name="country"
                  label="Country"
                  placeholder="---Select country---"
                  options={options}
                />
                <TextField
                  className="user-details__textarea"
                  id="intro"
                  name="intro"
                  label="Intro"
                  placeholder="What are you most passionate about, really good at, or love"
                  styles={styles}
                />
              </div>
              <Button
                className="user-details__save-button"
                type="submit"
                disabled={!isValid || loading || isSubmitting}
              >
                Save
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default UserDetails;
