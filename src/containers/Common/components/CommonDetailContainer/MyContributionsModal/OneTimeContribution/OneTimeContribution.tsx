import React, { useEffect, useMemo, FC, ReactNode } from "react";
import { Separator } from "@/shared/components";
import { DateFormat, Payment, PaymentType } from "@/shared/models";
import { formatDate, formatPrice } from "@/shared/utils";
import { HistoryListItem } from "../HistoryListItem";
import "./index.scss";

interface OneTimeContributionProps {
  setTitle: (title: ReactNode) => void;
}

const OneTimeContribution: FC<OneTimeContributionProps> = (props) => {
  const { setTitle } = props;

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

  return (
    <section className="one-time-my-contributions-stage">
      <h3 className="one-time-my-contributions-stage__title">
        Make one-time contribution
      </h3>
      <p className="one-time-my-contributions-stage__description">
        Select the amount for your one-time contribution to this Common. The
        funds will be added to the Common balance.
      </p>
      <Separator className="one-time-my-contributions-stage__separator" />
    </section>
  );
};

export default OneTimeContribution;
