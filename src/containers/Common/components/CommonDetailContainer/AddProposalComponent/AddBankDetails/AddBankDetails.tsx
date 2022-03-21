import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./index.scss";

interface IProps {
  onBankDetails: () => void;
}

export const AddBankDetails = ({ onBankDetails }: IProps) => {
  const dispatch = useDispatch();

  return (
    <div className="add-bank-details-wrapper">
      <div className="add-bank-details-title">Add Bank Account</div>
      <div className="add-bank-details-description">
        The following details are required inorder to transfer funds <br /> to
        you after your proposal is approved
      </div>
      <div className="add-bank-details-content">

      </div>
    </div>
  );
};
