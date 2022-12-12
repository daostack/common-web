import React, { FC } from "react";
import classNames from "classnames";
import { ViewportBreakpointVariant } from "@/shared/constants";
import styles from "./Container.module.scss";

const DEFAULT_VIEWPORTS: ViewportBreakpointVariant[] = [
  ViewportBreakpointVariant.Desktop,
  ViewportBreakpointVariant.Laptop,
  ViewportBreakpointVariant.Tablet,
  ViewportBreakpointVariant.PhoneOriented,
  ViewportBreakpointVariant.Phone,
];

export interface ContainerProps {
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  withMaxWidth?: boolean;
  viewports?: ViewportBreakpointVariant[];
}

const Container: FC<ContainerProps> = (props) => {
  const {
    className,
    children,
    tag: Tag = "div",
    withMaxWidth = true,
    viewports = DEFAULT_VIEWPORTS,
  } = props;
  const classNameWithMaxWidth = classNames({
    [styles.desktopContainer]: viewports.includes(
      ViewportBreakpointVariant.Desktop,
    ),
    [styles.laptopContainer]: viewports.includes(
      ViewportBreakpointVariant.Laptop,
    ),
    [styles.tabletContainer]: viewports.includes(
      ViewportBreakpointVariant.Tablet,
    ),
    [styles.phoneOrientatedContainer]: viewports.includes(
      ViewportBreakpointVariant.PhoneOriented,
    ),
    [styles.phoneContainer]: viewports.includes(
      ViewportBreakpointVariant.Phone,
    ),
  });

  return (
    <Tag
      className={classNames(styles.container, className, {
        [classNameWithMaxWidth]: withMaxWidth,
      })}
    >
      {children}
    </Tag>
  );
};

export default Container;
