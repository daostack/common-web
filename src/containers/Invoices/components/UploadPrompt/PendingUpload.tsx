import React, { useEffect } from "react";
import { Loader } from "../../../../shared/components";

interface IProps {
  updateUploadState: () => void
}

export default function PendingUpload({ updateUploadState }: IProps) {

  // TODO: temporary
  useEffect(() => {
    setTimeout(() => { updateUploadState(); }, 1000);
  }, [updateUploadState])

  return (
    <div className="pending-upload-wrapper">
      <Loader />
      <span>Uploading Invoices...</span>
    </div>
  )
}
