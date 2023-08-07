import React, { FC } from "react";
import { Loader } from "@/shared/ui-kit";
import styles from "./MobileLoader.module.scss";

const MobileLoader: FC = () => {
  return <Loader className={styles.loader} />;
};

export default MobileLoader;
