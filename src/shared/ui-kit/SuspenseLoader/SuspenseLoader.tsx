import React from 'react';
import { Loader, LoaderVariant } from "../Loader";
import styles from "./SuspenseLoader.module.scss";


export default (
    <div className={styles.container}>
        <div className={styles.loader}>
            <Loader variant={LoaderVariant.Big} />
        </div>
    </div>
);