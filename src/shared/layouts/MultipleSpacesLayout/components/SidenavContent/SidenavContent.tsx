import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import {
  Projects,
  ProjectsRef,
} from "../../../CommonSidenavLayout/components/SidenavContent/components";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
  onClose?: () => void;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className, onClose } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <ButtonIcon className={styles.closeIconWrapper} onClick={onClose}>
        <Close2Icon />
      </ButtonIcon>
      <Projects />
    </div>
  );
};

export default SidenavContent;
