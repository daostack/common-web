import React, { FC, useState } from "react";
import { CommonMemberEvent, CommonMemberEventEmitter } from "@/events";
import { CommonService } from "@/services";
import volunteeringImageSrc from "@/shared/assets/images/volunteering.svg";
import { Image, Modal } from "@/shared/components";
import { Circle } from "@/shared/models";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import styles from "./LeaveCircleModal.module.scss";

interface LeaveCircleModalProps {
  circle: Circle;
  commonId: string;
  commonMemberId: string;
  isShowing: boolean;
  onClose: () => void;
}

const LeaveCircleModal: FC<LeaveCircleModalProps> = (props) => {
  const { circle, commonId, commonMemberId, isShowing, onClose } = props;
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    setIsLeaving(true);

    try {
      await CommonService.leaveCircle(commonId, circle.id);
      CommonMemberEventEmitter.emit(
        CommonMemberEvent.Reset,
        commonId,
        commonMemberId,
      );
      setIsLeaving(false);
    } catch (error) {
      setIsLeaving(false);
    }
  };

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      onClose={isLeaving ? emptyFunction : onClose}
      hideCloseButton={isLeaving}
    >
      <div className={styles.content}>
        <Image
          className={styles.image}
          src={volunteeringImageSrc}
          alt="Volunteering"
          placeholderElement={null}
          aria-hidden
        />
        <h2 className={styles.title}>
          Are you sure you want to leave {circle.name}?
        </h2>
        <p className={styles.description}>
          If you leave this circle, you might lose permissions associated with
          it and will no longer be able to participate in circle-specific
          private discussions.
        </p>
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonsWrapper}>
            <Button
              className={styles.button}
              variant={ButtonVariant.PrimaryGray}
              size={ButtonSize.Medium}
              onClick={onClose}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              className={`${styles.button} ${styles.confirmButton}`}
              variant={ButtonVariant.PrimaryPurple}
              size={ButtonSize.Medium}
              onClick={handleLeave}
              disabled={isLeaving}
            >
              Yes, leave circle
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveCircleModal;
