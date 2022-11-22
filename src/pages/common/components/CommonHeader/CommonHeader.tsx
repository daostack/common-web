import React, { FC } from "react";
import { KeyValuePairs } from "./components";
import styles from "./CommonHeader.module.scss";

interface CommonHeaderProps {
  commonSrc: string;
  commonName: string;
  description: string;
}

const CommonHeader: FC<CommonHeaderProps> = (props) => {
  const { commonSrc, commonName, description } = props;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <img
          className={styles.commonImage}
          src={commonSrc}
          alt={`${commonName}'s image`}
        />
        <div>
          <h1 className={styles.commonName}>{commonName}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </header>
      <KeyValuePairs />
    </section>
  );
};

export default CommonHeader;
