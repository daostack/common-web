import React, { FC } from "react";
import { Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import "./index.scss";

interface VotesModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  a?: number;
}

const VotesModal: FC<VotesModalProps> = (props) => {
  const { isShowing, onClose } = props;

  return (
    <Modal
      className="proposal-page-votes-modal"
      isShowing={isShowing}
      title={<h3 className="proposal-page-votes-modal__title">Votes</h3>}
      onClose={onClose}
      closePrompt={false}
      mobileFullScreen
      fullHeight
    >
      Content
    </Modal>
  );
};

export default VotesModal;
