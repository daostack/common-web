import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import {
  ANONYMOUS_USER_FIRST_NAME,
  ANONYMOUS_USER_LAST_NAME,
} from "@/shared/constants";
import { useImageSizeCheck } from "@/shared/hooks";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { countryList } from "../../../../../shared/assets/countries";
import {
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
import { getUserName } from "../../../../../shared/utils";
import { updateUserDetails } from "../../../../Auth/store/actions";
import { uploadImage } from "../../../../Auth/store/saga";
import {
  selectAuthProvider,
  selectUserPhoneNumber,
} from "../../../../Auth/store/selectors";
import { UserAuthInfo } from "../UserAuthInfo";
import UserDetailsPreview from "./UserDetailsPreview";
import { validationSchema } from "./validationSchema";
import "./index.scss";

interface Styles {
  avatarWrapper?: string;
  avatar?: string;
  userAvatar?: string;
  editAvatar?: string;
  fieldContainer?: string;
  introInputWrapper?: string;
}

export interface UserDetailsRef {
  submit: () => void;
}

interface UserDetailsProps {
  className?: string;
  user: User;
  isNewUser?: boolean;
  closeModal?: () => void;
  showAuthProvider?: boolean;
  customSaveButton?: boolean;
  isCountryDropdownFixed?: boolean;
  isEditing?: boolean;
  onLoading?: (isLoading: boolean) => void;
  onSubmitting?: (isSubmitting: boolean) => void;
  styles?: Styles;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  photo: string;
  intro: string;
}

const getInitialValues = (user: User, isNewUser: boolean): FormValues => {
  const names = (user.displayName || "").split(" ");
  const isAnonymousUser =
    isNewUser &&
    user.firstName === ANONYMOUS_USER_FIRST_NAME &&
    user.lastName === ANONYMOUS_USER_LAST_NAME;

  return {
    firstName: (!isAnonymousUser && (user.firstName || names[0])) || "",
    lastName: (!isAnonymousUser && (user.lastName || names[1])) || "",
    email: user.email || "",
    country: user.country || "",
    photo: user.photoURL || "",
    intro: user.intro || "",
  };
};

const UserDetails: ForwardRefRenderFunction<
  UserDetailsRef,
  UserDetailsProps
> = (props, userDetailsRef) => {
  const {
    className,
    user,
    isNewUser = false,
    closeModal,
    showAuthProvider = true,
    customSaveButton = false,
    isCountryDropdownFixed = true,
    isEditing = true,
    styles: outerStyles,
    onLoading,
    onSubmitting,
  } = props;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const { checkImageSize } = useImageSizeCheck();
  const [loading, setLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const inputFile: any = useRef(null);
  const authProvider = useSelector(selectAuthProvider());
  const userPhoneNumber = useSelector(selectUserPhoneNumber());

  const dispatch = useDispatch();

  const options = useMemo<DropdownOption[]>(
    () =>
      countryList.map((item) => ({
        text: item.name,
        value: item.value,
      })),
    [],
  );

  const uploadAvatar = (
    files: FileList | null,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
  ) => {
    const file = files && files[0];

    if (!file) {
      return;
    }

    if (!checkImageSize(file.name, file.size)) {
      return;
    }

    setLoading(true);

    if (onLoading) {
      onLoading(true);
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", async function () {
      const imageUrl = await uploadImage(this.result);
      setUploadedPhoto(URL.createObjectURL(file));
      setLoading(false);
      setFieldValue("photo", imageUrl);

      if (onLoading) {
        onLoading(false);
      }
    });
  };

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values, { setSubmitting }) => {
      setSubmitting(true);

      if (onSubmitting) {
        onSubmitting(true);
      }

      dispatch(
        updateUserDetails.request({
          user: { ...user, ...values },
          callback: () => {
            if (closeModal) {
              closeModal();
            }
            if (onSubmitting) {
              onSubmitting(false);
            }

            setSubmitting(false);
          },
        }),
      );
    },
    [closeModal, dispatch, user, onSubmitting],
  );

  useImperativeHandle(
    userDetailsRef,
    () => ({
      submit: () => {
        formRef.current?.submitForm();
      },
    }),
    [formRef],
  );

  const styles = {
    labelWrapper: "user-details__text-field-label-wrapper",
    input: {
      default: "user-details__text-field-input",
    },
  };

  useEffect(() => {
    if (!isEditing) {
      formRef.current?.setFieldValue("photo", user.photoURL || "");
      setUploadedPhoto("");
    }
  }, [isEditing, user]);

  return (
    <div className={classNames("user-details", className)}>
      <Formik
        innerRef={formRef}
        initialValues={getInitialValues(user, isNewUser)}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <>
            <Form className="user-details__form">
              <div
                className={classNames(
                  "avatar-wrapper",
                  outerStyles?.avatarWrapper,
                )}
              >
                <div className={classNames("avatar", outerStyles?.avatar)}>
                  <UserAvatar
                    className={classNames(
                      "avatar__user-photo",
                      outerStyles?.userAvatar,
                    )}
                    photoURL={values.photo}
                    preloaderSrc={uploadedPhoto}
                    nameForRandomAvatar={values.email}
                    userName={getUserName(values)}
                  />
                  {isEditing && !loading && !isSubmitting ? (
                    <div
                      className={classNames(
                        "edit-avatar",
                        outerStyles?.editAvatar,
                      )}
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
                {showAuthProvider && (
                  <UserAuthInfo
                    className="user-details__auth-info"
                    user={user}
                    userPhoneNumber={userPhoneNumber}
                    authProvider={authProvider}
                  />
                )}
                {loading ? (
                  <Loader className="user-details__avatar-loader" />
                ) : null}
              </div>
              {!isEditing && <UserDetailsPreview user={user} />}
              {isEditing && (
                <div
                  className={classNames(
                    "user-details__text-field-container",
                    outerStyles?.fieldContainer,
                  )}
                >
                  <TextField
                    className="user-details__text-field user-details__first-name"
                    id="firstName"
                    name="firstName"
                    label="First name"
                    isRequired
                    styles={styles}
                  />
                  <TextField
                    className="user-details__text-field user-details__last-name"
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    isRequired
                    styles={styles}
                  />
                  <TextField
                    className="user-details__text-field user-details__email"
                    id="email"
                    name="email"
                    label="Email"
                    isRequired
                    styles={styles}
                  />
                  {!isNewUser && (
                    <Dropdown
                      className="user-details__text-field user-details__country"
                      name="country"
                      label="Country"
                      placeholder="---Select country---"
                      options={options}
                      shouldBeFixed={isCountryDropdownFixed}
                    />
                  )}
                  <TextField
                    className="user-details__textarea"
                    id="intro"
                    name="intro"
                    label="Intro"
                    placeholder="What are you most passionate about, really good at, or love"
                    styles={{
                      ...styles,
                      inputWrapper: outerStyles?.introInputWrapper,
                    }}
                    isTextarea
                    rows={1}
                  />
                </div>
              )}
              {!customSaveButton && (
                <Button
                  className="user-details__save-button"
                  type="submit"
                  disabled={!isValid || loading || isSubmitting}
                  variant={ButtonVariant.PrimaryPink}
                >
                  Save
                </Button>
              )}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default forwardRef(UserDetails);
