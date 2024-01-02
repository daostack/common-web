import React, { FC } from "react";
import classNames from "classnames";
import {
  LinksArrayWrapper,
  TextEditor,
  TextField,
  UploadFiles,
  RolesArrayWrapper,
  NotionIntegration,
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
    case CreationFormItemType.Roles:
      return (
        <RolesArrayWrapper
          {...item.props}
          className={className}
          labelClassName={classNames(
            styles.linksArrayWrapperLabel,
            item.props.labelClassName,
          )}
          disabled={disabled ?? item.props.disabled}
        />
      );
    case CreationFormItemType.NotionIntegration:
      return <NotionIntegration {...item.props} className={className} />;
    default:
      return null;
  }
};

export default Item;
