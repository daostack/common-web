import React, { useCallback } from 'react';

import { ModalFooter } from "../../../../../../../shared/components/Modal";
import "./index.scss";

interface GeneralInfoProps {
}

export default function GeneralInfo({}: GeneralInfoProps) {
  const handleContinueClick = useCallback(() => {
    console.log("handleContinueClick");
  }, []);

  return (
    <>
      <div className="create-common-general-info">
        GeneralInfo
      </div>
      <ModalFooter sticky>
        <div className="create-common-general-info__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            Continue to Funding
          </button>
        </div>
      </ModalFooter>
    </>
  );
}
