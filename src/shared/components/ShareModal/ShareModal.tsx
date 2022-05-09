import React, { FC, PropsWithChildren, useMemo } from "react";
import classNames from "classnames";
import { Colors, ShareViewType } from "@/shared/constants";
import { SocialLinks, Loader } from "@/shared/components";
import { Modal } from "../Modal";
import "./index.scss";

interface ShareModalProps {
  isShowing: boolean;
  onClose: () => void;
  title?: string;
  type: (ShareViewType.modalDesktop | ShareViewType.modalMobile);
  sourceUrl: string;
  isLoading: boolean;
  linkText?: string;
}

const ShareModal: FC<PropsWithChildren<ShareModalProps>> = (
  {
    children,
    isShowing,
    onClose,
    type,
    title = "Share with",
    sourceUrl,
    isLoading,
    linkText,
  }
) => {
  const isMobileModal = useMemo(() => (type === ShareViewType.modalMobile), [type]);

  return (
    <Modal
      className={classNames(
        "share-modal__wrapper",
        {
          mobile: isMobileModal,
        }
      )}
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
      {
        children
        || (
          isLoading
            ? <Loader />
            : (
              <div
                  className={classNames(
                    "share-modal__wrapper-content",
                    {
                      mobile: isMobileModal,
                      desktop: !isMobileModal,
                    }
                  )}
              >
                {
                  !isMobileModal && (
                    <>
                      <img
                        src="/assets/images/share-modal.svg"
                        alt="Share modal"
                        className="share-modal_image"
                      />
                      <div className="share-modal_title">{title}</div>
                    </>
                  )
                }
                <SocialLinks
                  shareViewType={type}
                  sourceUrl={sourceUrl}
                  isLoading={isLoading}
                  linkText={linkText}
                />
                {
                  !isMobileModal
                  && <div className="share-modal_copy-link">
                    Copy
                    <p className="copy-link-field">{sourceUrl}</p>
                  </div>
                }
              </div>
            )
        )
      }
    </Modal>
  );
};

export default ShareModal;
