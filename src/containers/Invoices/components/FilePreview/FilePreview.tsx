import React, { useEffect, useState } from "react";
import { AmountPrompt } from "../AmountPrompt";
import { DeletePrompt } from "../DeletePrompt";
import classNames from "classnames";
import "./index.scss";

interface IProps {
  file: any,
  onDelete: () => void
  onContinue: (amount: number | undefined) => void
}

export default function FilePreview({ file, onDelete, onContinue }: IProps) {
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showInsertAmountPrompt, setShowInsertAmountPrompt] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
    }
  }, []);

  const previewImageClassName = classNames({
    "preview-image": true,
    "shrink": showInsertAmountPrompt
  });

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        <div className="top">
          <img className="delete-invoice" src="/icons/trash.svg" alt="trash" onClick={() => setShowDeletePrompt(true)} />
        </div>
        <img className={previewImageClassName} src={URL.createObjectURL(file)} alt="preview" />
        <div className="bottom">
          {!showInsertAmountPrompt ? (
            <button
              className="button-blue"
              onClick={() => setShowInsertAmountPrompt(true)}>Add invoice amount</button>
          ) : (
            <AmountPrompt onContinue={onContinue} />
          )}
        </div>
      </div>
      {showDeletePrompt && <DeletePrompt onCancel={() => setShowDeletePrompt(false)} onDelete={() => onDelete()} />}
    </div>
  )
}
