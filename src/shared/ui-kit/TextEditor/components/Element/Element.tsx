import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
import { RenderElementProps } from "slate-react";
import { ElementType } from "../../constants";
import styles from "./Element.module.scss";

const Element: FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;
  const elementProps = {
    ...attributes,
    className: styles.element,
    style: {
      "--element-indent-level": element.indentLevel || 0,
    } as CSSProperties,
  };

  switch (element.type) {
    case ElementType.BulletedList:
      return (
        <ul
          {...elementProps}
          className={classNames(elementProps.className, styles.list)}
        >
          {children}
        </ul>
      );
    case ElementType.NumberedList:
      return (
        <ol
          {...elementProps}
          className={classNames(elementProps.className, styles.list)}
        >
          {children}
        </ol>
      );
    case ElementType.ListItem:
      return <li {...elementProps}>{children}</li>;
    default:
      return (
        <p
          {...elementProps}
          className={classNames(elementProps.className, styles.paragraph)}
        >
          {children}
        </p>
      );
  }
};

export default Element;
