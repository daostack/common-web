import { FormikValues } from "formik";
import React from "react";

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string;
  label?: string;
  labelHtmlElement?: React.ReactNode | null;
  setFieldValue?: Function;
  values?: FormikValues;
}
