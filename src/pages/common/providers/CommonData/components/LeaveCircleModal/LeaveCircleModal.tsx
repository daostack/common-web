import React, { FC } from "react";
import volunteeringImageSrc from "@/shared/assets/images/volunteering.svg";
import { Image, Modal } from "@/shared/components";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./LeaveCircleModal.module.scss";

interface LeaveCircleModalProps {
  isShowing: boolean;
  onClose: () => void;
}

const LeaveCircleModal: FC<LeaveCircleModalProps> = (props) => {
  const { isShowing, onClose } = props;

  return (
    <Modal className={styles.modal} isShowing={isShowing} onClose={onClose}>
      <div className={styles.content}>
        <Image
          className={styles.image}
          src={volunteeringImageSrc}
          alt="Volunteering"
          placeholderElement={null}
          aria-hidden
        />
        <h2 className={styles.title}>
          Are you sure you want to leave circle1?
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
            >
              Cancel
            </Button>
            <Button
              className={`${styles.button} ${styles.confirmButton}`}
              variant={ButtonVariant.PrimaryPurple}
              size={ButtonSize.Medium}
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
