import React, { FC } from "react";
import { RenderElementProps } from "slate-react";
import { ElementType } from "../../constants";
import styles from "./Element.module.scss";

const Element: FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case ElementType.BulletedList:
      return <ul {...attributes}>{children}</ul>;
    case ElementType.ListItem:
      return <li {...attributes}>{children}</li>;
    case ElementType.NumberedList:
      return <ol {...attributes}>{children}</ol>;
    default:
      return (
        <p {...attributes} className={styles.paragraph}>
          {children}
        </p>
      );
  }
};

export default Element;
