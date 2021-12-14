import React, { useState } from "react";
import "./index.scss";

export default function AddInvoices() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(undefined);

  const selectFiles = (event: any) => {
    setSelectedFiles(event.target.files);
  };

  return (
    <div className="add-invoices-wrapper">
      <label className="add-invoice-button">
        <input type="file" multiple onChange={selectFiles} />
        <img src="/icons/upload-file.svg" alt="upload file" />
        Add Invoices
      </label>

      <div className="upload-wrapper">
        <button
          className="button-blue"
          disabled={!selectedFiles}>
          Upload
        </button>
        {selectedFiles && <span>{`${selectedFiles.length} ${selectedFiles.length === 1 ? "invoice" : "invoices"}`}</span>}
      </div>
    </div>
  )
}
