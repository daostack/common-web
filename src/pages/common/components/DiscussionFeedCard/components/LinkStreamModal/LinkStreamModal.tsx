import React, { FC, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Modal } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import { useStreamLinking } from "@/shared/hooks/useCases";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { LinkStreamProjects } from "./components";
import styles from "./LinkStreamModal.module.scss";

interface LinkStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedItemId: string;
  title: string;
  rootCommonId: string;
  commonId: string;
  originalCommonId: string;
  linkedCommonIds?: string[];
  circleVisibility: string[];
}

const LinkStreamModal: FC<LinkStreamModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    feedItemId,
    title,
    rootCommonId,
    commonId,
    originalCommonId,
    linkedCommonIds = [],
    circleVisibility,
  } = props;
  const { notify } = useNotification();
  const { isStreamLinking, isStreamLinked, linkStream } = useStreamLinking();
  const [activeItemId, setActiveItemId] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const handleSubmit = () => {
    if (!userId) {
      return;
    }

    linkStream({
      userId,
      feedObjectId: feedItemId,
      sourceCommonId: commonId,
      targetCommonId: activeItemId,
    });
  };

  const renderContent = (): ReactElement => {
    if (isStreamLinking) {
      return <Loader className={styles.loader} />;
    }

    return (
      <>
        <LinkStreamProjects
          rootCommonId={rootCommonId}
          commonId={commonId}
          activeItemId={activeItemId}
          onActiveItemId={setActiveItemId}
          originalCommonId={originalCommonId}
          linkedCommonIds={linkedCommonIds}
          circleVisibility={circleVisibility}
        />
        <div className={styles.submitButtonWrapper}>
          <Button
            className={styles.submitButton}
            variant={ButtonVariant.PrimaryPink}
            disabled={!activeItemId}
            onClick={handleSubmit}
          >
            Apply
          </Button>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (isStreamLinked) {
      notify("Stream is successfully linked");
      onClose();
    }
  }, [isStreamLinking, isStreamLinked]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isStreamLinking ? emptyFunction : onClose}
      title={`Link “${title}“`}
      isHeaderSticky
      hideCloseButton={isStreamLinking}
      mobileFullScreen
      styles={{
        header: styles.modalHeader,
        title: styles.modalTitle,
        content: styles.modalContent,
        closeWrapper: styles.modalCloseWrapper,
      }}
    >
      {renderContent()}
    </Modal>
  );
};

export default React.memo(LinkStreamModal);
