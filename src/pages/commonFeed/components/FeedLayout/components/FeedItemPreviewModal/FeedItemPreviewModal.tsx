import React, { FC } from "react";
import { FeedItem } from "@/pages/common/components";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { Modal } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModalType, CloseIconVariant } from "@/shared/interfaces";
import { CommonFeed, Common, Governance } from "@/shared/models";
import styles from "./FeedItemPreviewModal.module.scss";

interface FeedItemPreviewModalProps {
  userCircleIds: string[];
  selectedFeedItem?: CommonFeed;
  common: Common;
  governance: Governance;
  isShowFeedItemDetailsModal?: boolean;
}

const FeedItemPreviewModal: FC<FeedItemPreviewModalProps> = (props) => {
  const {
    userCircleIds,
    selectedFeedItem,
    common,
    governance,
    isShowFeedItemDetailsModal,
  } = props;
  const isTabletView = useIsTabletView();
  const { setIsShowFeedItemDetailsModal } = useChatContext();

  const handleCloseModal = () => {
    setIsShowFeedItemDetailsModal && setIsShowFeedItemDetailsModal(false);
  };

  return (
    <Modal
      className={styles.modal}
      styles={{
        headerWrapper: styles.modalWrapper,
        header: styles.modalHeader,
        content: styles.modalContent,
        modalOverlay: styles.modalOverlay,
        modalWrapper: styles.modalWrapper,
      }}
      closeIconSize={16}
      isShowing={
        Boolean(isShowFeedItemDetailsModal) && Boolean(selectedFeedItem)
      }
      onClose={handleCloseModal}
      type={ModalType.MobilePopUp}
      closeIconVariant={CloseIconVariant.Thin}
    >
      {selectedFeedItem && (
        <FeedItem
          governanceId={governance.id}
          commonId={common.id}
          item={selectedFeedItem}
          governanceCircles={governance.circles}
          isMobileVersion={isTabletView}
          userCircleIds={userCircleIds}
          isPreviewMode
        />
      )}
    </Modal>
  );
};

export default FeedItemPreviewModal;
