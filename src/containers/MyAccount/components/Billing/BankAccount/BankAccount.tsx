import React, { FC } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonVariant,
  Modal,
  PaymentMethod,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import QuestionOutlineIcon from "@/shared/icons/questionOutline.icon";
import { ModalType } from "@/shared/interfaces";
import { BankAccountDetails, Card } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { BankAccountInfo } from "../BankAccountInfo";
import { ChangePaymentMethod } from "../ChangePaymentMethod";
import { PaymentMethodUpdateSuccess } from "../PaymentMethodUpdateSuccess";
import "./index.scss";

interface BankAccountProps {
  bankAccount: BankAccountDetails | null;
  onBankAccountChange: () => void;
}

const BankAccount: FC<BankAccountProps> = (props) => {
  const { bankAccount, onBankAccountChange } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const shouldShowContent = true;

  const contentEl = !bankAccount ? (
    <AddingCard
      text="You must provide bank account details in order to receive funds."
      imageSrc="/assets/images/add-bank-account.svg"
      imageAlt="Add bank account"
      buttonText="Add Bank Account"
      onClick={onBankAccountChange}
    />
  ) : (
    <BankAccountInfo
      bankAccount={bankAccount}
      onBankAccountChange={onBankAccountChange}
    />
  );

  return (
    <>
      {
        shouldShowContent ? contentEl : null
        // <ChangePaymentMethod
        //   className="billing-payment-information__change-payment-method-wrapper"
        //   data={changePaymentMethodState}
        // />
      }
      {/*{shouldShowModal && (*/}
      {/*  <Modal*/}
      {/*    isShowing*/}
      {/*    onClose={onChangePaymentMethodStateClear}*/}
      {/*    title={changePaymentMethodState.createdCard ? "" : "Payment method"}*/}
      {/*    closePrompt={!changePaymentMethodState.createdCard}*/}
      {/*    type={isMobileView ? ModalType.MobilePopUp : ModalType.Default}*/}
      {/*  >*/}
      {/*    {changePaymentMethodState.createdCard ? (*/}
      {/*      <PaymentMethodUpdateSuccess*/}
      {/*        onFinish={onChangePaymentMethodStateClear}*/}
      {/*      />*/}
      {/*    ) : (*/}
      {/*      <div className="billing-payment-information__modal-content">*/}
      {/*        <ChangePaymentMethod data={changePaymentMethodState} />*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </Modal>*/}
      {/*)}*/}
    </>
  );
};

export default BankAccount;
