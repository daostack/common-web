import React, { useEffect, useMemo, FC } from "react";
import { Button, ButtonLink, ButtonVariant } from "@/shared/components";
import { DateFormat, Payment, PaymentType } from "@/shared/models";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem } from "../HistoryListItem";
import { useMyContributionsContext } from "../context";
import "./index.scss";

interface MonthlyContributionChargesProps {
  payments: Payment[];
  goToOneTimeContribution: () => void;
}

const MonthlyContributionCharges: FC<MonthlyContributionChargesProps> = (
  props
) => {
  const { payments, goToOneTimeContribution } = props;
  const { setTitle } = useMyContributionsContext();
  const monthlyPayments = useMemo(
    () =>
      payments.filter((payment) => payment.type === PaymentType.Subscription),
    [payments]
  );

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

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
            />
          ))}
        </ul>
      </section>
      <ButtonLink className="monthly-contribution-my-contributions-stage__edit-link">
        Edit payment details
      </ButtonLink>
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
          shouldUseFullWidth
        >
          Change my monthly contribution
        </Button>
      </div>
    </div>
  );
};

export default MonthlyContributionCharges;
