import React, { FC } from "react";
import { useField } from "formik";
import { ButtonLink } from "@/shared/components/ButtonLink";
import { useModal } from "@/shared/hooks";
import { Circles, Roles } from "@/shared/models";
import { AdvancedSettingsModal } from "./components";

export interface AdvancedSettingsProps {
  name: string;
}

const AdvancedSettings: FC<AdvancedSettingsProps> = (props) => {
  const [{ value }] = useField<Circles>(props.name);
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
        rootCommonCircles={value}
      />
    </>
  );
};

export default AdvancedSettings;
