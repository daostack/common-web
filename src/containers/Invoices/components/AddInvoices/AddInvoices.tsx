import React, { useState, ChangeEventHandler, ReactElement, useMemo } from "react";
import classNames from "classnames";
import { FilePreview } from "../FilePreview";
import { InvoiceTile, InvoiceTileVariant } from "../../../../shared/components";
import "./index.scss";
import { useSelector } from "react-redux";
import { getScreenSize } from "../../../../shared/store/selectors";
import { ScreenSize } from "../../../../shared/constants";
import { formatPrice } from "../../../../shared/utils";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface AddInvoicesProps {
  className?: string;
}

interface IFile {
  data: File | [];
  amount: number
}

export default function AddInvoices(props: AddInvoicesProps): ReactElement {
  const { className } = props;
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const totalAmount = selectedFiles.map((file: IFile) => file.amount).reduce((a: number, b: number) => a + b, 0);

  console.log(selectedFiles);

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelectedFiles((selectedFiles: IFile[]) => [
      ...selectedFiles,
      { data: event.target.files ? event.target.files[0] : [], amount: 0 }
    ])
    setShowFilePreview(true);
  };

  const uploadedInvoices = useMemo(() => selectedFiles.map((file: any, index: number) => {
    return (
      <InvoiceTile
        key={index}
        imageSrc={URL.createObjectURL((file as any).data)}
        alt={file.data.name}
        amount={file.amount * 100}
        onDelete={() => setSelectedFiles(selectedFiles.splice(index, 1))}
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
                setSelectedFiles(selectedFiles.splice(0, selectedFiles.length - 1));
              }}
              onContinue={(amount: number | undefined) => {
                setShowFilePreview(false);
                setSelectedFiles((selectedFiles: IFile[]) => [
                  ...selectedFiles.splice(0, selectedFiles.length - 1),
                  { ...selectedFiles[selectedFiles.length - 1], amount: Number(amount) }
                ])
              }} />)}
          <span>{`Total invoices amount: ${formatPrice(totalAmount * 100)}`}</span>
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
