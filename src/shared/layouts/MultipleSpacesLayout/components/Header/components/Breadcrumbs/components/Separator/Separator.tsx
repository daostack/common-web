import React, { FC } from "react";
import { RightArrowThinIcon } from "@/shared/icons";
import styles from "./Separator.module.scss";

const Separator: FC = () => (
  <li className={styles.container}>
    <RightArrowThinIcon />
  </li>
);

export default Separator;
