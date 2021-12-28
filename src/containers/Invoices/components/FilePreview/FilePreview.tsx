import React, { useEffect, useState, ReactNode } from "react";
import { AmountPrompt } from "../AmountPrompt";
import classNames from "classnames";
import "./index.scss";

interface IProps {
  file: File;
  onContinue: (amount?: number) => void;
  topContent?: ReactNode;
}

export default function FilePreview({ file, onContinue, topContent }: IProps) {
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
        {topContent}
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
    </div>
  )
}
