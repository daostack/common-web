import React, { FC } from "react";
import classNames from "classnames";
import { UploadFilesStyles } from "../../types";
import styles from "./Header.module.scss";

interface HeaderProps {
  label?: string;
  hint?: string;
  optional?: boolean;
  styles?: UploadFilesStyles;
}

const Header: FC<HeaderProps> = (props) => {
  const { label, hint, optional = false, styles: outerStyles } = props;

  if (!label && !hint) {
    return null;
  }

  return (
    <div className={classNames(styles.labelWrapper, outerStyles?.labelWrapper)}>
      {label && (
        <label className={outerStyles?.label}>
          {label}
          {optional && <span className={styles.optionalHint}> (optional)</span>}
        </label>
      )}
      {hint && (
        <span className={classNames(styles.hint, outerStyles?.hint)}>
          {hint}
        </span>
      )}
    </div>
  );
};

export default Header;
