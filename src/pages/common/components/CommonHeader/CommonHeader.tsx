import React, { FC } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components/Image";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
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
  onJoin?: () => void;
}

const CommonHeader: FC<CommonHeaderProps> = (props) => {
  const {
    commonImageSrc,
    commonName,
    description,
    details = [],
    isProject = false,
    withJoin = true,
    joinButtonText = isProject ? "Join the project" : "Join the effort",
    onJoin,
  } = props;
  const isTabletView = useIsTabletView();
  const isJoinButtonVisible = !isTabletView && withJoin;
  const areItemsVisible = Boolean(details && details.length > 0);
  const commonImageClassName = classNames(styles.commonImage, {
    [styles.commonImageRounded]: isProject,
  });

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <Image
          className={commonImageClassName}
          src={commonImageSrc}
          alt={`${commonName}'s image`}
          placeholderElement={
            <div
              className={classNames(
                commonImageClassName,
                styles.commonImagePlaceholder,
              )}
            />
          }
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
              onClick={onJoin}
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
