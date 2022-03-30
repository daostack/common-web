import React, { useMemo, FC } from "react";
import { DateFormat, Payment, PaymentType } from "@/shared/models";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem } from "../HistoryListItem";
import "./index.scss";

interface GeneralProps {
  payments: Payment[];
}

const General: FC<GeneralProps> = (props) => {
  const { payments } = props;
  const total = useMemo(
    () => payments.reduce((acc, payment) => acc + payment.amount.amount, 0),
    [payments]
  );
  const oneTimePayments = useMemo(
    () => payments.filter((payment) => payment.type === PaymentType.OneTime),
    [payments]
  );
  const monthlyPayments = useMemo(
    () =>
      payments.filter((payment) => payment.type === PaymentType.Subscription),
    [payments]
  );

  return (
    <div className="general-my-contributions-stage">
      <div className="general-my-contributions-stage__total-wrapper">
        <span className="general-my-contributions-stage__total-text">
          To this day, I have contributed to this common
        </span>
        <span className="general-my-contributions-stage__total">
          {formatPrice(total)}
        </span>
      </div>
      <section className="general-my-contributions-stage__history">
        <h3 className="general-my-contributions-stage__section-title">
          History
        </h3>
        <ul className="general-my-contributions-stage__list">
          {oneTimePayments.map((payment) => (
            <HistoryListItem
              key={payment.id}
              title="One-time Contribution"
              description={formatDate(
                new Date(payment.createdAt.seconds * 1000),
                DateFormat.LongHuman
              )}
              amount={payment.amount.amount}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default General;
