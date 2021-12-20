import React, { useState, ChangeEventHandler, ReactElement, useMemo } from "react";
import classNames from "classnames";
import { FilePreview } from "../FilePreview";
import { FilePreviewCompact } from "../FilePreviewCompact";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface AddInvoicesProps {
  className?: string;
}

/**
 * TODO:
 * - Need to include the amount of each invoice in the files array
 * - Need to write a delete function from the array by index or a special indetifier
 */
export default function AddInvoices(props: AddInvoicesProps): ReactElement {
  const { className } = props;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);

  console.log(selectedFiles);

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelectedFiles((selectedFiles) => [
      ...selectedFiles,
      ...(event.target.files ? Array.from(event.target.files) : []),
    ]);
    setShowFilePreview(true);
  };

  const uploadedInvoices = useMemo(() => selectedFiles.map((file: any, index: number) => {
    return <FilePreviewCompact key={index} file={file} />
  }), [selectedFiles])

  return (
    <div className={classNames("add-invoices-wrapper", className)}>
      <div className="invoices-container">
        <label className="add-invoice-button">
          {/* multiple */}
          <input type="file" onChange={selectFiles} accept={ACCEPTED_EXTENSIONS} />
          <img src="/icons/upload-file.svg" alt="upload file" />
          Add Invoices
        </label>
        {uploadedInvoices}
      </div>
      {selectedFiles.length > 0 && (
        <div className="upload-wrapper">
          {showFilePreview && (
            <FilePreview
              file={selectedFiles[selectedFiles.length - 1]}
              onDelete={() => {
                setShowFilePreview(false);
                setSelectedFiles(selectedFiles.splice(0, selectedFiles.length - 1));
              }}
              onContinue={() => {
                setShowFilePreview(false);
              }}
            />)}
          <span>{`Total invoices amount: ???`}</span>
          <button
            className="button-blue"
            disabled={!selectedFiles}>
            Done with uploading all invoices
          </button>
        </div>
      )}
    </div>
  )
}
