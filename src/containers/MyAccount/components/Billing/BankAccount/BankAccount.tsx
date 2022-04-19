import React, { useState, FC } from "react";
import { useSelector } from "react-redux";
import { AddBankDetails } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddBankDetails/AddBankDetails";
import { Modal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { BankAccountDetails } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { BankAccountInfo } from "../BankAccountInfo";
import "./index.scss";

interface BankAccountProps {
  bankAccount: BankAccountDetails | null;
  onBankAccountChange: (data: BankAccountDetails) => void;
}

const BankAccount: FC<BankAccountProps> = (props) => {
  const { bankAccount, onBankAccountChange } = props;
  const [isEditing, setIsEditing] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const shouldShowContent = !isMobileView || !isEditing;

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const handleBankDetailsUpdateFinish = (data: BankAccountDetails) => {
    onBankAccountChange(data);
    stopEditing();
  };

  const contentEl = !bankAccount ? (
    <AddingCard
      text="You must provide bank account details in order to receive funds."
      imageSrc="/assets/images/add-bank-account.svg"
      imageAlt="Add bank account"
      buttonText="Add Bank Account"
      onClick={startEditing}
    />
  ) : (
    <BankAccountInfo
      bankAccount={bankAccount}
      onBankAccountChange={startEditing}
    />
  );

  return (
    <>
      {shouldShowContent ? (
        contentEl
      ) : (
        <AddBankDetails
          className="billing-bank-account__form"
          descriptionClassName="billing-bank-account__description"
          title={null}
          onBankDetails={handleBankDetailsUpdateFinish}
          initialBankAccountDetails={bankAccount}
        />
      )}
      {isEditing && !isMobileView && (
        <Modal isShowing onClose={stopEditing} closePrompt>
          <AddBankDetails
            onBankDetails={handleBankDetailsUpdateFinish}
            initialBankAccountDetails={bankAccount}
          />
        </Modal>
      )}
    </>
  );
};

export default BankAccount;
