import React from "react";
import "./index.scss";

interface IProps {
  setShowClosePrompt: Function
  onClose: Function
}

/**
 * In the future we can support passing any content to the ClosePrompt component.
 */

export default function ClosePrompt({ setShowClosePrompt, onClose }: IProps) {
  return (
    <div className="close-prompt-wrapper">
      <div className="content">
        <img src="/assets/images/floppy-disk.svg" alt="floppy disk" />
        <h4>Unsaved changes</h4>
        <span>You are about to leave this page, your changes will not be saved.</span>
        <button className="button-blue transparent leave" onClick={() => { setShowClosePrompt(false); onClose(false) }}>Leave without saving</button>
        <button className="button-blue transparent" onClick={() => setShowClosePrompt(false)}>Continue editing</button>
      </div>
    </div>
  )
}
