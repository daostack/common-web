import React, { FC } from "react";
import { FeedItem } from "@/pages/common";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { Modal } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ModalType, CloseIconVariant } from "@/shared/interfaces";
import { CommonFeed, Governance } from "@/shared/models";
import styles from "./FeedItemPreviewModal.module.scss";

interface FeedItemPreviewModalProps {
  userCircleIds: string[];
  selectedFeedItem?: CommonFeed;
  commonId: string;
  commonName: string;
  isProject: boolean;
  governance: Governance;
  isShowFeedItemDetailsModal?: boolean;
  sizeKey?: string;
}

const FeedItemPreviewModal: FC<FeedItemPreviewModalProps> = (props) => {
  const {
    userCircleIds,
    selectedFeedItem,
    commonId,
    commonName,
    isProject,
    governance,
    isShowFeedItemDetailsModal,
    sizeKey,
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
          commonId={commonId}
          commonName={commonName}
          isProject={isProject}
          item={selectedFeedItem}
          governanceCircles={governance.circles}
          isMobileVersion={isTabletView}
          userCircleIds={userCircleIds}
          isPreviewMode
          isActive
          sizeKey={sizeKey}
        />
      )}
    </Modal>
  );
};

export default FeedItemPreviewModal;
