import React, { useState, ReactElement } from "react";
import classNames from "classnames";
import { FilePreview } from "../FilePreview";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface AddInvoicesProps {
  className?: string;
}

export default function AddInvoices(props: AddInvoicesProps): ReactElement {
  const { className } = props;
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(undefined);
  const [showFilePreview, setShowFilePreview] = useState(false);

  const selectFiles = (event: any) => {
    setSelectedFiles(event.target.files);
    setShowFilePreview(true);
  };

  return (
    <div className={classNames("add-invoices-wrapper", className)}>
      <label className="add-invoice-button">
        {/* multiple */}
        <input type="file" onChange={selectFiles} accept={ACCEPTED_EXTENSIONS} />
        <img src="/icons/upload-file.svg" alt="upload file" />
        Add Invoices
      </label>
      {selectedFiles && (
        <div className="upload-wrapper">
          {showFilePreview && <FilePreview file={selectedFiles[0]} />}
          <button
            className="button-blue"
            disabled={!selectedFiles}>
            Done with uploading all invoices
          </button>
          <span>{`${selectedFiles.length} ${selectedFiles.length === 1 ? "invoice" : "invoices"}`}</span>
        </div>
      )}
    </div>
  )
}
