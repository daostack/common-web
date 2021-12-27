import React from "react";
import "./index.scss";

interface IProps {
  onCancel: () => void
  onDelete: () => void
}

export default function DeletePrompt({ onCancel, onDelete }: IProps) {
  return (
    <div className="delete-prompt-wrapper">
      <span className="text">Are you sure want to delete this file?</span>
      <div className="buttons-wrapper">
        <button onClick={onCancel} className="button-blue transparent">Cancel</button>
        <button onClick={onDelete} className="button-blue delete">Delete</button>
      </div>
    </div>
  )
}
