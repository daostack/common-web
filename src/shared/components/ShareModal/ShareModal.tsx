import React, { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Colors, ShareViewType } from "@/shared/constants";
import { ButtonIcon, SocialLinks, Loader } from "@/shared/components";
import CopyLinkIcon from "@/shared/icons/copyLink.icon";
import { copyToClipboard } from "@/shared/utils";
import { Modal } from "../Modal";
import "./index.scss";

interface ShareModalProps {
  isShowing: boolean;
  onClose: () => void;
  title?: string;
  type: ShareViewType.ModalDesktop | ShareViewType.ModalMobile;
  sourceUrl: string;
  isLoading: boolean;
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

  const handleCopyClick = () => {
    copyToClipboard(sourceUrl);
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
            {!isMobileModal && (
              <>
                <img
                  src="/assets/images/share-modal.svg"
                  alt="Share modal"
                  className="share-modal_image"
                />
                <div className="share-modal_title">{title}</div>
              </>
            )}
            <SocialLinks
              shareViewType={type}
              sourceUrl={sourceUrl}
              isLoading={isLoading}
              linkText={linkText}
            />
            <div className="share-modal_copy-link">
              <p className="copy-link-field">{sourceUrl}</p>
              <ButtonIcon
                className="share-modal__copy-button"
                onClick={handleCopyClick}
              >
                <CopyLinkIcon />
              </ButtonIcon>
            </div>
          </div>
        ))}
    </Modal>
  );
};

export default ShareModal;
