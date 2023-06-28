import React, { FC } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers/CommonData/context";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit/Button";
import { CommonAvatar } from "@/shared/ui-kit/CommonAvatar";
import { KeyValueItem, KeyValuePairs } from "./components";
import styles from "./CommonHeader.module.scss";

interface CommonHeaderProps {
  commonImageSrc: string;
  commonName: string;
  description: string;
  details?: KeyValueItem[];
  isProject?: boolean;
  withJoin?: boolean;
  joinButtonText?: string;
}

const CommonHeader: FC<CommonHeaderProps> = (props) => {
  const {
    commonImageSrc,
    commonName,
    description,
    details = [],
    isProject = false,
    withJoin = true,
    joinButtonText = isProject ? "Join the space" : "Join the effort",
  } = props;
  const { isJoinAllowed, onJoinCommon } = useCommonDataContext();
  const isTabletView = useIsTabletView();
  const isJoinButtonVisible =
    !isTabletView && withJoin && !isProject && isJoinAllowed;
  const areItemsVisible = Boolean(details && details.length > 0);
  const commonImageClassName = classNames(styles.commonImage, {
    [styles.commonImageRounded]: isProject,
  });

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <CommonAvatar
          name={commonName}
          src={commonImageSrc}
          className={commonImageClassName}
        />

        <div className={styles.commonInfoWrapper}>
          <h1 className={styles.commonName} title={commonName}>
            {commonName}
          </h1>
          {description && (
            <p className={styles.description} title={description}>
              {description}
            </p>
          )}
        </div>
      </header>
      {(isJoinButtonVisible || areItemsVisible) && (
        <div className={styles.rightHalf}>
          {isJoinButtonVisible && (
            <Button
              className={classNames(styles.joinButton, {
                [styles.joinButtonWithMargin]: areItemsVisible,
              })}
              variant={ButtonVariant.OutlineBlue}
              size={ButtonSize.Medium}
              onClick={onJoinCommon}
            >
              {joinButtonText}
            </Button>
          )}
          {areItemsVisible && <KeyValuePairs items={details} />}
        </div>
      )}
    </section>
  );
};

export default CommonHeader;
