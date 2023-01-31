import React, { FC } from "react";
import classNames from "classnames";
import { TextEditor, TextField } from "@/shared/components/Form/Formik";
import { CreationFormItemType } from "../../constants";
import { CreationFormItem } from "../../types";
import styles from "./Item.module.scss";

interface ItemProps {
  className?: string;
  item: CreationFormItem;
}

const Item: FC<ItemProps> = (props) => {
  const { className: outerClassName, item } = props;
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
        />
      );
    case CreationFormItemType.TextEditor:
      return <TextEditor {...item.props} className={className} />;
    default:
      return null;
  }
};

export default Item;
