import React from "react";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import "./index.scss";

interface IProps {
  onClose: () => void;
  onContinue: () => void;
}

export default function ClosePrompt({ onClose, onContinue }: IProps) {
  return (
    <div className="close-prompt-wrapper">
      <div className="content">
        <img src="/assets/images/floppy-disk.svg" alt="floppy disk" />
        <h4>Unsaved changes</h4>
        <span>
          You are about to leave this page, your changes will not be saved.
        </span>
        <div className="buttons-wrapper">
          <Button onClick={onContinue} variant={ButtonVariant.PrimaryPink}>
            Continue editing
          </Button>
          <Button onClick={onClose} variant={ButtonVariant.Warning}>
            Leave without saving
          </Button>
        </div>
      </div>
    </div>
  );
}
