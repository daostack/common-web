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
}

const SuccessfulProjectCreationModal: FC<
  SuccessfulProjectCreationModalProps
> = (props) => {
  const { parentCommonId } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClose = () => {
    dispatch(commonActions.setIsNewProjectCreated(false));
    history.push(getCommonPageAboutTabPath(parentCommonId));
  };

  const handleJumpToProject = () => {
    dispatch(commonActions.setIsNewProjectCreated(false));
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
          alt="Project created"
          aria-hidden
        />
        <h2 className={styles.title}>Successfully created a new project</h2>
        <p className={styles.description}>
          At any time you can add rules, tags, members to the project, etc
        </p>
        <Button className={styles.button} onClick={handleJumpToProject}>
          Jump to the project
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessfulProjectCreationModal;
