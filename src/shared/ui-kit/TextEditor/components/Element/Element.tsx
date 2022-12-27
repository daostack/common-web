import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
import { RenderElementProps } from "slate-react";
import { ElementType } from "../../constants";
import { Link } from "./components";
import { ElementAttributes } from "./types";
import { getElementTextDirection } from "./utils";
import styles from "./Element.module.scss";

const Element: FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;
  const elementProps: ElementAttributes = {
    ...attributes,
    className: styles.element,
    style: {
      "--element-indent-level": element.indentLevel || 0,
    } as CSSProperties,
    dir: getElementTextDirection(element, attributes.dir),
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
      return (
        <li {...elementProps} dir={undefined}>
          {children}
        </li>
      );
    case ElementType.Link:
      return (
        <Link attributes={elementProps} element={element}>
          {children}
        </Link>
      );
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
