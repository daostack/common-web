import React, { FC, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Modal } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import { useStreamMoving } from "@/shared/hooks/useCases";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { MoveStreamProjects } from "./components";
import styles from "./MoveStreamModal.module.scss";

interface MoveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedItemId: string;
  title: string;
  rootCommonId: string;
  commonId: string;
  originalCommonId: string;
  circleVisibility: string[];
}

const MoveStreamModal: FC<MoveStreamModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    feedItemId,
    title,
    rootCommonId,
    commonId,
    originalCommonId,
    circleVisibility,
  } = props;
  const { notify } = useNotification();
  const { isStreamMoving, isStreamMoved, moveStream } = useStreamMoving();
  const [activeItemId, setActiveItemId] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const handleSubmit = () => {
    if (!userId) {
      return;
    }

    moveStream({
      userId,
      feedObjectId: feedItemId,
      sourceCommonId: commonId,
      targetCommonId: activeItemId,
    });
  };

  const renderContent = (): ReactElement => {
    if (isStreamMoving) {
      return <Loader className={styles.loader} />;
    }

    return (
      <>
        <MoveStreamProjects
          rootCommonId={rootCommonId}
          commonId={commonId}
          activeItemId={activeItemId}
          onActiveItemId={setActiveItemId}
          originalCommonId={originalCommonId}
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
    if (isStreamMoved) {
      notify("Stream is successfully moved");
      onClose();
    }
  }, [isStreamMoving, isStreamMoved]);

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isStreamMoving ? emptyFunction : onClose}
      title={`Move “${title}“`}
      isHeaderSticky
      hideCloseButton={isStreamMoving}
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

export default React.memo(MoveStreamModal);
