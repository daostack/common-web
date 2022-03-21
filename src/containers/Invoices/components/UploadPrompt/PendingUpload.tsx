import { PAYME_TYPE_CODES } from "@/shared/interfaces/api/payMe";
import React, { useEffect } from "react";
import { Loader } from "../../../../shared/components";
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

  useEffect(() => {
    (async () => {
      try {
        const invoicesData: InvoicesSubmission = {
          proposalID: proposalId,
          payoutDocs: [],
          payoutDocsComment: payoutDocsComment
        };

        await Promise.all(selectedFiles.map(async (file: IFile) => {
          const downloadURL = await uploadFile(file.data.name, "public_img", file.data);
          invoicesData.payoutDocs.push({
            name: file.data.name,
            legalType: PAYME_TYPE_CODES.Invoice,
            amount: file.amount * 100,
            mimeType: file.data.type,
            downloadURL: downloadURL
          })
        }));

        await uploadInvoices(invoicesData);
        updateUploadState(UploadState.Success);
      } catch (error) {
        console.error(error);
        // TODO: Need to show error to the user
        updateUploadState(UploadState.PreUpload);
      }
    })();
  }, [selectedFiles, updateUploadState, proposalId, payoutDocsComment])

  return (
    <div className="pending-upload-wrapper">
      <Loader />
      <span>Uploading Invoices...</span>
    </div>
  )
}
