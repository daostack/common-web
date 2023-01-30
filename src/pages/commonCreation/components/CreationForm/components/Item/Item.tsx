import React, { FC } from "react";
import classNames from "classnames";
import { TextField } from "@/shared/components/Form/Formik";
import { CreationFormItemType } from "../../constants";
import { CreationFormItem } from "../../types";

interface ItemProps {
  className?: string;
  item: CreationFormItem;
}

const Item: FC<ItemProps> = (props) => {
  const { className: outerClassName, item } = props;
  const className = classNames(outerClassName, item.className);

  switch (item.type) {
    case CreationFormItemType.TextField:
      return <TextField {...item.props} className={className} />;
    default:
      return null;
  }
};

export default Item;
