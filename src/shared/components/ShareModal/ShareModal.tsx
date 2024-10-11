import React, { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import copyToClipboard from "copy-to-clipboard";
import { ButtonIcon, SocialLinks, Loader } from "@/shared/components";
import { ShareViewType } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CopyLinkChainIcon } from "@/shared/icons";
import { Modal } from "../Modal";
import "./index.scss";

interface ShareModalProps {
  isShowing: boolean;
  onClose: () => void;
  title?: string;
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
    title = t("title"),
    sourceUrl,
    isLoading,
    linkText,
  } = props;
  const isTabletView = useIsTabletView();
  const { notify } = useNotification();

  const handleCopyClick = () => {
    copyToClipboard(sourceUrl);
    notify("The link has been copied!");
  };

  return (
    <Modal
      className={classNames("share-modal__wrapper", {
        mobile: isTabletView,
      })}
      isShowing={isShowing}
      onClose={onClose}
      title={isTabletView && title}
      styles={{
        header: "share-modal__wrapper-header",
        content: isTabletView ? "share-modal__wrapper-content-mobile" : "",
      }}
    >
      {children ||
        (isLoading ? (
          <Loader />
        ) : (
          <div
            className={classNames("share-modal__wrapper-content", {
              mobile: isTabletView,
              desktop: !isTabletView,
            })}
          >
            {!isTabletView && <div className="share-modal_title">{title}</div>}
            <SocialLinks
              shareViewType={
                isTabletView
                  ? ShareViewType.ModalMobile
                  : ShareViewType.ModalDesktop
              }
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
