import React, { useEffect } from "react";
import { Loader } from "../../../../shared/components";
import { InvoicesSubmission, PAYME_TYPE_CODES } from "../../../../shared/models";
import { uploadFile } from "../../../../shared/utils/firebaseUploadFile";
import { uploadInvoices } from "../../api";
import { IFile } from "../AddInvoices/AddInvoices";
import { UploadState } from "./UploadPrompt";

interface IProps {
  proposalId: string
  selectedFiles: IFile[]
  updateUploadState: Function
}

export default function PendingUpload({ proposalId, selectedFiles, updateUploadState }: IProps) {

  useEffect(() => {
    (async () => {
      try {
        const invoicesData: InvoicesSubmission = {
          proposalID: proposalId,
          legalDocsInfo: []
        };

        for (const file of selectedFiles) {
          const downloadURL = await uploadFile(file.data.name, "public_img", file.data);
          invoicesData.legalDocsInfo.push({
            name: file.data.name,
            legalType: PAYME_TYPE_CODES.Invoice,
            amount: file.amount,
            mimeType: file.data.type,
            downloadURL: downloadURL
          })
        }
        const res = await uploadInvoices(invoicesData);
        console.log(res);
        updateUploadState(UploadState.Success);
      } catch (error) {
        console.error(error);
        // TODO: Need to show error to the user
        updateUploadState(UploadState.PreUpload);
      }
    })();
  }, [selectedFiles, updateUploadState, proposalId])

  return (
    <div className="pending-upload-wrapper">
      <Loader />
      <span>Uploading Invoices...</span>
    </div>
  )
}
