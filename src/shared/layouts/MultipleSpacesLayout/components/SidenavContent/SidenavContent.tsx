import React, { FC, ReactNode, useCallback } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Projects } from "../../../CommonSidenavLayout/components/SidenavContent/components";
import useGoToCreateCommon from "../../hooks";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
  onClose?: () => void;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className, onClose } = props;
  const goToCreateCommon = useGoToCreateCommon();

  const renderNoItemsInfo = useCallback((): ReactNode => {
    return (
      <div className={styles.noCommonsInfoContainer}>
        <p className={styles.noCommonsText}>
          You do not have spaces yet. You might want to create a new common or
          ask your friends for the link to an existing one.
        </p>
        <Button
          className={styles.createCommonButton}
          variant={ButtonVariant.PrimaryPink}
          onClick={goToCreateCommon}
        >
          Create common
        </Button>
      </div>
    );
  }, []);

  return (
    <div className={classNames(styles.container, className)}>
      <ButtonIcon className={styles.closeIconWrapper} onClick={onClose}>
        <Close2Icon />
      </ButtonIcon>
      <Projects
        renderNoItemsInfo={renderNoItemsInfo}
        onCommonCreationClick={goToCreateCommon}
      />
    </div>
  );
};

export default SidenavContent;
