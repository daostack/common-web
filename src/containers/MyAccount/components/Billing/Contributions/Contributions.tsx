import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Modal, PaymentMethod } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import QuestionOutlineIcon from "@/shared/icons/questionOutline.icon";
import { ModalType } from "@/shared/interfaces";
import { Payment, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { ContributionList } from "../ContributionList";
import { ChangePaymentMethod } from "../ChangePaymentMethod";
import { PaymentMethodUpdateSuccess } from "../PaymentMethodUpdateSuccess";
import "./index.scss";

interface ContributionsProps {
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
}

const Contributions: FC<ContributionsProps> = (props) => {
  const { contributions, subscriptions } = props;

  return (
    <>
      <ContributionList
        contributions={contributions}
        subscriptions={subscriptions}
      />
    </>
  );
};

export default Contributions;
