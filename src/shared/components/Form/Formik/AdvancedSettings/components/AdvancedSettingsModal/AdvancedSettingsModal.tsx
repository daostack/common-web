import React, { FC } from "react";
import { Modal } from "@/shared/components/Modal";
import { Circles, Roles } from "@/shared/models";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootCommonCircles: Circles;
}

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, rootCommonCircles } = props;

  console.log(rootCommonCircles);

  return (
    <Modal title="Advanced settings" isShowing={isOpen} onClose={onClose}>
      AdvancedSettings
    </Modal>
  );
};

export default AdvancedSettingsModal;
