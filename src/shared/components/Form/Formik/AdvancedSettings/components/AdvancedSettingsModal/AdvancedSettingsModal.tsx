import React, { FC } from "react";
import { Modal } from "@/shared/components/Modal";
import { Roles } from "@/shared/models";

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Roles;
  rootCommonRoles: Roles;
}

const AdvancedSettingsModal: FC<AdvancedSettingsModalProps> = (props) => {
  const { isOpen, onClose, rootCommonRoles, roles } = props;

  console.log(roles);
  console.log(rootCommonRoles);

  return (
    <Modal title="Advanced settings" isShowing={isOpen} onClose={onClose}>
      AdvancedSettings
    </Modal>
  );
};

export default AdvancedSettingsModal;
