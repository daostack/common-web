import React, { FC } from "react";
import { useModal } from "@/shared/hooks";
import { NoCommonsInfo } from "./components";

interface CreateCommonPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCommonPrompt: FC<CreateCommonPromptProps> = (props) => {
  const { isOpen, onClose } = props;
  const {
    isShowing: isNoCommonsInfoOpen,
    onOpen: onNoCommonsInfoOpen,
    onClose: onNoCommonsInfoClose,
  } = useModal(false);

  return <NoCommonsInfo isOpen={isOpen} onClose={onClose} />;
};

export default CreateCommonPrompt;
