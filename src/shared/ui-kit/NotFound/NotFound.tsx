import React, { FC } from "react";
import notFoundImageSrc from "@/shared/assets/images/not-found.svg";
import styles from "./NotFound.module.scss";

const NotFound: FC = () => {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={notFoundImageSrc}
        alt="Page not found"
      />
      <h1 className={styles.title}>404</h1>
      <p className={styles.description}>Page not found</p>
    </div>
  );
};

export default NotFound;
