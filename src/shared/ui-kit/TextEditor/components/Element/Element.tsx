import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
import { RenderElementProps, useSelected, useFocused } from "slate-react";
import { ElementType } from "../../constants";
import { Link } from "./components";
import { ElementAttributes } from "./types";
import { getElementTextDirection } from "./utils";
import styles from "./Element.module.scss";

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    backgroundColor: "#eee",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
    >
      @{element.character}
      {children}
    </span>
  );
};

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
    case ElementType.Heading:
      return (
        <h3
          {...elementProps}
          className={classNames(elementProps.className, styles.heading)}
        >
          {children}
        </h3>
      );
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
    case ElementType.Mention: {
      return <Mention {...props} />;
    }
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
