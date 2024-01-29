import React, { FC } from "react";
import { useField } from "formik";
import { ButtonLink } from "@/shared/components/ButtonLink";
import { useModal } from "@/shared/hooks";
import { Roles } from "@/shared/models";
import { AdvancedSettingsModal } from "./components";

export interface AdvancedSettingsProps {
  name: string;
  roles: Roles;
  rootCommonRoles: Roles;
}

const AdvancedSettings: FC<AdvancedSettingsProps> = (props) => {
  const { rootCommonRoles, roles } = props;
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
        roles={roles}
        rootCommonRoles={rootCommonRoles}
      />
    </>
  );
};

export default AdvancedSettings;
