import React from "react";
import { Modal } from "@/shared/components";

interface AssignCircleModalProps {
  isShowing: boolean;
  onClose: () => void;
}
export default function AssignCircleModal({
  isShowing,
  onClose,
}: AssignCircleModalProps) {
  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      <div>Are you sure?</div>
    </Modal>
  );
}
