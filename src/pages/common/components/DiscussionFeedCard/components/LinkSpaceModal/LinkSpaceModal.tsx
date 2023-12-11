import React, { FC, ReactElement } from "react";
import { Modal } from "@/shared/components";
import { Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { Projects } from "./components";
import styles from "./LinkSpaceModal.module.scss";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rootCommonId: string;
  commonId: string;
}

const LinkSpaceModal: FC<DirectMessageModalProps> = (props) => {
  const { isOpen, onClose, title, rootCommonId, commonId } = props;
  const isSpaceLinkingLoading = false;

  const renderContent = (): ReactElement => {
    if (isSpaceLinkingLoading) {
      return <Loader />;
    }

    return <Projects rootCommonId={rootCommonId} commonId={commonId} />;
  };

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isSpaceLinkingLoading ? emptyFunction : onClose}
      title={`Link ${title}`}
      isHeaderSticky
      hideCloseButton={isSpaceLinkingLoading}
      mobileFullScreen
      styles={{
        header: styles.modalHeader,
        title: styles.modalTitle,
        content: styles.modalContent,
        closeWrapper: styles.modalCloseWrapper,
      }}
    >
      <div className={styles.content}>{renderContent()}</div>
    </Modal>
  );
};

export default LinkSpaceModal;
