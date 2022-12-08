import React, { FC } from "react";
import classNames from "classnames";
import { PlusIcon } from "@/shared/icons";
import styles from "./AddProjectButton.module.scss";

interface AddProjectButtonProps {
  text?: string;
  onClick?: () => void;
  visuallyDisabled?: boolean;
}

const AddProjectButton: FC<AddProjectButtonProps> = (props) => {
  const { text = "Add new project", onClick, visuallyDisabled } = props;

  return (
    <button
      className={classNames(styles.item, {
        [styles.itemDisabled]: visuallyDisabled,
      })}
      aria-disabled={visuallyDisabled}
      onClick={visuallyDisabled ? undefined : onClick}
    >
      <div className={styles.iconWrapper}>
        <PlusIcon className={styles.icon} />
      </div>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default AddProjectButton;
