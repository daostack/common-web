import React, { FC } from "react";
import { ButtonLink } from "@/shared/components/ButtonLink";
import { useModal } from "@/shared/hooks";
import { Circles } from "@/shared/models";
import { AdvancedSettingsModal, ConfirmationModal } from "./components";

export interface AdvancedSettingsProps {
  name: string;
  governanceId?: string | null;
  governanceCircles?: Circles;
  parentCommonName?: string;
  shouldSaveChangesImmediately?: boolean;
}

const AdvancedSettings: FC<AdvancedSettingsProps> = (props) => {
  const {
    governanceId,
    governanceCircles,
    parentCommonName,
    shouldSaveChangesImmediately = false,
  } = props;
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

  const handleConfirmationModalClose = () => {
    onConfirmationModalClose();
    onAdvancedSettingsModalOpen();
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
        onClose={handleConfirmationModalClose}
        governanceId={governanceId}
        governanceCircles={governanceCircles}
      />
    </>
  );
};

export default AdvancedSettings;
