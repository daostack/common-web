import React, { FC } from "react";
import {
  FieldArray,
  FieldArrayConfig,
  FormikErrors,
  FormikTouched,
} from "formik";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import styles from "./RolesArray.module.scss";

type Errors = string | string[] | FormikErrors<string[]> | undefined;
type Touched = FormikTouched<string>[] | undefined;

export interface RolesArrayProps extends FieldArrayConfig {
  values: string[];
  errors: Errors;
  touched: Touched;
  title?: string;
  maxTitleLength?: number;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

const RolesArray: FC<RolesArrayProps> = (props) => {
  const {
    values,
    errors,
    title,
    maxTitleLength,
    className,
    itemClassName,
    labelClassName,
    disabled,
    ...restProps
  } = props;

  return (
    <FieldArray
      {...restProps}
      render={() => {
        return (
          <div>
            {values?.map((value, index) => {
              return (
                <div className={styles.roleField}>
                  <TextField
                    key={index}
                    id={`${restProps.name}.${index}`}
                    name={`${restProps.name}.${index}`}
                    label={index === 0 ? title : ""}
                    value={value}
                    placeholder="Role title"
                  />
                  {!value && <ErrorText>Error</ErrorText>}
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default RolesArray;
