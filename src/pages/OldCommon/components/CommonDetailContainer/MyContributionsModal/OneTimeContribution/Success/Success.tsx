import React, { useEffect, FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  onFinish: () => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onFinish, setShouldShowGoBackButton } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  useEffect(() => {
    setShouldShowGoBackButton(false);
  }, [setShouldShowGoBackButton]);

  const contentEl = (
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

  return isMobileView ? (
    <Modal isShowing onClose={onFinish} type={ModalType.MobilePopUp}>
      {contentEl}
    </Modal>
  ) : (
    contentEl
  );
};

export default Success;
