import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
import { RenderElementProps } from "slate-react";
import { ElementType } from "../../constants";
import { EditorElementStyles } from "../../types";
import { CheckboxItem, Link } from "./components";
import { ElementAttributes } from "./types";
import { getElementTextDirection } from "./utils";
import styles from "./Element.module.scss";

const Mention = ({ attributes, element, className, children }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.displayName.replace(" ", "-")}`}
      className={className}
    >
      @{element.displayName}
      {children}
    </span>
  );
};

const StreamMention = ({ attributes, element, className, children }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`stream-mention-${element.title.replace(" ", "-")}`}
      className={className}
    >
      @{element.title}
      {children}
    </span>
  );
};

const Element: FC<RenderElementProps & { styles?: EditorElementStyles }> = (
  props,
) => {
  const { attributes, children, element, styles: elementStyles } = props;
  const elementProps: ElementAttributes = {
    ...attributes,
    className: styles.element,
    style: {
      "--element-indent-level": element?.indentLevel || 0,
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
      return (
        <Mention
          {...props}
          className={classNames(styles.mention, elementStyles?.mention)}
        />
      );
    }
    case ElementType.StreamMention: {
      return (
        <StreamMention
          {...props}
          className={classNames(styles.mention, elementStyles?.mention)}
        />
      )
    }
    case ElementType.Emoji: {
      return (
        <span
          {...attributes}
          className={elementStyles?.emoji}
          contentEditable={false}
        >
          {element.emoji}
          {children}
        </span>
      );
    }
    case ElementType.CheckboxItem:
      return (
        <CheckboxItem attributes={elementProps} element={element}>
          {children}
        </CheckboxItem>
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
