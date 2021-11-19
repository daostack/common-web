import React, { FC } from "react";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";

import { TextField } from "../TextField";
import "./index.scss";

export interface LinksArrayItem {
  title: string;
  link: string;
}

interface LinksArrayProps extends FieldArrayConfig {
  values: LinksArrayItem[];
  errors?: string | string[] | FormikErrors<LinksArrayItem[]>;
  maxTitleLength?: number;
}

const LinksArray: FC<LinksArrayProps> = ({ values, errors, maxTitleLength, ...restProps }) => {
  return (
    <FieldArray
      {...restProps}
      render={({ insert, remove, push }) => (
        <div className="links-array">
          {values.map((value, index) => (
            <div key={index}>
              <TextField
                id={`${restProps.name}.${index}.title`}
                name={`${restProps.name}.${index}.title`}
                label="Add links"
                placeholder="Link Title"
                maxLength={maxTitleLength}
                hint="Resources, related content, or social pages"
                styles={{
                  input: {
                    default: "links-array__title-input",
                  },
                }}
              />
              <TextField
                id={`${restProps.name}.${index}.link`}
                name={`${restProps.name}.${index}.link`}
                placeholder={`Link #${index + 1}`}
                styles={{
                  input: {
                    default: "links-array__link-input",
                  },
                }}
              />
            </div>
          ))}
          <button>Add Link</button>
        </div>
      )}
    />
  );
};

export default LinksArray;
