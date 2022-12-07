import React, { FC } from "react";
import classNames from "classnames";
import { PlusIcon } from "@/shared/icons";
import styles from "./AddProjectButton.module.scss";

interface AddProjectButtonProps {
  text?: string;
  onClick?: () => void;
}

const AddProjectButton: FC<AddProjectButtonProps> = (props) => {
  const { text = "Add new project", onClick } = props;

  return (
    <button className={classNames(styles.item)} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <PlusIcon className={styles.icon} />
      </div>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default AddProjectButton;
