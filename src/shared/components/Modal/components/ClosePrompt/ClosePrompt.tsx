import React from "react";
import "./index.scss";

interface IProps {
  onClose: () => void;
  onContinue: () => void;
}

/**
 * In the future we can support passing any content to the ClosePrompt component.
 */

export default function ClosePrompt({ onClose, onContinue }: IProps) {
  return (
    <div className="close-prompt-wrapper">
      <div className="content">
        <img src="/assets/images/floppy-disk.svg" alt="floppy disk" />
        <h4>Unsaved changes</h4>
        <span>You are about to leave this page, your changes will not be saved.</span>
        <button className="button-blue transparent leave" onClick={onClose}>Leave without saving</button>
        <button className="button-blue transparent" onClick={onContinue}>Continue editing</button>
      </div>
    </div>
  );
}
