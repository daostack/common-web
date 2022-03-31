import React, { useEffect, FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface SuccessProps {
  onFinish: () => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onFinish, setShouldShowGoBackButton } = props;

  useEffect(() => {
    setShouldShowGoBackButton(false);
  }, [setShouldShowGoBackButton]);

  return (
    <section className="one-time-success-my-contributions-stage">
      <img
        className="one-time-success-my-contributions-stage__image"
        src="/assets/images/membership-request-created.svg"
        alt="Request created"
      />
      <h3 className="one-time-success-my-contributions-stage__title">
        Contribution was sent
      </h3>
      <Button
        className="one-time-success-my-contributions-stage__button"
        onClick={onFinish}
        variant={ButtonVariant.Secondary}
        shouldUseFullWidth
      >
        OK
      </Button>
    </section>
  );
};

export default Success;
