import React, { FC } from "react";
import classNames from "classnames";
import { PlusIcon } from "@/shared/icons";
import styles from "./CreateCommonButton.module.scss";

interface CreateCommonButtonProps {
  className?: string;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CreateCommonButton: FC<CreateCommonButtonProps> = (props) => {
  const { className, text = "Create a Common", onClick, disabled } = props;

  return (
    <button
      className={classNames(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.iconWrapper}>
        <PlusIcon className={styles.plusIcon} />
      </div>
      <span className={styles.name}>{text}</span>
    </button>
  );
};

export default CreateCommonButton;
