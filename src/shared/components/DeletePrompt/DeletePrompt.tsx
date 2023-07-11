import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import "./index.scss";

interface DeletePromptProps {
  title?: string;
  description?: string;
  onCancel: () => void;
  onDelete: () => void;
  isDeletingInProgress?: boolean;
}

const DeletePrompt: FC<DeletePromptProps> = ({
  title = "Are you sure want to delete this?",
  description,
  onCancel,
  onDelete,
  isDeletingInProgress = false,
}) => {
  return (
    <div className="delete-prompt__wrapper">
      <div className="delete-prompt__title">{title}</div>
      {description ? (
        <div className="delete-prompt__description">{description}</div>
      ) : null}
      <div className="delete-prompt__buttons-wrapper">
        <Button
          disabled={isDeletingInProgress}
          onClick={onCancel}
          variant={ButtonVariant.OutlineDarkPink}
        >
          Cancel
        </Button>
        <Button
          disabled={isDeletingInProgress}
          onClick={onDelete}
          variant={ButtonVariant.PrimaryPink}
        >
          {!isDeletingInProgress ? "Delete" : "Deleting..."}
        </Button>
      </div>
    </div>
  );
};

export default DeletePrompt;
