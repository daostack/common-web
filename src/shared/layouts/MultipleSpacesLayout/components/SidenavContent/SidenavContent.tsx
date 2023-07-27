import React, { FC } from "react";
import classNames from "classnames";
import {
  Projects,
  ProjectsRef,
} from "../../../CommonSidenavLayout/components/SidenavContent/components";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <Projects />
    </div>
  );
};

export default SidenavContent;
