import React, { FC } from "react";
import { Link4Icon } from "@/shared/icons";
import styles from "./LinkedItemMark.module.scss";

interface LinkedItemMarkProps {
  a?: boolean;
}

const LinkedItemMark: FC<LinkedItemMarkProps> = (props) => {
  const { a } = props;

  return <Link4Icon className={styles.linkIcon} />;
};

export default LinkedItemMark;
