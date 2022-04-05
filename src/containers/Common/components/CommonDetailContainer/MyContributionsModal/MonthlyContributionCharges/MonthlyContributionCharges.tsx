import React, { useEffect, useMemo, FC } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonLink,
  ButtonVariant,
  ModalFooter,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { DateFormat, Payment, PaymentType } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem, HistoryListItemStyles } from "../HistoryListItem";
import { useMyContributionsContext } from "../context";
import "./index.scss";

interface MonthlyContributionChargesProps {
  payments: Payment[];
  goToOneTimeContribution: () => void;
  goToChangeMonthlyContribution: () => void;
  goToReplacePaymentMethod: () => void;
}

const MonthlyContributionCharges: FC<MonthlyContributionChargesProps> = (
  props
) => {
  const {
    payments,
    goToOneTimeContribution,
    goToChangeMonthlyContribution,
    goToReplacePaymentMethod,
  } = props;
  const { setTitle } = useMyContributionsContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const monthlyPayments = useMemo(
    () =>
      payments.filter((payment) => payment.type === PaymentType.Subscription),
    [payments]
  );

  const itemStyles: HistoryListItemStyles | undefined = isMobileView
    ? {
        item: "monthly-contribution-my-contributions-stage__list-item",
        title: "monthly-contribution-my-contributions-stage__list-item-title",
      }
    : undefined;

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

  const buttonWrapperEl = (
    <div className="monthly-contribution-my-contributions-stage__buttons-wrapper">
      <Button
        className="monthly-contribution-my-contributions-stage__button"
        onClick={goToOneTimeContribution}
        variant={ButtonVariant.SecondaryPurple}
        shouldUseFullWidth
      >
        Add a one-time contribution
      </Button>
      <Button
        className="monthly-contribution-my-contributions-stage__button"
        onClick={goToChangeMonthlyContribution}
        shouldUseFullWidth
      >
        Change my monthly contribution
      </Button>
    </div>
  );

  return (
    <div className="monthly-contribution-my-contributions-stage">
      <section>
        <h3 className="monthly-contribution-my-contributions-stage__section-title">
          Monthly contribution charges
        </h3>
        <ul className="monthly-contribution-my-contributions-stage__list">
          {monthlyPayments.map((payment) => (
            <HistoryListItem
              key={payment.id}
              title={formatDate(
                new Date(payment.createdAt.seconds * 1000),
                DateFormat.LongHuman
              )}
              amount={formatPrice(payment.amount.amount, {
                shouldRemovePrefixFromZero: false,
              })}
              styles={itemStyles}
            />
          ))}
        </ul>
      </section>
      <ButtonLink
        className="monthly-contribution-my-contributions-stage__edit-link"
        onClick={goToReplacePaymentMethod}
      >
        Edit payment details
      </ButtonLink>
      {isMobileView ? (
        <ModalFooter sticky>{buttonWrapperEl}</ModalFooter>
      ) : (
        buttonWrapperEl
      )}
    </div>
  );
};

export default MonthlyContributionCharges;
