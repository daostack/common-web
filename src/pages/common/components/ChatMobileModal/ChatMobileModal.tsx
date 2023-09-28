import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { Image, Modal, ButtonIcon } from "@/shared/components";
import { Colors } from "@/shared/constants";
import { LongLeftArrowIcon } from "@/shared/icons";
import CloseIcon from "@/shared/icons/close.icon";
import { emptyFunction, isRTL } from "@/shared/utils";
import styles from "./ChatMobileModal.module.scss";

interface Styles {
  modal?: string;
  modalHeaderWrapper?: string;
  modalHeader?: string;
}

interface ChatMobileModalProps {
  title?: string;
  isShowing: boolean;
  hasCloseIcon?: boolean;
  hasBackButton?: boolean;
  onClose: () => void;
  commonName: string;
  commonImage: string;
  header?: ReactNode;
  styles?: Styles;
}

const closeIconSize = 12;

const ChatMobileModal: FC<ChatMobileModalProps> = (props) => {
  const {
    isShowing,
    hasCloseIcon,
    hasBackButton,
    onClose,
    commonName,
    commonImage,
    children,
    title,
    header,
    styles: outerStyles,
  } = props;

  return (
    <Modal
      className={classNames(outerStyles?.modal)}
      isShowing={isShowing}
      title={header}
      styles={{
        headerWrapper: outerStyles?.modalHeaderWrapper,
        header: classNames(styles.modalHeader, outerStyles?.modalHeader),
        content: styles.modalContent,
      }}
      onClose={emptyFunction}
      hideCloseButton
      isHeaderSticky={Boolean(header)}
      mobileFullScreen
    >
      {!header && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {hasBackButton && (
              <ButtonIcon onClick={onClose}>
                <LongLeftArrowIcon className={styles.backButtonIcon} />
              </ButtonIcon>
            )}
            <Image
              className={styles.image}
              src={commonImage}
              alt={`${commonName}'s image`}
              placeholderElement={null}
              aria-hidden
            />
            <p className={styles.commonName}>{commonName}</p>
          </div>
          {hasCloseIcon && (
            <CloseIcon
              width={closeIconSize}
              height={closeIconSize}
              fill={Colors.secondaryBlue}
            />
          )}
        </div>
      )}
      {title && (
        <p
          className={classNames(styles.title, {
            [styles.titleRTL]: isRTL(title),
          })}
        >
          {title}
        </p>
      )}
      {children}
    </Modal>
  );
};

export default ChatMobileModal;
