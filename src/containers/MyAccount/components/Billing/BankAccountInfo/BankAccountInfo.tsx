import React, { FC } from "react";
import { useSelector } from "react-redux";
import { BANKS_OPTIONS } from "@/shared/assets/banks";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { BankAccountDetails } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface BankAccountInfoProps {
  bankAccount: BankAccountDetails;
  onBankAccountChange: () => void;
}

const BankAccountInfo: FC<BankAccountInfoProps> = (props) => {
  const { bankAccount, onBankAccountChange } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const bankName = BANKS_OPTIONS.find(
    (bank) => bank.value === bankAccount.bankCode
  )?.name;

  const buttonEl = (
    <Button
      className="billing-bank-account-info__details-button"
      variant={ButtonVariant.Secondary}
      onClick={onBankAccountChange}
      shouldUseFullWidth
    >
      Edit Details
    </Button>
  );

  return (
    <div className="billing-bank-account-info">
      <div className="billing-bank-account-info__details">
        <ul className="billing-bank-account-info__details-list">
          <li className="billing-bank-account-info__details-list-item">
            <strong>ID Number</strong>
            <span>{bankAccount.socialId}</span>
          </li>
          <li className="billing-bank-account-info__details-list-item">
            <strong>Bank Name</strong>
            <span>{bankName}</span>
          </li>
          <li className="billing-bank-account-info__details-list-item">
            <strong>Branch</strong>
            <span>{bankAccount.branchNumber}</span>
          </li>
          <li className="billing-bank-account-info__details-list-item">
            <strong>Account</strong>
            <span>{bankAccount.accountNumber}</span>
          </li>
        </ul>
        {!isMobileView && buttonEl}
      </div>
      {isMobileView && (
        <>
          <p className="billing-bank-account-info__hint">
            These details are needed in order to transfer funds to your account
            and visible to you only.
          </p>
          {buttonEl}
        </>
      )}
    </div>
  );
};

export default BankAccountInfo;
