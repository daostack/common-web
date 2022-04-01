import React, { useEffect, useMemo, FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { DateFormat, Payment, PaymentType } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem, HistoryListItemStyles } from "../HistoryListItem";
import { useMyContributionsContext } from "../context";
import "./index.scss";

interface GeneralProps {
  payments: Payment[];
  commonName: string;
  goToMonthlyContribution: () => void;
  goToOneTimeContribution: () => void;
}

const General: FC<GeneralProps> = (props) => {
  const {
    payments,
    commonName,
    goToMonthlyContribution,
    goToOneTimeContribution,
  } = props;
  const { setTitle } = useMyContributionsContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const total = useMemo(
    () => payments.reduce((acc, payment) => acc + payment.amount.amount, 0),
    [payments]
  );
  const oneTimePayments = useMemo(
    () => payments.filter((payment) => payment.type === PaymentType.OneTime),
    [payments]
  );

  const itemStyles: HistoryListItemStyles | undefined = isMobileView
    ? {
        item: "general-my-contributions-stage__list-item",
      }
    : undefined;

  useEffect(() => {
    setTitle(commonName);
  }, [setTitle, commonName]);

  return (
    <div className="general-my-contributions-stage">
      <div className="general-my-contributions-stage__total-wrapper">
        <span className="general-my-contributions-stage__total-text">
          To this day, I have contributed to this common
        </span>
        <span className="general-my-contributions-stage__total">
          {formatPrice(total, { shouldRemovePrefixFromZero: false })}
        </span>
      </div>
      {payments.length > 0 ? (
        <section className="general-my-contributions-stage__history">
          <h3 className="general-my-contributions-stage__section-title">
            History
          </h3>
          <ul className="general-my-contributions-stage__list">
            <HistoryListItem
              title="Monthly Contribution"
              description={`Next payment: 20 March 2022`}
              amount={`₪10/mo`}
              onClick={goToMonthlyContribution}
              styles={itemStyles}
            />
            {oneTimePayments.map((payment) => (
              <HistoryListItem
                key={payment.id}
                title="One-time Contribution"
                description={formatDate(
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
          <div className="general-my-contributions-stage__buttons-wrapper">
            <Button
              className="general-my-contributions-stage__button"
              onClick={goToOneTimeContribution}
              variant={ButtonVariant.SecondaryPurple}
              shouldUseFullWidth
            >
              Add a one-time contribution
            </Button>
            <Button
              className="general-my-contributions-stage__button"
              shouldUseFullWidth
            >
              Change my monthly contribution
            </Button>
          </div>
        </section>
      ) : (
        <div className="general-my-contributions-stage__empty-contributions">
          <img
            className="general-my-contributions-stage__funds-image"
            src="/assets/images/membership-request-funds.svg"
            alt="No contributions"
          />
          <p className="general-my-contributions-stage__empty-contributions-text">
            You don't have any active contributions yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default General;
