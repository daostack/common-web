import React, { FC } from "react";
import { ButtonLink } from "@/shared/components/ButtonLink";
import { useModal } from "@/shared/hooks";
import { AdvancedSettingsModal, ConfirmationModal } from "./components";

export interface AdvancedSettingsProps {
  name: string;
  parentCommonName?: string;
  shouldSaveChangesImmediately?: boolean;
}

const AdvancedSettings: FC<AdvancedSettingsProps> = (props) => {
  const { parentCommonName, shouldSaveChangesImmediately = false } = props;
  const {
    isShowing: isAdvancedSettingsModalOpen,
    onOpen: onAdvancedSettingsModalOpen,
    onClose: onAdvancedSettingsModalClose,
  } = useModal(false);
  const {
    isShowing: isConfirmationModalOpen,
    onOpen: onConfirmationModalOpen,
    onClose: onConfirmationModalClose,
  } = useModal(false);

  const handleAdvancedSettingsSubmit = () => {
    onAdvancedSettingsModalClose();

    if (shouldSaveChangesImmediately) {
      onConfirmationModalOpen();
    }
  };

  return (
    <>
      <ButtonLink onClick={onAdvancedSettingsModalOpen}>
        Advanced settings
      </ButtonLink>
      <AdvancedSettingsModal
        isOpen={isAdvancedSettingsModalOpen}
        onClose={onAdvancedSettingsModalClose}
        onSubmit={handleAdvancedSettingsSubmit}
        parentCommonName={parentCommonName}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={onConfirmationModalClose}
      />
    </>
  );
};

export default AdvancedSettings;
