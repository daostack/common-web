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
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { updateUserDetails } from "@/pages/Auth/store/actions";
import { uploadImage } from "@/pages/Auth/store/saga";
import { countryList } from "@/shared/assets/countries";
import { ButtonIcon, DropdownOption, UserAvatar } from "@/shared/components";
import { Form, Dropdown, TextField } from "@/shared/components/Form/Formik";
import {
  ANONYMOUS_USER_FIRST_NAME,
  ANONYMOUS_USER_LAST_NAME,
} from "@/shared/constants";
import { useImageSizeCheck } from "@/shared/hooks";
import { Edit3Icon as EditIcon } from "@/shared/icons";
import { User } from "@/shared/models";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Loader,
  LoaderColor,
} from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import { UserDetailsPreview } from "./components";
import { validationSchema } from "./validationSchema";
import styles from "./UserDetails.module.scss";

interface Styles {
  previewWrapper?: string;
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
  isCountryDropdownFixed?: boolean;
  isEditing?: boolean;
  isMobileView?: boolean;
  onEdit: () => void;
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
    isCountryDropdownFixed = true,
    isEditing = true,
    isMobileView = false,
    styles: outerStyles,
    onEdit,
    onLoading,
    onSubmitting,
  } = props;
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<FormValues>>(null);
  const { checkImageSize } = useImageSizeCheck();
  const [loading, setLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const inputFile = useRef<HTMLInputElement>(null);
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

  const handleAvatarEdit = () => {
    if (!loading) {
      inputFile?.current?.click();
    }
  };

  useImperativeHandle(
    userDetailsRef,
    () => ({
      submit: () => {
        formRef.current?.submitForm();
      },
    }),
    [formRef],
  );

  const fieldStyles = {
    labelWrapper: styles.textFieldLabelWrapper,
    input: {
      default: styles.textFieldInput,
    },
  };

  useEffect(() => {
    if (!isEditing) {
      formRef.current?.setFieldValue("photo", user.photoURL || "");
      setUploadedPhoto("");
    }
  }, [isEditing, user]);

  return (
    <div className={classNames(styles.container, className)}>
      <Formik
        innerRef={formRef}
        initialValues={getInitialValues(user, isNewUser)}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <>
            <Form className={styles.form}>
              <div
                className={classNames(
                  styles.previewWrapper,
                  outerStyles?.previewWrapper,
                )}
              >
                <div className={classNames(styles.avatar, outerStyles?.avatar)}>
                  <UserAvatar
                    className={classNames(
                      styles.userPhoto,
                      outerStyles?.userAvatar,
                    )}
                    photoURL={values.photo}
                    preloaderSrc={uploadedPhoto}
                    nameForRandomAvatar={values.email}
                    userName={getUserName(values)}
                  />
                  {isEditing && !isSubmitting && !isMobileView && (
                    <ButtonIcon
                      className={classNames(
                        styles.editAvatarButton,
                        outerStyles?.editAvatar,
                      )}
                      onClick={handleAvatarEdit}
                    >
                      {loading ? (
                        <Loader
                          className={styles.editAvatarLoader}
                          color={LoaderColor.White}
                        />
                      ) : (
                        <EditIcon className={styles.editAvatarImage} />
                      )}
                    </ButtonIcon>
                  )}
                  {isEditing &&
                    !isSubmitting &&
                    isMobileView &&
                    (!loading ? (
                      <Button
                        className={styles.editAvatarButtonMobile}
                        variant={ButtonVariant.LightPink}
                        size={ButtonSize.Xsmall}
                        onClick={handleAvatarEdit}
                      >
                        Edit picture
                      </Button>
                    ) : (
                      <Loader />
                    ))}
                  <input
                    className={styles.avatarInputFile}
                    type="file"
                    accept="image/*"
                    ref={inputFile}
                    onChange={(value) =>
                      uploadAvatar(value.target.files, setFieldValue)
                    }
                  />
                </div>
                {!isEditing && (
                  <>
                    <UserDetailsPreview
                      className={styles.userDetailsPreview}
                      user={user}
                      isMobileView={isMobileView}
                    />
                    {isMobileView && (
                      <Button
                        className={styles.editProfileButton}
                        variant={ButtonVariant.LightPink}
                        size={ButtonSize.Xsmall}
                        onClick={onEdit}
                      >
                        Edit profile
                      </Button>
                    )}
                  </>
                )}
              </div>
              {!isEditing && user.intro && (
                <div className={styles.introWrapper}>
                  <h3 className={styles.introTitle}>About</h3>
                  <p className={styles.introDescription}>{user.intro}</p>
                </div>
              )}
              {isEditing && (
                <div
                  className={classNames(
                    styles.textFieldContainer,
                    outerStyles?.fieldContainer,
                  )}
                >
                  <TextField
                    className={`${styles.textField} ${styles.firstNameTextField}`}
                    id="firstName"
                    name="firstName"
                    label="First name"
                    styles={fieldStyles}
                  />
                  <TextField
                    className={`${styles.textField} ${styles.lastNameTextField}`}
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    styles={fieldStyles}
                  />
                  <TextField
                    className={`${styles.textField} ${styles.emailTextField}`}
                    id="email"
                    name="email"
                    label="Email"
                    styles={fieldStyles}
                  />
                  <Dropdown
                    className={`${styles.textField} ${styles.countryTextField}`}
                    name="country"
                    label="Country"
                    placeholder="---Select country---"
                    options={options}
                    shouldBeFixed={isCountryDropdownFixed}
                    styles={{
                      labelWrapper: fieldStyles.labelWrapper,
                    }}
                  />
                  <TextField
                    className={styles.textareaTextField}
                    id="intro"
                    name="intro"
                    label="Intro"
                    placeholder="What are you most passionate about, really good at, or love"
                    styles={{
                      ...fieldStyles,
                      inputWrapper: styles.introInputWrapper,
                    }}
                    isTextarea
                    rows={1}
                  />
                </div>
              )}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default forwardRef(UserDetails);
