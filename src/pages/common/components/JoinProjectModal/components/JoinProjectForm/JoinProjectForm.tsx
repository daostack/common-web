import React, { FC, PropsWithChildren, useState, ChangeEvent } from "react";
import { Button } from "@/shared/components";
import styles from "./JoinProjectForm.module.scss";

interface JoinProjectFormProps {
  onClose: () => void;
  requestToJoin: (message: string) => void;
}

const JoinProjectForm: FC<PropsWithChildren<JoinProjectFormProps>> = (
  props,
) => {
  const { onClose, requestToJoin } = props;
  const [message, setMessage] = useState("");

  const handleChangeMessage = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMessage(event.target.value);
  };

  const handleRequestToJoin = () => {
    requestToJoin(message);
  };

  return (
    <>
      <p className={styles.title}>Project membership intro</p>
      <textarea
        className={styles.input}
        value={message}
        onChange={handleChangeMessage}
        placeholder="Here is the place to introduce yourself in the context of this project"
      />
      <div className={styles.buttonContainer}>
        <Button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!message}
          className={styles.confirmButton}
          onClick={handleRequestToJoin}
        >
          Request to join
        </Button>
      </div>
    </>
  );
};

export default JoinProjectForm;
