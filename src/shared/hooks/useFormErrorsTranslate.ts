import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FormikProps } from "formik/dist/types";
import { selectLanguage } from "@/shared/store/selectors";

export const useFormErrorsTranslate = <T>(
  form?: FormikProps<T> | null
): void => {
  const language = useSelector(selectLanguage());

  useEffect(() => {
    if (!form) {
      return;
    }

    const { errors, touched, setFieldTouched } = form;
    const touchedKeys = Object.keys(touched);

    Object.keys(errors).forEach((fieldName) => {
      if (touchedKeys.includes(fieldName)) {
        setFieldTouched(fieldName);
      }
    });
  }, [form, language]);
};
