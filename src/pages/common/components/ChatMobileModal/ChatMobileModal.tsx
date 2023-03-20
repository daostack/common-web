import React, {
  FC,
  LegacyRef,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { useMeasure } from "react-use";
import classNames from "classnames";
import { Image, Modal, ButtonIcon } from "@/shared/components";
import { Colors } from "@/shared/constants";
import { LongLeftArrowIcon } from "@/shared/icons";
import CloseIcon from "@/shared/icons/close.icon";
import { Common } from "@/shared/models";
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
  common: Common;
  header?: ReactNode;
  styles?: Styles;
}

const closeIconSize = 12;

const MIN_TITLE_HEIGHT = 59;
const TITLE_PADDING_SIZE = 40;
const HEADER_HEIGHT = 38;
const MODAL_TOP_PADDING = 24;

const ChatMobileModal: FC<ChatMobileModalProps> = (props) => {
  const {
    isShowing,
    hasCloseIcon,
    hasBackButton,
    onClose,
    common,
    children,
    title,
    header,
    styles: outerStyles,
  } = props;
  const [titleHeight, setTitleHeight] = useState(title ? MIN_TITLE_HEIGHT : 0);
  const [titleRef, { height }] = useMeasure();

  useEffect(() => {
    if (height) {
      setTitleHeight(height + (title ? TITLE_PADDING_SIZE : 0));
    }
  }, [height, title]);

  const childrenWrapper = useMemo(
    () => ({
      maxHeight: `calc(100vh - ${MODAL_TOP_PADDING}px - ${HEADER_HEIGHT}px - ${titleHeight}px)`,
      height: "100%",
      width: "100%",
    }),
    [titleHeight],
  );

  return (
    <Modal
      className={classNames(styles.modal, outerStyles?.modal)}
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
    >
      <div className={styles.content}>
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
        )}
        {title && (
          <p
            ref={titleRef as LegacyRef<HTMLDivElement>}
            className={classNames(styles.title, {
              [styles.titleRTL]: isRTL(title),
            })}
          >
            {title}
          </p>
        )}
        <div style={childrenWrapper}>{children}</div>
      </div>
    </Modal>
  );
};

export default ChatMobileModal;
