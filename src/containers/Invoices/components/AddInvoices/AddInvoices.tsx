import React, { useState, ChangeEventHandler, ReactElement, useMemo, useCallback } from "react";
import classNames from "classnames";
import { FilePreview } from "../FilePreview";
import { InvoiceTile, InvoiceTileVariant } from "../../../../shared/components";
import { useSelector } from "react-redux";
import { getScreenSize } from "../../../../shared/store/selectors";
import { ScreenSize } from "../../../../shared/constants";
import { formatPrice } from "../../../../shared/utils";
import { DeletePrompt } from "../DeletePrompt";
import { UploadPrompt } from "../UploadPrompt";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface AddInvoicesProps {
  proposalRequest: number | undefined
  className?: string;
}

interface IFile {
  data: File | [];
  amount: number
}

export default function AddInvoices(props: AddInvoicesProps): ReactElement {
  const { className, proposalRequest } = props;
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const totalAmount = selectedFiles.map((file: IFile) => file.amount).reduce((a: number, b: number) => a + b, 0);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedInvoiceIndexToDelete, setSelectedInvoiceIndexToDelete] = useState<number | undefined>(undefined);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelectedFiles((selectedFiles: IFile[]) => [
      ...selectedFiles,
      { data: event.target.files ? event.target.files[0] : [], amount: 0 }
    ])
    setShowFilePreview(true);
  };

  const removeInvoice = useCallback((indexToRemove: number) => {
    return selectedFiles.filter((file: IFile, index: number) =>
      index !== indexToRemove
    );
  }, [selectedFiles]);

  const uploadedInvoices = useMemo(() => selectedFiles.map((file: any, index: number) => {
    return (
      <InvoiceTile
        key={index}
        imageSrc={URL.createObjectURL((file as any).data)}
        alt={file.data.name}
        amount={file.amount * 100}
        onDelete={() => { setShowDeletePrompt(true); setSelectedInvoiceIndexToDelete(index); }}
        variant={screenSize === ScreenSize.Mobile ? InvoiceTileVariant.FullWidth : InvoiceTileVariant.Square} />)
  }), [selectedFiles, screenSize])

  return (
    <div className={classNames("add-invoices-wrapper", className)}>
      <div className="invoices-container">
        <label className="add-invoice-button">
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
              file={selectedFiles[selectedFiles.length - 1].data}
              onDelete={() => {
                setShowFilePreview(false);
                setSelectedFiles(removeInvoice(selectedFiles.length - 1));
              }}
              onContinue={(amount: number | undefined) => {
                setShowFilePreview(false);
                setSelectedFiles((selectedFiles: IFile[]) => [
                  ...selectedFiles.splice(0, selectedFiles.length - 1),
                  { ...selectedFiles[selectedFiles.length - 1], amount: Number(amount) }
                ])
              }} />)}
          <span className="add-invoices__total-amount-label">{`Total invoices amount: ${formatPrice(totalAmount * 100)}`}</span>
          <button
            className="button-blue"
            disabled={!selectedFiles}
            onClick={() => setShowUploadPrompt(true)}>
            Done with uploading all invoices
          </button>
        </div>
      )}
      {showDeletePrompt && (
        <DeletePrompt
          onCancel={() => setShowDeletePrompt(false)}
          onDelete={() => { setSelectedFiles(removeInvoice(selectedInvoiceIndexToDelete as number)); setShowDeletePrompt(false); }} />
      )}
      {showUploadPrompt && (
        <UploadPrompt
          onUpload={() => { return; }}
          onCancel={() => setShowUploadPrompt(false)}
          invoicesTotal={formatPrice(totalAmount * 100)}
          proposalRequest={formatPrice(proposalRequest)} />
      )}
    </div>
  )
}
