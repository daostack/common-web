import React, { useEffect, useState } from "react";
import { PaymeTypeCodes } from "@/shared/interfaces/api/payMe";
import { Button, Loader } from "../../../../shared/components";
import { InvoicesSubmission } from "../../../../shared/models";
import { uploadFile } from "../../../../shared/utils/firebaseUploadFile";
import { uploadInvoices } from "../../api";
import { IFile } from "../AddInvoices/AddInvoices";
import { UploadState } from "./UploadPrompt";

interface IProps {
  proposalId: string;
  selectedFiles: IFile[];
  updateUploadState: (uploadState: UploadState) => void;
  payoutDocsComment?: string;
}

export default function PendingUpload({ proposalId, selectedFiles, updateUploadState, payoutDocsComment }: IProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const invoicesData: InvoicesSubmission = {
          proposalId,
          payoutDocs: [],
          payoutDocsComment: payoutDocsComment
        };

        await Promise.all(selectedFiles.map(async (file: IFile) => {
          const downloadURL = await uploadFile(file.data.name, "public_img", file.data);
          invoicesData.payoutDocs.push({
            name: file.data.name,
            legalType: PaymeTypeCodes.Invoice,
            amount: file.amount * 100,
            mimeType: file.data.type,
            downloadURL: downloadURL
          })
        }));

        await uploadInvoices(invoicesData);
        updateUploadState(UploadState.Success);
      } catch (e) {
        let errorText = "Something went wrong :/";
        if (e instanceof Error) {
          errorText = e.message;
        }
        setError(errorText);
        console.error(e);
      }
    })();
  }, [selectedFiles, updateUploadState, proposalId, payoutDocsComment])

  return (
    <div className="pending-upload-wrapper">
      {!error ? <Loader /> : <Button onClick={() => updateUploadState(UploadState.PreUpload)}>Try Again</Button>}
      <span>{!error ? "Uploading Invoices..." : <span className="upload-error-text">{error}</span>}</span>
    </div>
  )
}
