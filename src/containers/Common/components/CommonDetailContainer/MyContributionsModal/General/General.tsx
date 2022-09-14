import React, { useEffect, useMemo, FC } from "react";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Button, ButtonVariant, ModalFooter } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { DateFormat, Payment, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem, HistoryListItemStyles } from "../HistoryListItem";
import { useMyContributionsContext } from "../context";
import "./index.scss";

interface GeneralProps {
  payments: Payment[];
  subscription: Subscription | null;
  commonName: string;
  goToMonthlyContribution: () => void;
  goToOneTimeContribution: () => void;
  goToChangeMonthlyContribution: () => void;
}

const General: FC<GeneralProps> = (props) => {
  const {
    payments,
    subscription,
    commonName,
    goToMonthlyContribution,
    goToOneTimeContribution,
    goToChangeMonthlyContribution,
  } = props;
  const { setTitle } = useMyContributionsContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const dueDate = subscription?.dueDate?.seconds || firebase.firestore.Timestamp.now().seconds;
  const total = useMemo(
    () => payments.reduce((acc, payment) => acc + payment.price.amount, 0),
    [payments]
  );
  const oneTimePayments = useMemo(
    () => payments.filter((payment) => !payment.subscriptionId),
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
          Your total contributions
        </span>
        <span className="general-my-contributions-stage__total">
          {formatPrice(total, { shouldRemovePrefixFromZero: false })}
        </span>
      </div>
      <section className="general-my-contributions-stage__history">
        {payments.length > 0 ? (
          <>
            <h3 className="general-my-contributions-stage__section-title">
              History
            </h3>
            <ul className="general-my-contributions-stage__list">
              {subscription && (
                <HistoryListItem
                  title="Monthly Contribution"
                  description={`Next payment: ${formatDate(
                    new Date(dueDate * 1000),
                    DateFormat.LongHuman
                  )}`}
                  amount={formatPrice(subscription.price.amount, {bySubscription: true})}
                  onClick={goToMonthlyContribution}
                  styles={itemStyles}
                />
              )}
              {oneTimePayments.map((payment) => (
                <HistoryListItem
                  key={payment.id}
                  title="One-time Contribution"
                  description={formatDate(
                    new Date(payment.createdAt.seconds * 1000),
                    DateFormat.LongHuman
                  )}
                  amount={formatPrice(payment.price.amount, {
                    shouldRemovePrefixFromZero: false,
                  })}
                  styles={itemStyles}
                />
              ))}
            </ul>
          </>
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
        <ModalFooter sticky>
          <div
            className={classNames(
              "general-my-contributions-stage__buttons-wrapper",
            )}
          >
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
                onClick={goToChangeMonthlyContribution}
                shouldUseFullWidth
              >
                {subscription  ? 'Change my' : 'Create'} monthly contribution
              </Button>
          </div>
        </ModalFooter>
      </section>
    </div>
  );
};

export default General;
