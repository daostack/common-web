import React from "react";
import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common } from "@/shared/models";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const AddDiscussionComponent = ({
  isShowing,
  onClose,
}: AddDiscussionComponentProps) => {
  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      kek
    </Modal>
  );
};

export default AddDiscussionComponent;
