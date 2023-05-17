import React, { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { ButtonIcon, SocialLinks, Loader } from "@/shared/components";
import { Colors, ShareViewType } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { CopyLinkChainIcon } from "@/shared/icons";
import { Modal } from "../Modal";
import "./index.scss";

interface ShareModalProps {
  isShowing: boolean;
  onClose: () => void;
  title?: string;
  type: ShareViewType.ModalDesktop | ShareViewType.ModalMobile;
  sourceUrl: string;
  isLoading?: boolean;
  linkText?: string;
}

const ShareModal: FC<PropsWithChildren<ShareModalProps>> = (props) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "share",
  });
  const {
    children,
    isShowing,
    onClose,
    type,
    title = t("title"),
    sourceUrl,
    isLoading,
    linkText,
  } = props;
  const isMobileModal = type === ShareViewType.ModalMobile;
  const { notify } = useNotification();

  const handleCopyClick = () => {
    copyToClipboard(sourceUrl);
    notify("The link has copied!");
  };

  return (
    <Modal
      className={classNames("share-modal__wrapper", {
        mobile: isMobileModal,
      })}
      isShowing={isShowing}
      onClose={onClose}
      title={isMobileModal && title}
      closeColor={Colors.black}
      closeIconSize={isMobileModal ? 16 : 20}
      styles={{
        header: "share-modal__wrapper-header",
        content: isMobileModal ? "share-modal__wrapper-content-mobile" : "",
      }}
    >
      {children ||
        (isLoading ? (
          <Loader />
        ) : (
          <div
            className={classNames("share-modal__wrapper-content", {
              mobile: isMobileModal,
              desktop: !isMobileModal,
            })}
          >
            {!isMobileModal && <div className="share-modal_title">{title}</div>}
            <SocialLinks
              shareViewType={type}
              sourceUrl={sourceUrl}
              isLoading={isLoading}
              linkText={linkText}
            />
            <button className="share-modal_copy-link" onClick={handleCopyClick}>
              <ButtonIcon className="share-modal__copy-button">
                <CopyLinkChainIcon />
              </ButtonIcon>
              <p className="share-modal_copy-link-text">Copy link</p>
            </button>
          </div>
        ))}
    </Modal>
  );
};

export default ShareModal;
