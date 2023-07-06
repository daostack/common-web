import React, { FC } from "react";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useAuthorizedModal } from "@/shared/hooks";
import { NoCommonsInfo } from "./components";

interface CreateCommonPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCommonPrompt: FC<CreateCommonPromptProps> = (props) => {
  const { isOpen, onClose } = props;
  const {
    isModalOpen: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useAuthorizedModal();

  const handleCreateCommonModalOpen = () => {
    onCreateCommonModalOpen();
  };

  const handleGoToCommon = () => {
    console.log("handleGoToCommon");
  };

  if (isCreateCommonModalOpen) {
    return (
      <CreateCommonModal
        isShowing={isCreateCommonModalOpen}
        onClose={onCreateCommonModalClose}
        isSubCommonCreation={false}
        onGoToCommon={handleGoToCommon}
      />
    );
  }

  return (
    <NoCommonsInfo
      isOpen={isOpen}
      onClose={onClose}
      onCommonCreate={handleCreateCommonModalOpen}
    />
  );
};

export default CreateCommonPrompt;
