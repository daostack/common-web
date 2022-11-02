import React, {
  useState,
  ChangeEventHandler,
  ReactElement,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import {
  InvoiceTile,
  InvoiceTileVariant,
  DeletePrompt,
} from "@/shared/components";
import { ScreenSize } from "../../../../shared/constants";
import { getScreenSize } from "../../../../shared/store/selectors";
import { formatPrice } from "../../../../shared/utils";
import { AmountPrompt } from "../AmountPrompt";
import { FilePreview } from "../FilePreview";
import { UploadPrompt } from "../UploadPrompt";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface AddInvoicesProps {
  proposalId: string;
  proposalRequest?: number;
  updateSubmissionStatus: () => void;
  className?: string;
}

export interface IFile {
  data: File;
  amount: number;
}

const removeInvoice = (invoices: IFile[], indexToRemove: number) =>
  invoices.filter((invoice, index) => index !== indexToRemove);

export default function AddInvoices(props: AddInvoicesProps): ReactElement {
  const { proposalId, proposalRequest, updateSubmissionStatus, className } =
    props;
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const totalAmount = selectedFiles
    .map((file) => file.amount)
    .reduce((a, b) => a + b, 0);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedInvoiceIndexToDelete, setSelectedInvoiceIndexToDelete] =
    useState<number | null>(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [showInsertAmountPrompt, setShowInsertAmountPrompt] = useState(false);
  const fileForPreview =
    showFilePreview && selectedFiles.length > 0
      ? selectedFiles[selectedFiles.length - 1].data
      : null;

  const selectFiles: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    setSelectedFiles((selectedFiles) => [
      ...selectedFiles,
      { data: file, amount: 0 },
    ]);
    setShowFilePreview(true);
  };

  const onDeletePromptClose = useCallback(() => {
    setShowDeletePrompt(false);
  }, []);

  const onInvoiceDeleteFromFilePreview = useCallback(() => {
    setSelectedFiles((selectedFiles) =>
      removeInvoice(selectedFiles, selectedFiles.length - 1),
    );
    onDeletePromptClose();
    setShowFilePreview(false);
  }, [onDeletePromptClose]);

  const onInvoiceDelete = useCallback(() => {
    if (selectedInvoiceIndexToDelete !== null) {
      setSelectedFiles((selectedFiles) =>
        removeInvoice(selectedFiles, selectedInvoiceIndexToDelete),
      );
    }

    onDeletePromptClose();
    setSelectedInvoiceIndexToDelete(null);
  }, [selectedInvoiceIndexToDelete, onDeletePromptClose]);

  const onFileUploadFinish = useCallback((amount?: number) => {
    setSelectedFiles((selectedFiles) =>
      selectedFiles.map((selectedFile, index) =>
        index === selectedFiles.length - 1
          ? { ...selectedFile, amount: amount || 0 }
          : selectedFile,
      ),
    );
    setShowFilePreview(false);
    setShowInsertAmountPrompt(false);
  }, []);

  const uploadedInvoices = useMemo(
    () =>
      selectedFiles.map(({ data, amount }, index) => {
        return (
          <InvoiceTile
            key={index}
            fileURL={URL.createObjectURL(data)}
            fileName={data.name}
            isImage={data.type.startsWith("image/")}
            amount={amount * 100}
            onDelete={() => {
              setShowDeletePrompt(true);
              setSelectedInvoiceIndexToDelete(index);
            }}
            variant={
              screenSize === ScreenSize.Mobile
                ? InvoiceTileVariant.FullWidth
                : InvoiceTileVariant.Square
            }
          />
        );
      }),
    [selectedFiles, screenSize],
  );

  const topFilePreviewContent = useMemo(
    () => (
      <div className="add-invoices-wrapper__file-preview-top-wrapper">
        <img
          className="add-invoices-wrapper__file-preview-delete-icon"
          src="/icons/trash.svg"
          alt="trash"
          onClick={() => setShowDeletePrompt(true)}
        />
      </div>
    ),
    [],
  );

  const bottomFilePreviewContent = useMemo(
    () => (
      <div className="add-invoices-wrapper__file-preview-bottom-wrapper">
        {!showInsertAmountPrompt ? (
          <button
            className="button-blue"
            onClick={() => setShowInsertAmountPrompt(true)}
          >
            Add invoice amount
          </button>
        ) : (
          <AmountPrompt
            onContinue={onFileUploadFinish}
            proposalRequest={proposalRequest ? proposalRequest / 100 : 0}
            totalAmount={totalAmount}
          />
        )}
      </div>
    ),
    [showInsertAmountPrompt, onFileUploadFinish, totalAmount, proposalRequest],
  );

  return (
    <div className={classNames("add-invoices-wrapper", className)}>
      <div className="invoices-container">
        <label className="add-invoice-button">
          <input
            type="file"
            onChange={selectFiles}
            accept={ACCEPTED_EXTENSIONS}
          />
          <img src="/icons/upload-file.svg" alt="upload file" />
          Add Invoices
        </label>
        {uploadedInvoices}
      </div>
      {selectedFiles.length > 0 && (
        <div className="upload-wrapper">
          {fileForPreview && (
            <FilePreview
              fileURL={URL.createObjectURL(fileForPreview)}
              fileName={fileForPreview.name}
              fileType={fileForPreview.type}
              topContent={topFilePreviewContent}
              bottomContent={bottomFilePreviewContent}
              styles={{
                previewImage: {
                  default: showInsertAmountPrompt
                    ? "add-invoices-wrapper__file-preview-image--shrink"
                    : undefined,
                },
              }}
            />
          )}
          <span className="add-invoices__total-amount-label">
            Total invoices amount: {formatPrice(totalAmount * 100)}
          </span>
          <button
            className="button-blue"
            disabled={!selectedFiles}
            onClick={() => setShowUploadPrompt(true)}
          >
            Done with uploading all invoices
          </button>
        </div>
      )}
      {showDeletePrompt && (
        <DeletePrompt
          onCancel={onDeletePromptClose}
          onDelete={
            showFilePreview ? onInvoiceDeleteFromFilePreview : onInvoiceDelete
          }
        />
      )}
      {showUploadPrompt && (
        <UploadPrompt
          proposalId={proposalId}
          selectedFiles={selectedFiles}
          onCancel={() => setShowUploadPrompt(false)}
          invoicesTotal={formatPrice(totalAmount * 100)}
          proposalRequest={formatPrice(proposalRequest)}
          updateSubmissionStatus={updateSubmissionStatus}
        />
      )}
    </div>
  );
}
