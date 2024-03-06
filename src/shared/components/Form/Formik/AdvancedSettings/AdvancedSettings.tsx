import React, { FC } from "react";
import { ButtonLink } from "@/shared/components/ButtonLink";
import { useModal } from "@/shared/hooks";
import { AdvancedSettingsModal } from "./components";

export interface AdvancedSettingsProps {
  name: string;
  parentCommonName?: string;
}

const AdvancedSettings: FC<AdvancedSettingsProps> = (props) => {
  const { parentCommonName } = props;

  const {
    isShowing: isAdvancedSettingsModalOpen,
    onOpen: onAdvancedSettingsModalOpen,
    onClose: onAdvancedSettingsModalClose,
  } = useModal(false);

  return (
    <>
      <ButtonLink onClick={onAdvancedSettingsModalOpen}>
        Advanced settings
      </ButtonLink>
      <AdvancedSettingsModal
        isOpen={isAdvancedSettingsModalOpen}
        onClose={onAdvancedSettingsModalClose}
        parentCommonName={parentCommonName}
      />
    </>
  );
};

export default AdvancedSettings;
