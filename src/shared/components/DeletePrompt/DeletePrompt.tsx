import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface DeletePromptProps {
  onCancel: () => void;
  onDelete: () => void;
  isDeletingInProgress?: boolean;
}

const DeletePrompt: FC<DeletePromptProps> = (
  {
    onCancel,
    onDelete,
    isDeletingInProgress = false,
  }
) => {
  return (
    <div className="delete-prompt__wrapper">
      <span className="delete-prompt__title">Are you sure want to delete this?</span>
      <div className="delete-prompt__buttons-wrapper">
        <Button
          disabled={isDeletingInProgress}
          onClick={onCancel}
          variant={ButtonVariant.Secondary}
          className="button-blue transparent"
        >
          Cancel
        </Button>
        <Button
          disabled={isDeletingInProgress}
          onClick={onDelete}
          variant={ButtonVariant.Secondary}
          className="button-blue delete"
        >
          {
            !isDeletingInProgress ? "Delete" : "Deleting..."
          }
        </Button>
      </div>
    </div>
  )
}

export default DeletePrompt;
