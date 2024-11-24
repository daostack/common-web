import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal } from "@/shared/components";
import { Button } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath } from "@/shared/utils";
import { commonActions } from "@/store/states";
import styles from "./SuccessfulProjectCreationModal.module.scss";

interface SuccessfulProjectCreationModalProps {
  parentCommonId: string;
  commonId: string;
}

const SuccessfulProjectCreationModal: FC<
  SuccessfulProjectCreationModalProps
> = (props) => {
  const { parentCommonId, commonId } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClose = () => {
    dispatch(
      commonActions.setIsNewProjectCreated({ isCreated: false, commonId }),
    );
    history.push(getCommonPageAboutTabPath(parentCommonId));
  };

  const handleJumpToProject = () => {
    dispatch(
      commonActions.setIsNewProjectCreated({ isCreated: false, commonId }),
    );
  };

  return (
    <Modal
      className={styles.modal}
      isShowing
      onClose={handleClose}
      mobileFullScreen
    >
      <div className={styles.content}>
        <img
          className={styles.image}
          src="/assets/images/membership-request-created.svg"
          alt="Space created"
          aria-hidden
        />
        <h2 className={styles.title}>Successfully created a new space</h2>
        <p className={styles.description}>
          At any time you can add rules, tags, members to the space, etc
        </p>
        <Button className={styles.button} onClick={handleJumpToProject}>
          Jump to the space
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessfulProjectCreationModal;
