import React, { FC, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddBankDetails } from "@/pages/Common/components/CommonDetailContainer/AddProposalComponent/AddBankDetails/AddBankDetails";
import { deleteBankDetails } from "@/pages/Common/store/actions";
import { Modal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { BankAccountDetails } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { BankAccountInfo } from "../BankAccountInfo";
import "./index.scss";

interface BankAccountProps {
  bankAccount: BankAccountDetails | null;
  onBankAccountChange: (data: BankAccountDetails | null) => void;
}

const BankAccount: FC<BankAccountProps> = (props) => {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const { bankAccount, onBankAccountChange } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const shouldShowContent = !isMobileView || !isEditing;

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const startDeleting = useCallback(() => {
    if (isDeleting) return;

    setIsDeleting(true);

    dispatch(
      deleteBankDetails.request({
        callback: (error, data) => {
          setIsDeleting(false);
          setShowDeletePrompt(false);

          if (error || !data) {
            console.error(
              error?.message ||
                "[Delete bank account details] Has not executed",
            );
            notify("Error: couldn't delete bank account details");
            return;
          }

          onBankAccountChange(null);
          notify("Bank account successfully deleted!");
        },
      }),
    );
  }, [isDeleting, setIsDeleting, dispatch, notify]);

  const handleBankDetailsUpdateFinish = (data: BankAccountDetails) => {
    onBankAccountChange(data);
    stopEditing();
  };

  const handleCancel = () => {
    window.scrollTo(0, 0);
    stopEditing();
  };

  const contentEl = !bankAccount ? (
    <AddingCard
      text="You must provide bank account details in order to receive funds."
      imageSrc="/assets/images/membership-request-introduce.svg"
      imageAlt="Add bank account"
      buttonText="Add Bank Account"
      onClick={startEditing}
    />
  ) : (
    <BankAccountInfo
      bankAccount={bankAccount}
      onBankAccountChange={startEditing}
      onBankAccountDelete={startDeleting}
      isDeletingInProgress={isDeleting}
      showDeletePrompt={showDeletePrompt}
      setShowDeletePrompt={setShowDeletePrompt}
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
          onBankDetailsAfterError={onBankAccountChange}
          initialBankAccountDetails={bankAccount}
          onCancel={handleCancel}
        />
      )}
      {isEditing && !isMobileView && (
        <Modal isShowing onClose={stopEditing} closePrompt>
          <AddBankDetails
            onBankDetails={handleBankDetailsUpdateFinish}
            onBankDetailsAfterError={onBankAccountChange}
            initialBankAccountDetails={bankAccount}
          />
        </Modal>
      )}
    </>
  );
};

export default BankAccount;
