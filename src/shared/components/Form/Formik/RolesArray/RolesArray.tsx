import React, { FC } from "react";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";

type Errors = string | string[] | FormikErrors<string[]> | undefined;

export interface RolesArrayProps extends FieldArrayConfig {
  values: string[];
  errors?: Errors;
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
    title = "Add links",
    maxTitleLength,
    className,
    itemClassName,
    labelClassName,
    disabled,
    ...restProps
  } = props;

  console.log(values);

  return (
    <FieldArray
      {...restProps}
      render={() => {
        //className={classNames("links-array", className)}
        return (
          <div>
            {values.map((value, index) => {
              // const titleError = isTouched(touched, index, "title")
              //   ? getInputError(errors, index, "title")
              //   : "";
              // const valueError = isTouched(touched, index, "value")
              //   ? getInputError(errors, index, "value")
              //   : "";
              // const error = titleError || valueError;
              // const shouldDisplayDeleteButton = values.length > 1;

              return (
                <TextField
                  key={index}
                  id={`${restProps.name}.${index}`}
                  name={`${restProps.name}.${index}`}
                  value={value}
                  placeholder="Role title"
                />

                // <div
                //   key={index}
                //   className={classNames("links-array__item", itemClassName)}
                // >
                //   <TextField
                //     id={`${restProps.name}.${index}.title`}
                //     name={`${restProps.name}.${index}.title`}
                //     label={index === 0 ? title : ""}
                //     placeholder="Link title"
                //     maxLength={maxTitleLength}
                //     hint={index === 0 ? hint : ""}
                //     disabled={disabled}
                //     styles={{
                //       label: labelClassName,
                //       input: {
                //         default: classNames("links-array__title-input", {
                //           "links-array__title-input--without-bottom-border":
                //             !titleError && valueError,
                //         }),
                //       },
                //       error: "links-array__title-error",
                //     }}
                //   />

                //   {/* {error && <ErrorText>{error}</ErrorText>} */}
                // </div>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default RolesArray;
