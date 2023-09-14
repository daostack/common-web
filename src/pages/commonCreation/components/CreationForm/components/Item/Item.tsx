import React, { FC } from "react";
import classNames from "classnames";
import { FieldArray } from "formik";
import {
  LinksArrayWrapper,
  TextEditor,
  TextField,
  UploadFiles,
} from "@/shared/components/Form/Formik";
import { CreationFormItemType } from "../../constants";
import { CreationFormItem } from "../../types";
import styles from "./Item.module.scss";

interface ItemProps {
  className?: string;
  item: CreationFormItem;
  disabled?: boolean;
}

const Item: FC<ItemProps> = (props) => {
  const { className: outerClassName, item, disabled } = props;
  const className = classNames(outerClassName, item.className);

  switch (item.type) {
    case CreationFormItemType.TextField:
      return (
        <TextField
          {...item.props}
          className={classNames(styles.textField, className)}
          styles={{
            ...item.props.styles,
            labelWrapper: classNames(
              styles.textFieldLabelWrapper,
              item.props.styles?.labelWrapper,
            ),
            hint: classNames(styles.textFieldHint, item.props.styles?.hint),
          }}
          disabled={disabled ?? item.props.disabled}
        />
      );
    case CreationFormItemType.TextEditor:
      return (
        <TextEditor
          {...item.props}
          className={className}
          disabled={disabled ?? item.props.disabled}
        />
      );
    case CreationFormItemType.UploadFiles:
      return (
        <UploadFiles
          {...item.props}
          className={className}
          disabled={disabled ?? item.props.disabled}
        />
      );
    case CreationFormItemType.Links:
      return (
        <LinksArrayWrapper
          {...item.props}
          className={className}
          labelClassName={classNames(
            styles.linksArrayWrapperLabel,
            item.props.labelClassName,
          )}
          hint={item.props.hint ?? ""}
          disabled={disabled ?? item.props.disabled}
        />
      );
    case CreationFormItemType.TextFieldArray:
      console.log(item);

      return (
        <>
          <FieldArray
            name="roles"
            render={() =>
              item.values.map((role, index) => (
                <TextField
                  key={`${role}_${index}`}
                  id={`${role}_${index}`}
                  name={`${role}_${index}`}
                  value={role}
                  className={classNames(styles.textField, className)}
                />
              ))
            }
          />
        </>
      );
    default:
      return null;
  }
};

export default Item;
