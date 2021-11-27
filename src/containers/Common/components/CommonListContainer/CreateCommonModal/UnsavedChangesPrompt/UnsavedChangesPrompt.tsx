import React, { ReactElement } from "react";

import "./index.scss";

interface IUnsavedChangesPrompt {
  setIsModalOpen: Function
  setShowUnsavedPrompt: Function
}

export default function UnsavedChangesPrompt(props: IUnsavedChangesPrompt): ReactElement {
  return (
    <div className="unsaved-changes-prompt-wrapper">
      <div className="content">
        <img src="/assets/images/unsaved-changes.svg"  alt="floppy disk" />
        <h4>Unsaved changes</h4>
        <span>You are about to leave this page, your changes will not be saved</span>
        <button onClick={() => props.setIsModalOpen(false)}>Leave without saving</button>
        <button onClick={() => props.setShowUnsavedPrompt(false)}>Continue editing</button>
      </div>
    </div>
  )
}
