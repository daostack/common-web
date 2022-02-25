import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { DropdownOption } from "../../../../../shared/components";
import {
  Form,
  Dropdown,
  TextField,
} from "../../../../../shared/components/Form/Formik";
import { User } from "../../../../../shared/models";
import { countryList } from "../../../../../shared/assets/countries";
import { updateUserDetails } from "../../../../Auth/store/actions";
import { uploadImage } from "../../../../Auth/store/saga";
import { selectAuthProvider } from "../../../../Auth/store/selectors";
import { Button, Loader } from "../../../../../shared/components";
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
}

const UserDetails = ({ user, closeModal }: UserDetailsProps) => {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    photo: "",
  });

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

  useEffect(() => {
    if (user) {
      if (user.firstName || user.lastName) {
        setFormValues({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          country: "",
          photo: user.photoURL || "",
        });
      } else {
        const name = user.displayName?.split(" ");

        if (name) {
          setFormValues({
            firstName: name[0],
            lastName: name[1],
            email: user.email || "",
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

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values, { setSubmitting }) => {
      setSubmitting(false);

      dispatch(
        updateUserDetails.request({
          user: { ...user, ...values },
          callback: closeModal,
        })
      );
    },
    [closeModal, dispatch, user]
  );

  return (
    <div className="user-details">
      <h2 className="user-details__title">Complete your account</h2>
      <p className="user-details__sub-title">
        Help the community to get to know you better
      </p>
      <Formik
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={formValues}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, handleSubmit, isValid }) => (
          <>
            <Form className="user-details__form">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img
                    className="avatar__user-photo"
                    src={values.photo}
                    alt="avatar"
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
                <Dropdown
                  className="user-details__text-field user-details__dropdown"
                  name="country"
                  label="Country"
                  options={options}
                />
                <TextField
                  className="user-details__textarea"
                  id="textarea"
                  name="textarea"
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
            </Form>
            <Button
              className="user-details__save-button"
              type="submit"
              onClick={() => handleSubmit()}
              disabled={!isValid}
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
