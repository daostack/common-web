import React, { FC } from "react";
import { useField, useFormikContext } from "formik";
import { FormikTouched } from "formik/dist/types";
import { CommonLink } from "@/shared/models";
import { LinksArray, LinksArrayProps } from "../LinksArray";

export type LinksArrayWrapperProps = Omit<
  LinksArrayProps,
  "values" | "errors" | "touched"
>;

const LinksArrayWrapper: FC<LinksArrayWrapperProps> = (props) => {
  const [{ value }, { error }] = useField<CommonLink[]>(props.name);
  const formik = useFormikContext();

  return (
    <LinksArray
      {...props}
      values={value}
      errors={error}
      touched={formik.touched[props.name] as FormikTouched<CommonLink>[]}
    />
  );
};

export default LinksArrayWrapper;
