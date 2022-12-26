import React, { FC } from "react";
import { ElementType, FormatType } from "../../constants";
import { ElementButton } from "../ElementButton";
import { MarkButton } from "../MarkButton";
import styles from "./Toolbar.module.scss";

const Toolbar: FC = () => (
  <div className={styles.container}>
    <MarkButton format={FormatType.Bold} />
    <ElementButton elementType={ElementType.BulletedList} />
    <MarkButton format={FormatType.LeftIndent} />
    <MarkButton format={FormatType.RightIndent} />
  </div>
);

export default Toolbar;
