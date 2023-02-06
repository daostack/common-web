import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "@/shared/components";
import { Button } from "@/shared/ui-kit";
import { commonActions } from "@/store/states";
import styles from "./SuccessfulProjectCreationModal.module.scss";

const SuccessfulProjectCreationModal: FC = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
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
        <Button className={styles.button} onClick={handleClose}>
          Jump to the project
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessfulProjectCreationModal;
