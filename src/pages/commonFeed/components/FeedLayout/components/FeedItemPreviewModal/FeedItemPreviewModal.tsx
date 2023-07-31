import React, { FC, useEffect, useState } from "react";
import { FeedItem } from "@/pages/common";
import { useChatContext } from "@/pages/common/components/ChatComponent";
import { Modal } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  ModalType,
  CloseIconVariant,
  FeedLayoutItemChangeData,
} from "@/shared/interfaces";
import { Circles, CommonFeed } from "@/shared/models";
import styles from "./FeedItemPreviewModal.module.scss";

interface FeedItemPreviewModalProps {
  userCircleIds: string[];
  selectedFeedItem?: CommonFeed;
  commonId: string;
  commonName: string;
  commonImage: string;
  isProject: boolean;
  governanceCircles?: Circles;
  isShowFeedItemDetailsModal?: boolean;
  sizeKey?: string;
  isMainModalOpen: boolean;
  seenOnce?: boolean;
  isLiveVoting?: boolean;
}

const FeedItemPreviewModal: FC<FeedItemPreviewModalProps> = (props) => {
  const {
    userCircleIds,
    selectedFeedItem,
    commonId,
    commonName,
    commonImage,
    isProject,
    governanceCircles,
    isShowFeedItemDetailsModal,
    sizeKey,
    isMainModalOpen,
    seenOnce,
    isLiveVoting,
  } = props;
  const isTabletView = useIsTabletView();
  const { setIsShowFeedItemDetailsModal } = useChatContext();
  const [title, setTitle] = useState("");

  const handleCloseModal = () => {
    setIsShowFeedItemDetailsModal && setIsShowFeedItemDetailsModal(false);
    setTitle("");
  };

  const handleActiveItemDataChange = (data: FeedLayoutItemChangeData) => {
    setTitle(data.title);
  };

  useEffect(() => {
    if (isMainModalOpen && (!seenOnce || isLiveVoting)) {
      setIsShowFeedItemDetailsModal?.(true);
    }
  }, [isMainModalOpen]);

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
        <>
          {title && <h3 className={styles.itemTitle}>{title}</h3>}
          <FeedItem
            commonId={commonId}
            commonName={commonName}
            commonImage={commonImage}
            isProject={isProject}
            item={selectedFeedItem}
            governanceCircles={governanceCircles}
            isMobileVersion={isTabletView}
            userCircleIds={userCircleIds}
            isPreviewMode
            isActive
            sizeKey={sizeKey}
            onActiveItemDataChange={handleActiveItemDataChange}
          />
        </>
      )}
    </Modal>
  );
};

export default FeedItemPreviewModal;
