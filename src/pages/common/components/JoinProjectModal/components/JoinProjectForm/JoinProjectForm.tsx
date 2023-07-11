import React, { FC, PropsWithChildren, useState, ChangeEvent } from "react";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import styles from "./JoinProjectForm.module.scss";

interface JoinProjectFormProps {
  onClose: () => void;
  requestToJoin: (message: string) => void;
  isJoinMemberAdmittanceRequest: boolean;
}

const JoinProjectForm: FC<PropsWithChildren<JoinProjectFormProps>> = (
  props,
) => {
  const { onClose, requestToJoin, isJoinMemberAdmittanceRequest } = props;
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
      <p className={styles.title}>Space membership intro</p>
      <textarea
        className={styles.input}
        value={message}
        onChange={handleChangeMessage}
        placeholder="Here is the place to introduce yourself in the context of this space"
      />
      <div className={styles.buttonContainer}>
        <Button variant={ButtonVariant.OutlineDarkPink} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={ButtonVariant.PrimaryPink}
          disabled={!message}
          onClick={handleRequestToJoin}
        >
          {isJoinMemberAdmittanceRequest ? "Request to join" : "Join space"}
        </Button>
      </div>
    </>
  );
};

export default JoinProjectForm;
