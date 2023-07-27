import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import { closeSidenav } from "@/shared/utils";
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
      <ButtonIcon className={styles.closeIconWrapper} onClick={closeSidenav}>
        <Close2Icon />
      </ButtonIcon>
      <Projects />
    </div>
  );
};

export default SidenavContent;
