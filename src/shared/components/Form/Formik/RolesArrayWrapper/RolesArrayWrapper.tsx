import React, { FC } from "react";
import { useField, useFormikContext } from "formik";
import { FormikTouched } from "formik/dist/types";
import { RolesArray, RolesArrayProps } from "../RolesArray";

export type RolesArrayWrapperProps = Omit<
  RolesArrayProps,
  "values" | "errors" | "touched"
>;

const RolesArrayWrapper: FC<RolesArrayWrapperProps> = (props) => {
  const [{ value }, { error }] = useField<string[]>(props.name);
  const formik = useFormikContext();

  return (
    <RolesArray
      {...props}
      values={value}
      errors={error}
      touched={formik.touched[props.name] as FormikTouched<string>[]}
    />
  );
};

export default RolesArrayWrapper;
