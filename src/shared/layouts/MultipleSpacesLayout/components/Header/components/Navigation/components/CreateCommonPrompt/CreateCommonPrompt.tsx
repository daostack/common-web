import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { CreateCommonModal } from "@/pages/OldCommon/components";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { NoCommonsInfo } from "./components";

interface CreateCommonPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCommonPrompt: FC<CreateCommonPromptProps> = (props) => {
  const { isOpen, onClose } = props;
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const {
    isModalOpen: isCreateCommonModalOpen,
    onOpen: onCreateCommonModalOpen,
    onClose: onCreateCommonModalClose,
  } = useAuthorizedModal();
  const [createdCommon, setCreatedCommon] = useState<Common | null>(null);

  const handleClose = () => {
    if (createdCommon) {
      history.push(getCommonPagePath(createdCommon.id));
    }

    onClose();
  };

  const handleCommonCreate = (data: { common: Common }) => {
    setCreatedCommon(data.common);
  };

  const handleCreateCommonModalClose = () => {
    if (createdCommon) {
      handleClose();
    } else {
      onCreateCommonModalClose();
    }
  };

  if (isCreateCommonModalOpen) {
    return (
      <CreateCommonModal
        isShowing={isCreateCommonModalOpen}
        onClose={handleCreateCommonModalClose}
        isSubCommonCreation={false}
        onCommonCreate={handleCommonCreate}
        onGoToCommon={handleClose}
      />
    );
  }

  return (
    <NoCommonsInfo
      isOpen={isOpen}
      onClose={handleClose}
      onCommonCreate={onCreateCommonModalOpen}
    />
  );
};

export default CreateCommonPrompt;
