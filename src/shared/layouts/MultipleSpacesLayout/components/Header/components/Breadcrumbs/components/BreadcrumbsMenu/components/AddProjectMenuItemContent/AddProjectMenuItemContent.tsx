import React, { FC } from "react";
import { BoldPlusIcon } from "@/shared/icons";
import styles from "./AddProjectMenuItemContent.module.scss";

interface AddProjectMenuItemContentProps {
  text: string;
}

const AddProjectMenuItemContent: FC<AddProjectMenuItemContentProps> = (
  props,
) => {
  const { text } = props;

  return (
    <>
      <BoldPlusIcon className={styles.icon} />
      {text}
    </>
  );
};

export default AddProjectMenuItemContent;
