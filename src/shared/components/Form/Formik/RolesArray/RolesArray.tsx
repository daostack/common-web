import React, { FC } from "react";
import {
  FieldArray,
  FieldArrayConfig,
  FormikErrors,
  FormikTouched,
} from "formik";
import { Role, Roles } from "@/shared/models";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import styles from "./RolesArray.module.scss";

type Errors = string | string[] | FormikErrors<string[]> | undefined;
type Touched = FormikTouched<Roles>[] | undefined;

export interface RolesArrayProps extends FieldArrayConfig {
  values: Roles;
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
            {values?.map((role, index) => {
              return (
                <div className={styles.roleField}>
                  <TextField
                    key={index}
                    id={`${restProps.name}.${index}.circleName`}
                    name={`${restProps.name}.${index}.circleName`}
                    label={index === 0 ? title : ""}
                    value={role.circleName}
                    placeholder="Role title"
                  />
                  {/* {errors && <ErrorText>{errors}</ErrorText>} */}
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
