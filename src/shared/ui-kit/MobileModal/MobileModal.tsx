import React, { FC, useEffect, useState } from "react";
import { useMeasure } from "react-use";
import { Image, Modal, ButtonIcon } from "@/shared/components";
import { Colors } from "@/shared/constants";
import { ArrowBackIcon } from "@/shared/icons";
import CloseIcon from "@/shared/icons/close.icon";
import { Common } from "@/shared/models";
import { emptyFunction } from "@/shared/utils";
import styles from "./MobileModal.module.scss";

interface MobileModalProps {
  title?: string;
  isShowing: boolean;
  hasCloseIcon?: boolean;
  hasBackButton?: boolean;
  onClose: () => void;
  common: Common;
}

const closeIconSize = 12;

const MIN_TITLE_HEIGHT = 59;
const TITLE_PADDING_SIZE = 40;

const MobileModal: FC<MobileModalProps> = (props) => {
  const {
    isShowing,
    hasCloseIcon,
    hasBackButton,
    onClose,
    common,
    children,
    title,
  } = props;
  const [titleHeight, setTitleHeight] = useState(title ? MIN_TITLE_HEIGHT : 0);
  const [titleRef, { height }] = useMeasure();

  useEffect(() => {
    if (height) {
      setTitleHeight(height + (title ? TITLE_PADDING_SIZE : 0));
    }
  }, [height, title]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
      onClose={emptyFunction}
      hideCloseButton
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {hasBackButton && (
              <ButtonIcon onClick={onClose}>
                <ArrowBackIcon className={styles.backButtonIcon} />
              </ButtonIcon>
            )}
            <Image
              className={styles.image}
              src={common.image}
              alt={`${common.name}'s image`}
              placeholderElement={null}
              aria-hidden
            />
            <p className={styles.commonName}>{common.name}</p>
          </div>
          {hasCloseIcon && (
            <CloseIcon
              width={closeIconSize}
              height={closeIconSize}
              fill={Colors.secondaryBlue}
            />
          )}
        </div>
        {title && (
          <p ref={titleRef as any} className={styles.title}>
            {title}
          </p>
        )}
        <div
          style={{
            maxHeight: `calc(100vh - 24px - 38px - ${titleHeight}px)`,
            width: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default MobileModal;
