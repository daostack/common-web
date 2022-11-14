import React, { FC } from "react";
import { useSelector } from "react-redux";
import { BANKS_OPTIONS } from "@/shared/assets/banks";
import {
  Modal,
  Button,
  ButtonVariant,
  DeletePrompt,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { BankAccountDetails } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface BankAccountInfoProps {
  bankAccount: BankAccountDetails;
  onBankAccountChange: () => void;
  onBankAccountDelete: () => void;
  isDeletingInProgress: boolean;
  showDeletePrompt: boolean;
  setShowDeletePrompt: (showDeletePrompt: boolean) => void;
}

const BankAccountInfo: FC<BankAccountInfoProps> = (props) => {
  const {
    bankAccount,
    onBankAccountChange,
    onBankAccountDelete,
    isDeletingInProgress,
    showDeletePrompt,
    setShowDeletePrompt,
  } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const bankName = BANKS_OPTIONS.find(
    (bank) => bank.value === bankAccount.bankCode,
  )?.name;

  const detailsButtons = (
    <div className="billing-bank-account-info__details-buttons-wrapper">
      <Button
        className="billing-bank-account-info__details-button edit-details"
        variant={ButtonVariant.Secondary}
        onClick={onBankAccountChange}
        shouldUseFullWidth={isMobileView}
      >
        Edit Details
      </Button>
      {
        //FIXME: uncomment this after an issues with bank account's deleting will be resolved on the BE
        /* <Button
        className="billing-bank-account-info__details-button delete-details"
        variant={ButtonVariant.Secondary}
        onClick={() => setShowDeletePrompt(true)}
        shouldUseFullWidth={isMobileView}
      >
        Delete
      </Button> */
      }
    </div>
  );

  return (
    <>
      <Modal
        isShowing={showDeletePrompt}
        onClose={() => true}
        withoutHeader
        className="billing-bank-account-info__delete-prompt-modal"
      >
        <DeletePrompt
          onCancel={() => setShowDeletePrompt(false)}
          onDelete={onBankAccountDelete}
          isDeletingInProgress={isDeletingInProgress}
        />
      </Modal>
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
          {!isMobileView && detailsButtons}
        </div>
        {isMobileView && (
          <>
            <p className="billing-bank-account-info__hint">
              These details are needed in order to transfer funds to your
              account and visible to you only.
            </p>
            {detailsButtons}
          </>
        )}
      </div>
    </>
  );
};

export default BankAccountInfo;
